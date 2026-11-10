# Build B instructions for the coding tool

- Build from SPEC.md. It is the source of truth for behavior, ranges, and screens.
- Use only the tokens in the @theme block in app.css. Do not hardcode colors, sizes, or arbitrary values.
- If a value you need is missing from SPEC.md or app.css, stop and ask. Do not invent one.
- Do not edit the @theme block in app.css. The designer writes it.
- Do not add libraries. p5.js 2.3.4 is already loaded in index.html.
- After changing classes, run `npm run build` so output.css is current. output.css is committed.
- channel.js, weather.js, and touchscreen.js are shared course files. Do not edit them.
- In sketch.js, read weather with Weather.get(name, fallback). Do not call Open-Meteo directly.
- In sketch.js, respond to touchscreen controls with Channel.on("control", ...).
- Add touchscreen controls in touchscreen.html using data-variable or data-control attributes.