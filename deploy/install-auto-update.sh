#!/usr/bin/env bash
# Install a systemd timer that keeps this checkout in sync with main on
# GitHub, restarting the site whenever a new commit lands.
#
# Usage, from the checkout on the server:
#   sudo deploy/install-auto-update.sh [interval]    # default: 2min
#
# Afterwards:
#   systemctl list-timers farmcardscode-update.timer    # next run
#   journalctl -u farmcardscode-update -n 20            # what it did
#   sudo systemctl disable --now farmcardscode-update.timer   # turn off
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run with sudo" >&2
  exit 1
fi

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
interval="${1:-2min}"
service="farmcardscode"

if ! systemctl cat "$service.service" >/dev/null 2>&1; then
  echo "No $service.service found - is this the website server?" >&2
  exit 1
fi

chmod +x "$repo/deploy/auto-update.sh"

cat > /etc/systemd/system/farmcardscode-update.service <<EOF
[Unit]
Description=Pull main for www.farmcardscode.org and restart the site if it changed
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
Environment=SERVICE=$service
ExecStart=$repo/deploy/auto-update.sh
EOF

cat > /etc/systemd/system/farmcardscode-update.timer <<EOF
[Unit]
Description=Check GitHub for www.farmcardscode.org updates every $interval

[Timer]
OnBootSec=1min
OnUnitActiveSec=$interval

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now farmcardscode-update.timer

# Run once now so any problem (permissions, network) shows up immediately
if systemctl start farmcardscode-update.service; then
  echo "Installed. Checking for updates every $interval."
  journalctl -u farmcardscode-update -n 5 --no-pager
else
  echo "Installed, but the first run failed:" >&2
  journalctl -u farmcardscode-update -n 20 --no-pager >&2
  exit 1
fi
