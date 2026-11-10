// channel.js
// Passes messages between the Display (index.html) and the touchscreen
// (touchscreen.html). Both pages load this file. Leave it as it is.
//
// The two pages must be open in the same browser and served from the same
// address, such as http://localhost:8080 or your GitHub Pages URL.
// Opening the files straight from your computer (file://) will not work.
//
//   Channel.send("control", { name: "palette", value: "night" });
//   Channel.on("control", (msg) => { ... });

const Channel = (() => {
  const channel = new BroadcastChannel("d4d-build-b");
  const handlers = {};

  channel.onmessage = ({ data }) => {
    (handlers[data.type] || []).forEach((handler) => handler(data));
  };

  return {
    send(type, details = {}) {
      channel.postMessage({ type, ...details });
    },
    on(type, handler) {
      (handlers[type] ||= []).push(handler);
    },
  };
})();
