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

// Cinematic glitch: every page load opens with a full burst, then every
// so often (at random) the terminal shell tears
// for a handful of frames through the #cinematic-glitch filter in
// base.html. Each burst picks a character (a mix of styles below) and a
// length, and every frame rerolls the filter's seed, band size, tear
// pattern, and channel split, so no two bursts play out the same way.
const glitchShell = document.querySelector(".terminal-shell");
const glitchFilter = document.getElementById("cinematic-glitch");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (glitchShell && glitchFilter) {
  const turbulence = glitchFilter.querySelector("feTurbulence");
  const tearBands = glitchFilter.querySelector("feFuncR");
  const displacement = glitchFilter.querySelector("feDisplacementMap");
  const [redShift, cyanShift] = glitchFilter.querySelectorAll("feOffset");

  const rand = (min, max) => min + Math.random() * (max - min);
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pick = (list) => list[randInt(0, list.length - 1)];
  const sign = () => (Math.random() < 0.5 ? -1 : 1);

  // A discrete lookup table that's mostly 0.5 (no shift) with a few bins
  // pushed sideways, so only some of the slices actually tear
  function tearTable(tornBins) {
    const table = Array(randInt(6, 12)).fill(0.5);
    for (let i = 0; i < tornBins; i++) {
      table[randInt(0, table.length - 1)] = rand(0.05, 0.95);
    }
    return table.map((v) => v.toFixed(2)).join(" ");
  }

  // Each style builds one frame. bands = slice frequency (smaller = taller
  // slices), tear = max sideways slice offset, split = red/cyan separation.
  const glitchStyles = {
    // a few tall slices thrown far sideways
    tear: () => ({ bands: rand(0.005, 0.015), tear: rand(60, 130), split: rand(2, 5), torn: randInt(1, 3) }),
    // lots of thin slices, small offsets, like a shredded signal
    shred: () => ({ bands: rand(0.03, 0.09), tear: rand(15, 45), split: rand(1, 3), torn: randInt(3, 6) }),
    // no tearing, just the color channels pulled hard apart
    split: () => ({ bands: 0.01, tear: 0, split: rand(5, 11), torn: 0 }),
    // the whole picture jerks sideways with a light tear
    slip: () => ({
      bands: rand(0.008, 0.02), tear: rand(10, 30), split: rand(2, 6), torn: randInt(1, 2),
      transform: `translate3d(${sign() * randInt(4, 14)}px, 0, 0)`,
    }),
    // vertical hold slips for a frame
    roll: () => ({
      bands: rand(0.01, 0.03), tear: rand(10, 40), split: rand(1, 4), torn: randInt(1, 3),
      transform: `translate3d(0, ${-randInt(3, 10)}px, 0)`,
    }),
    // overexposed frame
    flash: () => ({ bands: rand(0.005, 0.02), tear: rand(30, 90), split: rand(3, 7), torn: randInt(1, 3), brightness: rand(1.25, 1.6) }),
  };
  const styleNames = Object.keys(glitchStyles);

  function showFrame(frame) {
    turbulence.setAttribute("seed", randInt(1, 999));
    turbulence.setAttribute("baseFrequency", `0 ${frame.bands.toFixed(4)}`);
    tearBands.setAttribute("tableValues", tearTable(frame.torn));
    displacement.setAttribute("scale", frame.tear.toFixed(1));
    redShift.setAttribute("dx", (-frame.split).toFixed(1));
    cyanShift.setAttribute("dx", frame.split.toFixed(1));

    glitchShell.style.filter = frame.brightness
      ? `url(#cinematic-glitch) brightness(${frame.brightness.toFixed(2)})`
      : "url(#cinematic-glitch)";
    glitchShell.style.transform = frame.transform || "";
  }

  function endBurst() {
    glitchShell.style.filter = "";
    glitchShell.style.transform = "";
    root.removeAttribute("data-cinematic-glitch");
    scheduleGlitch();
  }

  function playBurst(opening = false) {
    if (document.hidden || reducedMotion.matches) {
      scheduleGlitch();
      return;
    }

    // A burst's character is one to three styles it cuts between; about a
    // quarter of bursts are a single-frame blip, the rest run 2-7 frames.
    // The opening burst is never a blip and always runs long.
    const mix = Array.from({ length: randInt(opening ? 2 : 1, 3) }, () => pick(styleNames));
    let framesLeft = opening ? randInt(5, 9) : Math.random() < 0.25 ? 1 : randInt(2, 7);

    root.setAttribute("data-cinematic-glitch", "");
    root.style.setProperty("--cinematic-glitch-static", rand(3, 6).toFixed(1));

    (function nextFrame() {
      if (framesLeft-- === 0) {
        endBurst();
        return;
      }
      showFrame(glitchStyles[pick(mix)]());
      setTimeout(nextFrame, rand(35, 95));
    })();
  }

  function scheduleGlitch() {
    setTimeout(playBurst, rand(2000, 14000));
  }

  // Guaranteed opening burst just after the first paint. A page opened in
  // a background tab saves it for the moment the tab is first shown.
  function playOpeningBurst() {
    setTimeout(() => playBurst(true), rand(150, 400));
  }

  if (reducedMotion.matches) {
    scheduleGlitch();
  } else if (document.hidden) {
    document.addEventListener("visibilitychange", playOpeningBurst, { once: true });
  } else {
    playOpeningBurst();
  }
}
