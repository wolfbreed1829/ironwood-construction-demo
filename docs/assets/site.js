(() => {
  'use strict';
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  const setMenu = open => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', open);
  };
  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  navigation?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project-card')];
  filters.forEach(filter => filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button === filter)));
    let visible = 0;
    projects.forEach(project => {
      const show = category === 'all' || project.classList.contains(`filter-${category}`);
      project.hidden = !show;
      if (show) visible++;
    });
    const status = document.querySelector('#filter-status');
    if (status) status.textContent = `Showing ${visible} ${visible === 1 ? 'project' : 'projects'}.`;
  }));

  document.querySelectorAll('.project-open').forEach(link => {
    link.addEventListener('click', event => {
      const dialog = document.getElementById(link.hash.slice(1));
      if (!(dialog instanceof HTMLDialogElement)) return;
      event.preventDefault();
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  document.querySelectorAll('.project-dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  });
})();

