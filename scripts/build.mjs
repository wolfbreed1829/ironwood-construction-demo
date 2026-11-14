import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const theme = resolve(root, 'theme/ironwood');
const output = resolve(root, 'docs');
const cta = 'https://sabertechlogistics.com/contact/?plan=business#project-brief';
const arrow = '<span aria-hidden="true">↗</span>';
const block = (name, attrs, content) => `<!-- wp:${name}${Object.keys(attrs).length ? ' ' + JSON.stringify(attrs) : ''} -->\n${content}\n<!-- /wp:${name} -->`;
const html = value => block('html', {}, value);
const group = (classes, content, id = '', tag = 'div') => block('group', {tagName: tag, ...(id ? {anchor:id} : {}), className:classes}, `<${tag}${id ? ` id="${id}"` : ''} class="wp-block-group ${classes}">${content}</${tag}>`);
const p = (text, classes='') => block('paragraph', classes ? {className:classes} : {}, `<p${classes ? ` class="${classes}"` : ''}>${text}</p>`);
const h = (text, level=2, classes='') => block('heading', {level,...(classes ? {className:classes}: {})}, `<h${level} class="wp-block-heading${classes ? ' '+classes:''}">${text}</h${level}>`);
const photo = (file, alt, classes='', eager=false) => block('image', {sizeSlug:'full',linkDestination:'none',className:classes}, `<figure class="wp-block-image size-full ${classes}"><img src="ASSET/${file}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"/></figure>`);
const button = (text, href=cta, style='primary') => block('buttons', {className:'button-wrap'}, `<div class="wp-block-buttons button-wrap">${block('button',{className:`button-${style}`},`<div class="wp-block-button button-${style}"><a class="wp-block-button__link wp-element-button" href="${href}">${text} ${arrow}</a></div>`)}</div>`);
const mark = '<svg class="brand-mark" viewBox="0 0 36 40" fill="none" aria-hidden="true"><path d="M3 13 18 4l15 9v23H3V13Z" stroke="currentColor" stroke-width="3"/><path d="M12 35V17l6-4 6 4v18M18 14v21" stroke="currentColor" stroke-width="3"/></svg>';
const brand = `<a href="HOME" class="brand" aria-label="Ironwood Construction home">${mark}<span>IRONWOOD<small>CONSTRUCTION</small></span></a>`;

const header = html(`<a class="skip-link" href="#main">Skip to content</a><header class="site-header"><div class="container header-inner">${brand}<button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Main navigation"><a href="HOME#services">Services</a><a href="HOME#process">Our process</a><a class="nav-cta" href="${cta}">START A PROJECT ${arrow}</a></nav></div></header>`);

const hero = group('hero',
  group('hero-copy', p('<span class="orange-line"></span> RESIDENTIAL &amp; COMMERCIAL','eyebrow') +
    h('BUILT WITH<br><span class="accent-text">PURPOSE.</span>',1) +
    p('Residential construction, commercial spaces, and renovations.','hero-description') +
    group('hero-actions',button('START A PROJECT')+html('<a class="text-link" href="#services">Our services <span aria-hidden="true">↘</span></a>'))
  ) + group('hero-visual',photo('hero.jpg','Contemporary home with timber cladding and expansive windows','hero-image',true))
,'intro','section');

const serviceData = [
 ['Residential','Custom homes and additions.','residence.jpg','Modern residential interior with an open living area'],
 ['Commercial','Offices, retail, and tenant improvements.','commercial.jpg','Commercial workspace with glass partitions'],
 ['Renovations','Kitchens, interiors, and whole-home remodeling.','interior.jpg','Living room with natural finishes and large windows']
];
const services = group('services section-pad container',
 group('section-heading',h('OUR SERVICES.'))+
 group('service-grid',serviceData.map(([title,copy,file,alt])=>group('service-card',
 photo(file,alt,'service-image')+h(`<a href="${cta}">${title} ${arrow}</a>`,3)+p(copy))).join('')),'services','section');

const steps = [
 ['01','PLAN','Define the scope, budget, and schedule.'],
 ['02','BUILD','Coordinate the work. Keep you informed.'],
 ['03','DELIVER','Review the details. Complete the handover.']
];
const process = group('process section-pad',group('container',group('section-heading',h('A CLEAR PROCESS.'))+
 group('process-grid',steps.map(([n,title,copy])=>group('process-step',p(n,'step-number')+h(title,3)+p(copy))).join(''))),'process','section');

const contact = group('contact-band',group('container contact-inner',h('START YOUR<br>NEXT PROJECT.')+button('LET’S TALK',cta,'light')),'contact','section');

const footer = html(`<footer class="site-footer"><div class="container footer-main">${brand}<nav aria-label="Footer navigation"><a href="HOME#services">Services</a><a href="HOME#process">Our process</a><a href="${cta}">Contact ${arrow}</a></nav></div><div class="container footer-bottom"><p>© 2026 Ironwood Construction</p><a href="${cta}">Website by <strong>Saber Tech</strong></a></div></footer>`);

