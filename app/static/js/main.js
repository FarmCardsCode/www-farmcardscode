// The blinking cursor itself is a CSS ::after pseudo-element (see
// style.css) rather than DOM text, so it never affects this element's
// rendered width — only the character reveal happens here.
document.querySelectorAll(".typewriter").forEach((typeTarget) => {
  const text = typeTarget.textContent.trim();
  typeTarget.textContent = "";

  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      typeTarget.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 85);
    }
  }

  typeWriter();
});

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);

const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme === "light" || storedTheme === "dark") {
  root.setAttribute("data-theme", storedTheme);
}

function getActiveTheme() {
  const explicit = root.getAttribute("data-theme");
  if (explicit) return explicit;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function updateThemeButton() {
  if (!themeToggle) return;
  const activeTheme = getActiveTheme();
  // Icon-only button: the icon shows the mode a click switches to, and the
  // words live in the tooltip and accessible name
  const label = activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  themeToggle.querySelector('[data-icon="sun"]').toggleAttribute("hidden", activeTheme !== "dark");
  themeToggle.querySelector('[data-icon="moon"]').toggleAttribute("hidden", activeTheme === "dark");
  themeToggle.setAttribute("aria-label", label);
  themeToggle.title = label;
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = getActiveTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    updateThemeButton();
  });
}

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", () => {
    if (!localStorage.getItem("theme")) {
      updateThemeButton();
    }
  });

updateThemeButton();

// The CRT overlays (scanline sweep, noise, flicker) and the shell's signal
// glitch run continuously across the whole viewport. They keep playing while
// the window is merely unfocused (still visible beside another window), but
// pause via html[data-idle] (see style.css) while the tab is hidden, and
// resume exactly where they left off.
function setIdle(idle) {
  document.documentElement.toggleAttribute("data-idle", idle);
}

document.addEventListener("visibilitychange", () => setIdle(document.hidden));
setIdle(document.hidden);
