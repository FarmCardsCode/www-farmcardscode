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
