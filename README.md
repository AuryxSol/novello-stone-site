# Novello Stone — Website

Static multi-page site (no build step required) for Novello Stone, covering:
- `index.html` — Home
- `services.html` — Fabrication / Tiling / Restoration
- `about.html` — About / coverage area
- `contact.html` — Quote request form (mailto-based, no backend yet)
- `investor.html` — Private, unlinked overview page for investors (not in nav, `noindex`)

## Deploy via GitHub + Vercel

1. Create a new repo on your `AuryxSol` GitHub account, e.g. `novello-stone-site`
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial Novello Stone site"
   git branch -M main
   git remote add origin https://github.com/AuryxSol/novello-stone-site.git
   git push -u origin main
   ```
3. In Vercel: **Add New → Project → Import** the `novello-stone-site` repo.
   Framework preset: **Other** (it's static HTML, no build command needed).
4. Once deployed, go to the Vercel project's **Settings → Domains** and add `novello.co.za` and `www.novello.co.za`.
   You'll be shown DNS records (A / CNAME) to add wherever `novello.co.za`'s DNS is currently managed.

## Notes
- No real photography is used anywhere yet — all image areas are clearly marked placeholders, ready to swap once you have your own photos (fleet, workshop, job sites).
- The contact form opens the visitor's email client pre-filled to `studio@novello.co.za` — there's no backend/database yet. If you want actual form submissions logged somewhere, that's a follow-up step (e.g. a simple serverless function or a form service).
- `investor.html` is intentionally not linked from the nav and is marked `noindex` for search engines — share the direct URL with Stuart only.
