const text = "UNDER CONSTRUCTION";
const target = document.getElementById("typewriter");

if (target) {
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      target.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 85);
    } else {
      setInterval(() => {
        target.textContent = target.textContent.endsWith("_")
          ? text
          : text + "_";
      }, 500);
    }
  }

  typeWriter();
}

function updateClock() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  clock.textContent = new Date().toLocaleTimeString();
}

updateClock();
setInterval(updateClock, 1000);

