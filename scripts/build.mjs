import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
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

const header = html(`<a class="skip-link" href="#main">Skip to content</a><div class="demo-strip"><span>A CONSTRUCTION WEBSITE CONCEPT BY SABER TECH</span><a href="${cta}">Make it yours ${arrow}</a></div><header class="site-header"><div class="container header-inner">${brand}<button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav"><span></span><span></span></button><nav id="primary-nav" class="primary-nav" aria-label="Main navigation"><a href="HOME#services">What we do</a><a href="HOME#projects">Our work</a><a href="HOME#about">Who we are</a><a href="HOME#process">Our process</a><a class="nav-cta" href="${cta}">LET’S TALK ${arrow}</a></nav></div></header>`);

const hero = group('hero',
  group('hero-copy', p('<span class="orange-line"></span> STRONG FOUNDATIONS. LASTING RELATIONSHIPS.','eyebrow') +
    h('BUILT RIGHT.<br>BUILT FOR<br><span class="outline-text">WHAT’S NEXT.</span>',1) +
    p('From the first conversation to the final detail. We build spaces that work hard, feel right, and stand the test of time.','hero-description') +
    group('hero-actions',button('START YOUR PROJECT')+`<a class="text-link" href="#projects">Explore our work <span aria-hidden="true">↘</span></a>`) +
    group('hero-note',html('<span class="mini-cross" aria-hidden="true">✳</span>')+p('YOUR VISION. OUR CRAFT.<br><strong>Something solid starts here.</strong>'))
  ) + group('hero-visual',photo('hero.jpg','Contemporary home with warm timber cladding, expansive windows, and a landscaped entry','hero-image',true)+
    html('<div class="image-corner" aria-hidden="true"></div>')+
    group('hero-caption',p('SPACES MADE FOR LIVING.','eyebrow')+p('Considered design. Confident execution.')+html('<a href="#projects" aria-label="Explore our residential work">↗</a>')))
,'intro','section');

const serviceData = [
 ['01','Residential construction','A place to put down roots. Custom homes and additions shaped around how you actually live.','Custom homes · Additions · New builds','house'],
 ['02','Commercial construction','Spaces that get down to business. Purposeful environments for your team, customers, and next chapter.','Offices · Retail · Tenant improvements','building'],
 ['03','Renovations & remodeling','A fresh perspective on familiar spaces. Thoughtful transformations, built around what matters to you.','Whole-home · Kitchens · Interiors','tools']
];
const icons = {
 house:'<path d="m5 21 19-16 19 16M10 18v25h28V18M20 43V28h9v15M18 16h12"/>',
 building:'<path d="M10 43V6h24v37M6 43h36M17 14h3m6 0h3m-12 8h3m6 0h3m-12 8h3m6 0h3M20 43v-7h7v7"/>',
 tools:'<path d="m8 39 22-22m-14-8 23 23-7 7L9 16l7-7ZM12 13l4 4m3 3 4 4m3 3 4 4m3 3 3 3M28 7l5-2 10 10-2 5-6-6-6 6-5-5 6-6-2-2Z"/>'
};
const services = group('services section-pad container',
 group('section-heading',group('',p('01 / WHAT WE DO','eyebrow')+h('GOOD BONES.<br>GREAT POSSIBILITIES.'))+p('One team, from the ground up. A hands-on approach to every build, big or small.','section-intro'))+
 group('service-grid',serviceData.map(([n,title,copy,meta,icon])=>group('service-card',
 html(`<div class="service-top"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${icons[icon]}</svg><span>${n}</span></div>`)+h(title,3)+p(copy)+p(meta,'service-meta')+html(`<a class="service-link" href="${cta}" aria-label="Discuss ${title.toLowerCase()}">${arrow}</a>`))).join('')),'services','section');

