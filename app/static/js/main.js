document.querySelectorAll(".typewriter").forEach((typeTarget) => {
  const text = typeTarget.textContent.trim();
  typeTarget.textContent = "";

  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      typeTarget.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 85);
    } else {
      setInterval(() => {
        typeTarget.textContent = typeTarget.textContent.endsWith("_")
          ? text
          : text + "_";
      }, 500);
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
