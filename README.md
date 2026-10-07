# Kenza El Baz — Portfolio

A static personal portfolio (HTML, CSS and vanilla JS, no build step).

- `index.html`: Work page with a browser-frame hero and project cards (click a card for details)
- `info.html`: experience, skills, education, certifications and CV links
- `assets/Kenza_El_Baz_CV_EN.pdf` and `assets/Kenza_El_Baz_CV_FR.pdf`: the English and French CVs. The header's Resume menu, the Info page and the footer let visitors pick one.

Dark mode is the default; the sun/moon button switches to light mode and remembers the choice.

Open `index.html` in a browser to run it, or deploy the folder as-is to GitHub Pages, Netlify or Vercel.

## CV

The French CV (`assets/Kenza_El_Baz_CV_FR.pdf`) is the original PDF. The English CV is built from `cv/cv-en.html` (fonts in `cv/fonts`, photo in `cv/photo.jpg`). To rebuild it after editing:

```sh
npm i -D playwright && npx playwright install chromium
node cv/build-pdf.cjs
```

## Live site

Published with GitHub Pages at https://kenza-elbaz.github.io/portfolio/
