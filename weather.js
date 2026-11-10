// weather.js
// Live weather for the Display from Open-Meteo, plus the weather override
// sent from the touchscreen. Load it in index.html after channel.js and
// before sketch.js. The Display page is the only page that loads it.
//
// Edit the settings block. Leave everything below it as it is.
//
// In sketch.js, read a value with a fallback for before the first load:
//   const wind = Weather.get("wind_speed_10m", 0);

const WEATHER_SETTINGS = {
  // Where the Display is. [confirm] coordinates
  latitude: 43.07,
  longitude: -89.40,

  // The Open-Meteo variables in the Inputs section of your SPEC.md.
  // Use the names from the Current Weather list at open-meteo.com/en/docs.
  variables: ["temperature_2m", "wind_speed_10m", "wind_direction_10m", "precipitation"],

  // Units. Match the "Range in" column of your mapping table.
  temperature_unit: "fahrenheit",
  wind_speed_unit: "mph",
  precipitation_unit: "inch",

  // Minutes between weather checks. Open-Meteo's current conditions come
  // from 15-minute data, so checking more often gains nothing.
  refreshMinutes: 10,

  // Minutes the touchscreen's weather stays on the Display before live
  // weather comes back. Every new touch restarts the count.
  overrideMinutes: 2,
};

const Weather = (() => {
  const live = {};
  const chosen = {};
  let mode = "loading"; // loading, live, override, or offline
  let overrideEndsAt = null;
  let overrideTimer = null;
  let updatedAt = null;

  const current = () => ({ ...live, ...chosen });
  const hasLive = () => Object.keys(live).length > 0;

  function report() {
    Channel.send("weather-state", { mode, values: current(), overrideEndsAt, updatedAt });
  }

  async function refresh() {
    const s = WEATHER_SETTINGS;
    const query = new URLSearchParams({
      latitude: s.latitude,
      longitude: s.longitude,
      current: s.variables.join(","),
      temperature_unit: s.temperature_unit,
      wind_speed_unit: s.wind_speed_unit,
      precipitation_unit: s.precipitation_unit,
    });
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`);
      if (!response.ok) throw new Error(`Open-Meteo answered ${response.status}`);
      const data = await response.json();
      s.variables.forEach((name) => { live[name] = data.current[name]; });
      updatedAt = data.current.time;
    } catch (error) {
      console.warn("Weather check failed. The Display keeps its last values.", error);
    }
    if (mode !== "override") mode = hasLive() ? "live" : "offline";
    report();
  }

  function override(values) {
    Object.assign(chosen, values);
    mode = "override";
    const ms = WEATHER_SETTINGS.overrideMinutes * 60 * 1000;
    overrideEndsAt = Date.now() + ms;
    clearTimeout(overrideTimer);
    overrideTimer = setTimeout(backToLive, ms);
    report();
  }

  function backToLive() {
    Object.keys(chosen).forEach((name) => delete chosen[name]);
    clearTimeout(overrideTimer);
    overrideEndsAt = null;
    mode = hasLive() ? "live" : "offline";
    report();
  }

  Channel.on("weather-override", (msg) => override(msg.values));
  Channel.on("weather-live", backToLive);
  Channel.on("hello", report);

  refresh();
  setInterval(refresh, WEATHER_SETTINGS.refreshMinutes * 60 * 1000);

  return {
    get(name, fallback) {
      const value = current()[name];
      return value === undefined || value === null ? fallback : value;
    },
    get mode() {
      return mode;
    },
  };
})();
