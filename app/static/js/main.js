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
  themeToggle.querySelector(".theme-toggle-label").textContent =
    activeTheme === "dark" ? "Light Mode" : "Dark Mode";
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

// The scanline sweep and noise jitter are full-viewport composites running
// every frame; neither is worth the cost while the tab is hidden or
// unfocused, so both pause via html[data-idle] (see style.css) and resume
// exactly where they left off.
function setIdle(idle) {
  document.documentElement.toggleAttribute("data-idle", idle);
}

window.addEventListener("blur", () => setIdle(true));
window.addEventListener("focus", () => setIdle(false));
document.addEventListener("visibilitychange", () => setIdle(document.hidden));
setIdle(document.hidden);
