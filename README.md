# Build B

## Set up

1. On GitHub, select **Use this template** and create a public repository named `d4d-build-b-[firstname]`.
2. Clone it and open the folder in VS Code.
3. In the VS Code terminal, run `npm install`.
4. Run `npm run dev`. Leave it running while you work. It rebuilds `output.css` every time you save.
5. Open `index.html` in your browser. You should see your Display background filling a tall, narrow frame.

## Files

| File | What it is | Who writes it |
|---|---|---|
| `SPEC.md` | Your specification: inputs, mapping table, tokens, touchscreen | You |
| `app.css` | Your `@theme` block of design tokens | You, by hand |
| `output.css` | Compiled CSS. Commit it, since GitHub Pages does not run the build. | Tailwind |
| `index.html`, `sketch.js` | The Display | Your coding tool, directed by you |
| `CLAUDE.md`, `.github/copilot-instructions.md` | Standing instructions your coding tool reads | Provided |
| `design/` | Exported reference frames and touchscreen screens | You |

## Before you commit

Run `npm run build`, then commit `output.css` with your other changes.
