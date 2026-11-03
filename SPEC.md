# Build B specification: Construction and Remodeling

Example specification for the Construction model. Use it to see how each section reads when it's complete.

## Overview

A board of blue chalk lines snapped over a wood framing grid. Each new line snaps at the angle the wind sets and stays there, so the board fills through the day and ends as a record of that day's weather. Colder temperatures tighten the stud spacing. The board clears at midnight.

Display: Ultra HD, portrait, 2160 x 3840. Figma project file: \[view link\]

## Inputs

All weather comes from the Open-Meteo forecast API for Madison, requested every 15 minutes. Units are set in the request, since Open-Meteo returns metric by default.

| Input | Open-Meteo variable | Unit | Range you design for | How often it updates |
|---|---|---|---|---|
| Wind speed | `wind_speed_10m` | mph (`wind_speed_unit=mph`) | 0 to 40 | Every 15 minutes |
| Wind direction | `wind_direction_10m` | degrees | 0 to 360 | Every 15 minutes |
| Temperature | `temperature_2m` | °F (`temperature_unit=fahrenheit`) | 0 to 95 | Every 15 minutes |
| Precipitation | `precipitation` | inches (`precipitation_unit=inch`) | 0 to 0.5 per hour | Every 15 minutes |
| Time of day | Device clock |   | Midnight to midnight | Continuous |

Credit line: "Weather data by Open-Meteo.com", linked to https://open-meteo.com/, shown on the Display in the caption zone in `--color-display-credit`.

## Mapping table

| Input | Range in | What changes | Range out | Over a whole day |
|---|---|---|---|---|
| Wind speed | 0 to 40 mph | Angle of each new chalk line | 0 to 35 degrees from level, linear, held at 35 above 40 mph | Each line keeps the angle it snapped at |
| Wind speed | 0 to 40 mph | How often a new line snaps | - below 15mph - 30min <br>- 15+ - every 15 min | A windy afternoon ends with about twice the lines of a calm one |
| Wind direction | 0 to 360 degrees | Which way new lines lean | West winds lean left, east winds lean right | Set per line when it snaps |
| Temperature | 0 to 95 °F | Framing grid spacing | 12, 16, 19.2, or 24 inches on center, colder is tighter | Eases to a new spacing over 10 minutes when the band changes |
| Precipitation | 0 to 0.5 in per hour | Chalk dust density | Dust only near lines when dry, falling dust haze at 0.25 and above, linear between | Dust settles toward the lower third over an hour |
| Time of day | Midnight to midnight | Line opacity | New lines at 95%, fading to 20% after 12 hours, linear | Board clears at midnight |
| Touchscreen: weather override | Same ranges as the feed | Replaces the live values above | Same as each row | Returns to live weather after 2 minutes idle |
| Touchscreen: day scrub | Midnight to now | Shows the board at the chosen time | Any time today | Returns to now after 2 minutes idle |

Hero effect: a textured chalk stroke with dust lifting off each new line as it snaps. Dust amount follows the precipitation row.

## Tokens

Write the resolved value. In Figma, `display/chalk` points at `chalk-blue/300`, so `app.css` gets the hex that step holds.

| Figma variable | CSS token in app.css | Value |
|---|---|---|
| display/ground | `--color-display-ground` | #1a1918 |
| display/studs | `--color-display-studs` | #a88861 |
| display/chalk | `--color-display-chalk` | #87ace7 |
| display/mark | `--color-display-mark` | #f26a1b |
| display/caption | `--color-display-caption` | #f7f1ea |
| display/credit | `--color-display-credit` | #bab8b3 |

## Touchscreen

| Screen | Control | Mapping row it drives |
|---|---|---|
| Weather override | Wind speed slider, 0 to 40 mph | Wind speed rows |
| Weather override | Temperature slider, 0 to 95 °F | Temperature row |
| Weather override | Precipitation slider, 0 to 0.5 in | Precipitation row |
| Weather override | Back to live weather button | Ends the override |
| Day scrub | Timeline, midnight to now | Day scrub row |

Reference frames and screen exports are in `design/`:

- `calm.png`: 68 °F, wind 3 mph, no rain, midday
- `extreme.png`: 28 °F, wind 38 mph, rain 0.4 in per hour, night
- `after-the-storm.png`: 45 °F, wind 15 mph, rain 0.05 in per hour, late afternoon
