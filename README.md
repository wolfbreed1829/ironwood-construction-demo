# Ironwood Construction

A construction company website concept by Saber Tech. Native WordPress block theme, with a matching static GitHub Pages preview. No page builder or third-party plugins required on a normal WordPress installation.

- **Live demo:** https://wolfbreed1829.github.io/ironwood-construction-demo/
- **Installable theme:** https://wolfbreed1829.github.io/ironwood-construction-demo/ironwood.zip
- **Try the actual WordPress theme:** https://playground.wordpress.net/?blueprint-url=https%3A%2F%2Fwolfbreed1829.github.io%2Fironwood-construction-demo%2Fblueprint.json

The GitHub Pages link is a static preview; GitHub Pages does not execute PHP or host a WordPress database. The Playground link boots the actual theme in a temporary WordPress environment in your browser. Playground changes are local to that session and do not update the public demo.

All project inquiry links point to:

https://sabertechlogistics.com/contact/?plan=business#project-brief

## Install in WordPress

1. Download `ironwood.zip` from the link above.
2. In WordPress, go to **Appearance → Themes → Add New → Upload Theme**.
3. Upload the ZIP, install, and activate **Ironwood Construction**.
4. Open the homepage. The front-page template supplies the complete demo automatically.
5. Use **Appearance → Editor → Design → Templates → Front Page** to edit the native headings, paragraphs, images, buttons, and sections. Global colors and fonts live in **Styles**. Header/footer navigation and gallery controls use small Custom HTML blocks; these can be edited in the Site Editor’s code view. Project dialog text is in the gallery’s Custom HTML block.

Minimum WordPress 6.6 and PHP 7.4. No Elementor, React application, external font requests, contact-form service, or paid plugin is required. The CTA deliberately opens Saber Tech’s real project brief rather than collecting data on a fictional construction company’s demo.

## Local development

```sh
npm run build
npm run wordpress
```

The build needs Node and Python, with no package installation. The optional WordPress development command downloads Playground CLI on first use and runs at `http://127.0.0.1:9400`. These development tools are not part of the installed WordPress theme. Playground CLI’s latest dependencies require Node 24.18+ and npm 11.16+.

To preview only the static version:

```sh
python -m http.server 4173 --directory docs --bind 127.0.0.1
```

`scripts/build.mjs` generates both `theme/ironwood/patterns/` and `docs/index.html` from shared content. Edit it for content changes; edit the theme’s `assets/site.css` and `assets/site.js` for appearance and interactions. Run `npm run build` afterward. The Python packaging script creates `docs/ironwood.zip`. Site Editor changes in a live WordPress installation are stored in that installation’s database and are not automatically synchronized back to this repository.

## Demo content and assets

Ironwood Construction is a fictional demonstration brand. All named projects are illustrative concepts. There are no invented testimonials, performance statistics, or real company credentials. The demo makes no claim that the depicted properties were built by Ironwood.

Photographs are downloaded from Unsplash and stored locally. Source IDs and download URLs are recorded in `scripts/download-assets.mjs`; see [Unsplash’s license](https://unsplash.com/license). Manrope and Barlow Condensed are locally hosted, open-source fonts under the SIL Open Font License; license files are included with the theme assets. The custom theme code is licensed GPL-2.0-or-later; photos and fonts retain their respective licenses.

## Publishing

GitHub Pages publishes the `docs/` directory of `main`. A push that changes `docs/` updates the demo. Rebuild and package the theme before pushing so the preview, WordPress theme, and ZIP remain synchronized.
