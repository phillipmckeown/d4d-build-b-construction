// touchscreen.js
// Sends what a visitor does on the touchscreen to the Display, and shows
// whether the Display is on live weather. Leave it as it is.
//
// Add controls in touchscreen.html with one of two attributes:
//   data-variable="wind_speed_10m"   a weather override slider
//   data-control="palette"           anything else your Display responds to

(() => {
  const status = document.getElementById("weather-status");
  const countdown = document.getElementById("weather-countdown");
  const sliders = document.querySelectorAll("input[data-variable]");
  const statusText = {
    loading: "Loading live weather",
    live: "Showing live weather",
    override: "Showing the weather you chose",
    offline: "Live weather is unavailable",
  };
  let lastMode = null;
  let endsAt = null;

  function showValue(input, value) {
    const output = document.querySelector(`output[for="${input.id}"]`);
    if (output) output.textContent = `${Math.round(value)} ${input.dataset.unit || ""}`.trim();
  }

  // Weather override sliders
  sliders.forEach((input) => {
    showValue(input, input.value);
    input.addEventListener("input", () => {
      showValue(input, input.value);
      Channel.send("weather-override", {
        values: { [input.dataset.variable]: Number(input.value) },
      });
    });
  });

  document.getElementById("back-to-live").addEventListener("click", () => {
    Channel.send("weather-live");
  });

  // Other controls: sliders, selects, and buttons with data-control
  document.querySelectorAll("input[data-control], select[data-control]").forEach((el) => {
    el.addEventListener("input", () => {
      Channel.send("control", { name: el.dataset.control, value: el.value });
    });
  });

  document.querySelectorAll("button[data-control]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.control;
      document.querySelectorAll(`button[data-control="${group}"]`).forEach((b) => {
        b.setAttribute("aria-pressed", String(b === button));
      });
      Channel.send("control", { name: group, value: button.dataset.value });
    });
  });

  // What the Display reports back
  Channel.on("weather-state", (msg) => {
    endsAt = msg.overrideEndsAt;
    if (msg.mode !== lastMode) {
      status.textContent = statusText[msg.mode];
      lastMode = msg.mode;
    }
    if (msg.mode !== "override") {
      sliders.forEach((input) => {
        const value = msg.values[input.dataset.variable];
        if (value === undefined || value === null || document.activeElement === input) return;
        input.value = value;
        showValue(input, value);
      });
    }
    tick();
  });

  // The countdown sits outside the live region so a screen reader
  // does not announce it every second.
  function tick() {
    if (!endsAt) {
      countdown.textContent = "";
      return;
    }
    const seconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    const m = Math.floor(seconds / 60);
    const s = String(seconds % 60).padStart(2, "0");
    countdown.textContent = `Live weather returns in ${m}:${s}`;
  }
  setInterval(tick, 1000);

  // Ask the Display for its current state when this page opens.
  Channel.send("hello");
})();