const sections = {header, hero, services, process, contact, footer};
await Promise.all(['patterns','templates','parts'].map(name=>mkdir(resolve(theme,name),{recursive:true})));
for (const name of ['projects','about','faq']) await rm(resolve(theme,`patterns/${name}.php`), {force:true});
await mkdir(output,{recursive:true});
for(const [name,markup] of Object.entries(sections)) {
  const phpMarkup = markup.replace(/\s(?:fetchpriority|loading|decoding)="[^"]*"/g, '').replaceAll('ASSET/', "<?php echo esc_url( get_theme_file_uri( 'assets/' ) ); ?>").replaceAll('href="HOME', "href=\"<?php echo esc_url( home_url( '/' ) ); ?>");
  await writeFile(resolve(theme,`patterns/${name}.php`), `<?php\n/**\n * Title: Ironwood ${name}\n * Slug: ironwood/${name}\n * Categories: ironwood\n * Inserter: ${['header','footer'].includes(name) ? 'false' : 'true'}\n */\nif ( ! defined( 'ABSPATH' ) ) { exit; }\n?>\n${phpMarkup}\n`);
}
for(const name of ['header','footer']) await writeFile(resolve(theme,`parts/${name}.html`),`<!-- wp:pattern {"slug":"ironwood/${name}"} /-->`);
const top='<!-- wp:template-part {"slug":"header","area":"header"} /-->\n';
const bottom='\n<!-- wp:template-part {"slug":"footer","area":"footer"} /-->';
await writeFile(resolve(theme,'templates/front-page.html'),top+group('site-main',Object.keys(sections).filter(key=>!['header','footer'].includes(key)).map(key=>`<!-- wp:pattern {"slug":"ironwood/${key}"} /-->`).join('\n'),'main','main')+bottom);
await writeFile(resolve(theme,'templates/index.html'),top+group('container section-pad', '<!-- wp:query {"query":{"inherit":true}} --><div class="wp-block-query"><!-- wp:post-template -->'+group('archive-entry','<!-- wp:post-title {"isLink":true} /--><!-- wp:post-excerpt /-->')+'<!-- /wp:post-template --><!-- wp:query-pagination --><div class="wp-block-query-pagination"><!-- wp:query-pagination-previous /--><!-- wp:query-pagination-numbers /--><!-- wp:query-pagination-next /--></div><!-- /wp:query-pagination --><!-- wp:query-no-results -->'+p('No posts to show yet.')+'<!-- /wp:query-no-results --></div><!-- /wp:query -->','main','main')+bottom);
await writeFile(resolve(theme,'templates/singular.html'),top+group('container section-pad article-content','<!-- wp:post-title {"level":1} /--><!-- wp:post-featured-image /--><!-- wp:post-content /-->','main','main')+bottom);
await writeFile(resolve(theme,'patterns/not-found.php'),`<?php\n/**\n * Title: Ironwood page not found\n * Slug: ironwood/not-found\n * Inserter: false\n */\nif ( ! defined( 'ABSPATH' ) ) { exit; }\n?>\n`+group('container section-pad',h('A LITTLE OFF THE PLANS.',1)+p('This page could not be found. Head back to the homepage to find your way.')+html('<a href="<?php echo esc_url( home_url( \'/\' ) ); ?>" class="standalone-button">BACK TO HOME ↗</a>'),'main','main'));
await writeFile(resolve(theme,'templates/404.html'),top+'<!-- wp:pattern {"slug":"ironwood/not-found"} /-->'+bottom);
const body=(header+'<main id="main">'+Object.entries(sections).filter(([key])=>!['header','footer'].includes(key)).map(([,value])=>value).join('\n')+'</main>'+footer).replace(/<!-- \/?wp:[\s\S]*?-->/g,'').replaceAll('ASSET/','assets/').replaceAll('href="HOME','href="./');
await writeFile(resolve(output,'index.html'),`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#20251f"><meta name="description" content="Ironwood Construction. Residential construction, commercial spaces, and renovations."><meta property="og:title" content="Ironwood Construction | Built With Purpose"><meta property="og:description" content="Residential construction, commercial spaces, and renovations."><meta property="og:type" content="website"><title>Ironwood Construction | Built With Purpose</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/site.css"><script src="assets/site.js" defer></script></head><body>${body}</body></html>`);
await cp(resolve(theme,'assets'),resolve(output,'assets'),{recursive:true});
await writeFile(resolve(output,'.nojekyll'),'');
const blueprint = {$schema:'https://playground.wordpress.net/blueprint-schema.json', landingPage:'/', preferredVersions:{php:'8.3',wp:'latest'},login:true,steps:[{step:'installTheme',themeData:{resource:'url',url:'https://wolfbreed1829.github.io/ironwood-construction-demo/ironwood.zip'},options:{activate:true}},{step:'setSiteOptions',options:{blogname:'Ironwood Construction',blogdescription:'Residential and commercial construction.'}}]};
await writeFile(resolve(output,'blueprint.json'),JSON.stringify(blueprint,null,2));
console.log('Generated WordPress block theme and GitHub Pages demo from shared content.');

