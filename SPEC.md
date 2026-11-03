# Build B specification: [your partner program]

Write this so someone who has never seen your Figma file could build the Display from it.

## Overview

Two or three sentences: what the Display shows, what drives it, and what a visitor notices over a whole day.

Figma project file: [view link]

## Inputs

| Input | Open-Meteo variable | Unit | Range you design for | How often it updates |
|---|---|---|---|---|
| | | | | |

Weather data comes from Open-Meteo. Credit line: "Weather data by Open-Meteo.com", linked to https://open-meteo.com/, shown on [the Display or the touchscreen].

## Mapping table

One row per behavior. Every row needs a numeric range in and a numeric range out.

| Input | Range in | What changes | Range out | Over a whole day |
|---|---|---|---|---|
| Example: Wind speed | 0 to 40 mph | Angle of new lines | 0 to 35 degrees from level | Lines accumulate. Nothing fades. |
| | | | | |

Hero effect: [name the effect and add its rows above]

## Tokens

| Figma variable | CSS token in app.css | Value |
|---|---|---|
| Example: color/chalk/500 | --color-chalk-500 | |
| | | |

## Touchscreen

| Screen | Control | Mapping row it drives |
|---|---|---|
| | | |

Reference frames and screen exports are in `design/`.