const projectData = [
 {id:'ridgeline', category:'residential', label:'CUSTOM HOME', name:'The Ridgeline Residence', image:'residence.jpg', alt:'Airy contemporary home opening onto a green outdoor space', sub:'Room to breathe. Built for everyday living.', scope:'A custom residence concept bringing generous daylight, natural materials, and an easy connection to the outdoors into one cohesive home.', details:['Custom residential build','Open living spaces','Indoor–outdoor connection']},
 {id:'workshop', category:'commercial', label:'COMMERCIAL', name:'The Workshop Offices', image:'commercial.jpg', alt:'Light-filled workspace with warm wood tables and glass partitions', sub:'A better place to do your best work.', scope:'A workplace concept that balances open collaboration areas with quiet, focused spaces. Warm finishes bring a human scale to the working day.', details:['Office fit-out','Collaborative work areas','Flexible planning']},
 {id:'oak', category:'renovation', label:'RENOVATION', name:'The Oak House Refresh', image:'interior.jpg', alt:'Warm living room with natural wood accents and a neutral sofa', sub:'Familiar foundations. A whole new feeling.', scope:'A whole-home renovation concept that opens up the living spaces, refines the material palette, and makes an existing home feel ready for its next chapter.', details:['Whole-home renovation','Interior reconfiguration','Custom finish details']}
];
const projects = group('projects section-pad',group('container',
 group('section-heading',group('',p('02 / SELECTED WORK','eyebrow')+h('THE WORK SPEAKS<br>FOR ITSELF.'))+group('project-heading-note',p('A few ways a vision becomes a place.','section-intro')+p('Illustrative projects for this website concept.','demo-note')))+
 html('<div class="project-filters" role="group" aria-label="Filter projects"><button type="button" data-filter="all" aria-pressed="true">All projects <span>03</span></button><button type="button" data-filter="residential" aria-pressed="false">Residential</button><button type="button" data-filter="commercial" aria-pressed="false">Commercial</button><button type="button" data-filter="renovation" aria-pressed="false">Renovations</button></div><p class="sr-only" id="filter-status" aria-live="polite"></p>')+
 group('project-grid',projectData.map(project => group(`project-card filter-${project.category}`,
 photo(project.image,project.alt,'project-image')+p(project.label,'eyebrow')+h(`<a href="#project-${project.id}" class="project-open">${project.name} ${arrow}</a>`,3)+p(project.sub,'project-subtitle'))).join(''))+
 html(projectData.map(project=>`<dialog id="project-${project.id}" class="project-dialog" aria-labelledby="title-${project.id}"><button type="button" class="dialog-close" aria-label="Close project details">×</button><img src="ASSET/${project.image}" alt="${project.alt}" loading="lazy"><div class="dialog-content"><p class="eyebrow">${project.label} / CONCEPT PROJECT</p><h2 id="title-${project.id}">${project.name}</h2><p>${project.scope}</p><ul>${project.details.map(detail=>`<li>${detail}</li>`).join('')}</ul><a class="standalone-button" href="${cta}">LET’S BUILD SOMETHING LIKE THIS ${arrow}</a></div></dialog>`).join(''))
),'projects','section');

const about = group('about section-pad container',
 group('about-visual',photo('detail.jpg','Carefully finished living space with timber stairs, light upholstery, and crafted details','about-image')+html('<div class="craft-stamp"><span>THE DETAILS<br>MAKE THE<br>DIFFERENCE.</span><span aria-hidden="true">↗</span></div>'))+
 group('about-copy',p('03 / THE IRONWOOD APPROACH','eyebrow')+h('SOLID WORK.<br>STRAIGHT TALK.')+p('Good construction starts long before the first board is cut. It starts with listening, asking the right questions, and making a plan everyone can stand behind.','lead')+p('Our approach is simple: respect the vision, communicate clearly, and care about the details. Because how a project gets built matters just as much as the finished space.')+
 group('principles',h('A clear path forward',3)+p('Thoughtful planning, defined scope, and a shared understanding of what comes next.')+h('Craft in every corner',3)+p('Materials chosen with purpose. Details finished with care. A space that feels considered.'))+
 html('<a class="text-link" href="#process">Get to know our process <span aria-hidden="true">↗</span></a>')),'about','section');

