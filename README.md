# VOID COURSE — Course Catalogue Website

Premium **black & gold** theme (inspired by the logo), 3,695 courses, 17 categories.
**No prices shown** — a golden **Unlock Course** button and **+ Cart** (multi-course enquiry) — everything opens Telegram **@voidx_exee** with a pre-filled message.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main page |
| `style.css` | Premium gold theme (black `#050505` + champagne gold `#E8C87A`) |
| `app.js` | Catalogue logic (search, sort, categories, infinite scroll) |
| `courses-data.js` | 3,695 courses (prices intentionally stripped) |
| `ratings-data.js` | Optional owner-supplied ratings (empty by default) |
| `logo.jpg` | Full VOID COURSE logo (loading splash + fallbacks) |
| `mark.jpg` | VX monogram (header, footer, favicon) |

## Deploy on Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Drag & drop this folder (or upload via GitHub)
3. Framework Preset: **Other** · Build command: *leave empty* · Output directory: `./`
4. Click **Deploy** — done ✅

CLI alternative: run `vercel --prod` inside this folder.
(`_original/` folder is just a backup reference of the source site — do not upload it.)

## Customize

- **Telegram handle / brand name** → top of `app.js`:
  `TELEGRAM_USERNAME = 'voidx_exee'` · `BRAND = 'VOID COURSE'`
- **Unlock message** → `unlockMessage(c)` in `app.js`
- **Add / remove courses** → edit `courses-data.js`
  (schema: `{"id":1,"title":"...","category":"...","image":"https://…","addedAt":"2026-01-01T00:00:00.000Z"}`)
- **Ratings badge on a course** → add to `ratings-data.js`:
  `const COURSE_RATINGS = { 1: { score: 4.8, count: 120 } };`

## Features

- Search by course name or `#number` (press `/` to focus)
- Sort: Recently added / Name A–Z
- Category drawer with live counts · Reset filters
- Infinite scroll (24 courses per batch)
+ Golden Unlock button · + Cart with multi-course Telegram enquiry (saved between visits)
- Sticky cart bar + cart dialog with "Buy all on Telegram"
- Broken poster auto-fallback to the VOID logo
- FAQs modal · fully mobile responsive
