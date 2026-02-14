# SubStamper

**The subtitle timing tool that doesn't waste your time.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/leplik/SubStamper.svg?style=social)](https://github.com/leplik/SubStamper/stargazers)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://leplik.github.io/SubStamper/)
![No Dependencies](https://img.shields.io/badge/dependencies-0-blue)
![HTML/CSS/JS](https://img.shields.io/badge/stack-HTML%20%2B%20CSS%20%2B%20JS-orange)

## Try It Now

**[Launch SubStamper](https://leplik.github.io/SubStamper/)** — no download, no install, no account. Just open it and get to work.

---

## What Is SubStamper?

SubStamper is a free, open-source **SRT subtitle timing tool** that runs entirely in your browser. It's a **subtitle generator** for people who actually need to sync lyrics or dialogue to audio — not another bloated editor that requires a PhD in timeline scrubbing.

Upload an MP3 (or any audio file your browser supports), paste your lyrics or subtitle text, and tap the spacebar to mark the start and end of each line in real time. When you're done, download a standard **.srt file** ready for YouTube, video editors, or any media player that speaks subtitles.

No server. No signup. No subscription. No AI hallucinating your timestamps. It works **completely offline** once loaded — your audio never leaves your machine.

**SubStamper is a:**
- Free SRT editor and SRT file creator
- Subtitle timing tool and subtitle generator
- Lyric sync tool for music video subtitles
- Browser-based, offline SRT generator
- Open-source subtitle editor with zero dependencies

---

## Why Does This Exist?

Here's the thing. I was making subtitle files for an album of AI-generated music videos. You'd think by now there'd be a decent free tool for syncing lyrics to audio. You'd be cosmically, hilariously wrong.

Every existing tool was either:
- A full-blown video editor that wanted me to drag tiny boxes on a timeline like some kind of medieval cartographer
- A web app that required an account, a credit card, and probably my firstborn's social security number
- An "AI-powered" solution that confidently placed my chorus at the three-minute mark of a two-minute song

So I built SubStamper. It does one thing. It does it well. You listen to audio, you tap spacebar when words happen, and you get an .srt file. That's it. No paradigm shifts. No disruption. No synergy. Just timestamps.

*Wubba lubba dub dub* — let's get those subtitles timed.

---

## Features

- **Spacebar-driven timing** — hold Space to mark start, release to mark end, automatically advances to next line
- **Drag-and-drop audio upload** — drop an MP3 onto the page (or click to browse). Accepts any browser-supported audio format
- **3-2-1 countdown** — gives you a beat to get ready before timing begins
- **Real-time preview** — timestamps appear live as you record, with smooth auto-scroll keeping the current line in view
- **Re-time individual lines** — click any row in preview mode to redo just that line (audio seeks 5 seconds before the line's start)
- **Live subtitle preview** — play back your audio with a karaoke-style subtitle display to verify timing before downloading
- **Instant .srt download** — one click to download a standards-compliant SRT subtitle file
- **Dark theme** — easy on the eyes at 2 AM when you're on your fifth video (cyan accents because we have *taste*)
- **Zero dependencies** — no npm, no webpack, no node_modules black hole. Three files: HTML, CSS, JS
- **Fully offline** — works without internet once the page is loaded. Your audio never leaves your browser
- **No server, no accounts** — it's a static page. Your audio and text never leave your browser. A [HITS](https://hits.seeyoufarm.com) badge counts page visits — no cookies, no personal data collected

---

## How to Use

1. **Open SubStamper** — [launch it](https://leplik.github.io/SubStamper/) or open `index.html` locally
2. **Load audio** — drag an MP3 onto the drop zone (or click to browse)
3. **Paste lyrics** — one line per subtitle in the text area. Blank lines are ignored
4. **Click "Start Timing"** — a 3-2-1 countdown kicks in
5. **Hold spacebar** when a line starts being spoken or sung
6. **Release spacebar** when it ends — the tool advances to the next line automatically
7. **Review** — once all lines are timed, the preview screen shows your timestamps
8. **Re-time** *(optional)* — click any row to redo that specific line without starting over
9. **Play back** — hit play to see subtitles appear in real-time over your audio
10. **Download** — click "Download .srt" to save your subtitle file. You're done. Go outside. Touch grass

---

## Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| `Space` (hold) | Timing screen | Mark subtitle start time |
| `Space` (release) | Timing screen | Mark subtitle end time + advance to next line |
| `Space` (hold/release) | Re-timing mode | Re-stamp start/end for a selected line |
| `Esc` | Re-timing mode | Cancel re-time, restore previous timestamps |

---

## Deployment

### GitHub Pages (recommended)

SubStamper is three static files. Deploying it is almost offensively easy.

1. Push this repository to GitHub
2. Go to **Settings** > **Pages** in your repository
3. Under **Source**, select **Deploy from a branch**
4. Choose the `main` branch and `/ (root)` folder
5. Click **Save**
6. Your site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two

That's it. No CI/CD pipeline. No Docker. No YAML files longer than this README.

### Run Locally

```bash
# Option 1: Just open the file (works in any browser)
open index.html

# Option 2: Local HTTP server (if you want to feel professional)
python3 -m http.server 8000
# Then visit http://localhost:8000
```

No build step. No `npm install`. The `index.html` loads `style.css` and `app.js` from the same directory. That's the whole architecture.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, flexbox, animations) |
| Logic | Vanilla JavaScript (ES6+, Web Audio API, File API, Blob API) |
| Build system | lol no |
| Dependencies | Zero |
| Server requirements | None — it's static files |

---

## Contributing

Contributions are welcome. This project intentionally stays simple — that's not a bug, it's the whole point.

Before adding a major feature, open an issue to discuss it first.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

**Guidelines:**
- Keep it vanilla — no frameworks, no build tools, no package managers
- If it can't be explained in one sentence, it might be too complicated
- Test in at least Chrome and Firefox before submitting

---

## License

MIT License. See [LICENSE](LICENSE) for the full text.

Do whatever you want with it. Just don't blame me if your subtitles are off by a millisecond.

---

<sub>
<b>SubStamper</b> — free SRT editor | subtitle timing tool | subtitle generator | lyric sync tool | SRT file creator | free subtitle editor | browser subtitle tool | offline SRT generator | music video subtitles | lyric video creator | open source subtitle tool | karaoke timing | subtitle synchronization | lyrics to SRT converter | spacebar subtitle stamper | free lyric timing app | AI music video subtitles | SRT subtitle maker online free
</sub>
