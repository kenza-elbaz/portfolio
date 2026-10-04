# Kenza El Baz — Portfolio

A static personal portfolio (HTML, CSS and vanilla JS, no build step).

- `index.html`: Work page with a browser-frame hero and project cards (click a card for details)
- `info.html`: experience, skills, education, certifications and CV links
- `assets/Kenza_El_Baz_CV.pdf`: the CV linked from the header, the Info page and the footer

Dark mode is the default; the sun/moon button switches to light mode and remembers the choice.

Open `index.html` in a browser to run it, or deploy the folder as-is to GitHub Pages, Netlify or Vercel.

## CV

`cv/Kenza_El_Baz_CV.tex` is the LaTeX source of the CV. To rebuild it and update the copy the site links to:

```sh
cd cv && pdflatex Kenza_El_Baz_CV.tex && cp Kenza_El_Baz_CV.pdf ../assets/
```

## Live site

Published with GitHub Pages at https://kenza-elbaz.github.io/portfolio/
