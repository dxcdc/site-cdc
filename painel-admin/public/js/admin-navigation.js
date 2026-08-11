(() => {
  const SIDEBAR = '[data-css="sidebar"]';
  const RESOURCES = '[data-css="sidebar-resources"]';

  const closeOpenSections = (resources) => {
    resources.querySelectorAll('a:not([href])').forEach((toggle) => {
      if (toggle.nextElementSibling?.tagName === 'UL') toggle.click();
    });
  };

  const identifyNavigationTitle = (resources) => {
    [...resources.querySelectorAll('*')]
      .filter((element) => element.children.length === 0 && element.textContent.trim().toLowerCase() === 'navigation')
      .forEach((element) => element.classList.add('cdc-navigation-title'));
  };

  const labelCategoryIcons = (resources) => {
    resources.querySelectorAll('a:not([href])').forEach((toggle) => {
      const label = toggle.querySelector(':scope > div')?.textContent.trim();
      if (!label) return;
      toggle.title = label;
      toggle.setAttribute('aria-label', label);
    });
  };

  const hideAdminJsFooter = () => {
    document.querySelectorAll('a[href="https://adminjs.co/"]').forEach((link) => {
      link.parentElement?.classList.add('cdc-adminjs-footer');
    });
  };

  const normalizedText = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  const nestGoogleAccessPage = () => {
    const sidebar = document.querySelector(SIDEBAR);
    const resources = document.querySelector(RESOURCES);
    const sourceLink = sidebar?.querySelector('a[href="/admin/pages/googleAccess"]:not(.cdc-google-access-link)');
    if (!sidebar || !resources || !sourceLink) return;

    const sourceSection = sourceLink.closest('section');
    if (sourceSection && !sourceSection.querySelector('a:not([href])')) {
      sourceSection.classList.add('cdc-pages-source');
    } else {
      sourceLink.closest('li')?.classList.add('cdc-pages-source');
    }

    const settingsToggle = [...resources.querySelectorAll('a:not([href])')]
      .find((toggle) => normalizedText(toggle.textContent) === 'configuracoes');
    if (!settingsToggle) return;

    if (location.pathname === '/admin/pages/googleAccess' && settingsToggle.nextElementSibling?.tagName !== 'UL') {
      settingsToggle.click();
      return;
    }

    const submenu = settingsToggle.nextElementSibling;
    if (submenu?.tagName !== 'UL' || submenu.querySelector('.cdc-google-access-link')) return;

    const item = document.createElement('li');
    const link = sourceLink.cloneNode(true);
    link.classList.add('cdc-google-access-link');
    link.setAttribute('aria-label', 'Acesso Google');
    link.title = 'Acesso Google';
    item.appendChild(link);
    submenu.appendChild(item);
  };

  const configureSidebar = () => {
    const sidebar = document.querySelector(SIDEBAR);
    const resources = document.querySelector(RESOURCES);
    if (!sidebar || !resources || sidebar.dataset.cdcNavigationReady === 'true') return;

    sidebar.dataset.cdcNavigationReady = 'true';
    identifyNavigationTitle(resources);
    labelCategoryIcons(resources);
    hideAdminJsFooter();
    nestGoogleAccessPage();

    sidebar.addEventListener('mouseleave', () => {
      window.setTimeout(() => {
        if (!sidebar.matches(':hover')) closeOpenSections(resources);
      }, 120);
    });

    new MutationObserver(() => {
      identifyNavigationTitle(resources);
      labelCategoryIcons(resources);
      hideAdminJsFooter();
      nestGoogleAccessPage();
    })
      .observe(resources, { childList: true, subtree: true });
  };

  const observer = new MutationObserver(() => {
    configureSidebar();
    hideAdminJsFooter();
    nestGoogleAccessPage();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  configureSidebar();
  hideAdminJsFooter();
  nestGoogleAccessPage();
})();