const steps = [
 ['01','LET’S TALK.','Tell us what you have in mind. We’ll talk through your goals, your site, and what a successful project looks like.'],
 ['02','MAKE A PLAN.','Bring the details into focus. Scope, selections, budget, and schedule take shape before work begins.'],
 ['03','BUILD IT RIGHT.','Watch the plan become a place, with clear communication and care at every stage of construction.'],
 ['04','MAKE IT YOURS.','Walk through the finished space together, review the details, and step into what comes next.']
];
const process = group('process section-pad',group('container',group('section-heading',group('',p('04 / FROM IDEA TO BUILT','eyebrow')+h('LESS GUESSWORK.<br>MORE FORWARD.'))+p('A clear process makes room for a better building experience. Here’s how we get there.','section-intro'))+
 group('process-grid',steps.map(([n,title,copy])=>group('process-step',p(n,'step-number')+h(title,3)+p(copy))).join(''))),'process','section');

const faq = group('faq section-pad container',group('',p('A FEW THINGS YOU MAY BE WONDERING','eyebrow')+h('BEFORE WE<br>BREAK GROUND.'))+
group('faq-list',[
 ['Where should I start?','Start with what you know: the kind of space you need, where it will be, and what you want it to do. A few photos, a rough sketch, or a list of ideas can help shape the first conversation.'],
 ['Do I need finished plans?','You can begin the conversation before every detail is decided. The first step is understanding the project and identifying the design, planning, and construction support it needs.'],
 ['What affects the project timeline?','Scope, design decisions, site conditions, permitting, and material availability all influence the schedule. A project-specific timeline should be established during planning.'],
 ['How do I get a website like this?','This is a construction website concept created by Saber Tech. Select “Start your project” to open the Saber Tech project brief and tell us about the website you need.']
].map(([q,a])=>block('details',{className:'faq-item'},`<details class="wp-block-details faq-item"><summary>${q}</summary>${p(a)}</details>`)).join('')),'questions','section');

const contact = group('contact-band',group('container contact-inner',group('',p('EVERY GREAT BUILD STARTS WITH A CONVERSATION.','eyebrow')+h('LET’S BUILD<br>SOMETHING <span>LASTING.</span>'))+group('contact-action',p('A new space. A fresh start. A vision worth building.<br>Let’s hear what you have in mind.')+button('START YOUR PROJECT',cta,'light')+p('Your next step opens the Saber Tech project brief.','contact-note'))),'contact','section');

const footer = html(`<footer class="site-footer"><div class="container footer-main">${brand}<p>Strong foundations.<br>Lasting relationships.</p><nav aria-label="Footer navigation"><a href="HOME#services">Services</a><a href="HOME#projects">Our work</a><a href="HOME#process">Our process</a><a href="${cta}">Start a project ${arrow}</a></nav></div><div class="container footer-bottom"><p>© 2026 Ironwood Construction. A fictional brand for demonstration.</p><a href="${cta}">WEBSITES BUILT BY <strong>SABER TECH</strong> ${arrow}</a><a href="#" class="back-top" aria-label="Back to top">↑</a></div></footer>`);

const sections = {header, hero, services, projects, about, process, faq, contact, footer};
await Promise.all(['patterns','templates','parts'].map(name=>mkdir(resolve(theme,name),{recursive:true})));
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
await writeFile(resolve(output,'index.html'),`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#20251f"><meta name="description" content="Ironwood Construction — a construction website concept by Saber Tech. Explore residential builds, commercial spaces, and thoughtful renovations."><meta property="og:title" content="Ironwood Construction | Built Right. Built for What’s Next."><meta property="og:description" content="A construction website concept by Saber Tech. Strong foundations. Lasting relationships."><meta property="og:type" content="website"><title>Ironwood Construction | Built Right. Built for What’s Next.</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/site.css"><script src="assets/site.js" defer></script></head><body>${body}</body></html>`);
await cp(resolve(theme,'assets'),resolve(output,'assets'),{recursive:true});
await writeFile(resolve(output,'.nojekyll'),'');
const blueprint = {$schema:'https://playground.wordpress.net/blueprint-schema.json', landingPage:'/', preferredVersions:{php:'8.3',wp:'latest'},login:true,steps:[{step:'installTheme',themeData:{resource:'url',url:'https://wolfbreed1829.github.io/ironwood-construction-demo/ironwood.zip'},options:{activate:true}},{step:'setSiteOptions',options:{blogname:'Ironwood Construction',blogdescription:'Built right. Built for what’s next.'}}]};
await writeFile(resolve(output,'blueprint.json'),JSON.stringify(blueprint,null,2));
console.log('Generated WordPress block theme and GitHub Pages demo from shared content.');

