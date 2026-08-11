(() => {
  const STORAGE_KEY = 'cdc-admin-theme';
  const root = document.documentElement;

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M9.5 20v-6h5v6"></path></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"></path></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>',
    profile: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M5 21a7 7 0 0 1 14 0"></path></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"></path><path d="M14 3h6a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-6"></path></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
  };

  const getTheme = () => localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';

  const applyTheme = (theme) => {
    root.dataset.cdcTheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    const button = document.querySelector('#cdc-theme-toggle');
    if (!button) return;
    const dark = theme === 'dark';
    button.innerHTML = dark ? icons.sun : icons.moon;
    button.title = dark ? 'Ativar tema claro' : 'Ativar tema escuro';
    button.setAttribute('aria-label', button.title);
  };

  applyTheme(getTheme());

  const initials = (name) => name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'U';

  const createButton = (id, title, icon) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = id;
    button.className = 'cdc-topbar-button';
    button.title = title;
    button.setAttribute('aria-label', title);
    button.innerHTML = icon;
    return button;
  };

  const showProfile = (user) => {
    document.querySelector('#cdc-profile-dialog')?.remove();
    const dialog = document.createElement('div');
    dialog.id = 'cdc-profile-dialog';
    dialog.className = 'cdc-profile-dialog-backdrop';
    dialog.innerHTML = `
      <section class="cdc-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="cdc-profile-title">
        <button type="button" class="cdc-profile-close" aria-label="Fechar">${icons.close}</button>
        <div class="cdc-profile-avatar cdc-profile-avatar-large"></div>
        <h2 id="cdc-profile-title">Perfil do usuário</h2>
        <p class="cdc-profile-name"></p>
        <p class="cdc-profile-email"></p>
      </section>`;
    dialog.querySelector('.cdc-profile-name').textContent = user.name;
    dialog.querySelector('.cdc-profile-email').textContent = user.email;
    renderAvatar(dialog.querySelector('.cdc-profile-avatar'), user);
    const close = () => dialog.remove();
    dialog.querySelector('.cdc-profile-close').addEventListener('click', close);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) close(); });
    document.body.appendChild(dialog);
  };

  const renderAvatar = (element, user) => {
    element.replaceChildren();
    if (user.avatar) {
      const image = document.createElement('img');
      image.src = user.avatar;
      image.alt = `Foto de ${user.name}`;
      image.referrerPolicy = 'no-referrer';
      image.addEventListener('error', () => {
        element.textContent = initials(user.name);
        element.classList.add('cdc-avatar-fallback');
      }, { once: true });
      element.appendChild(image);
    } else {
      element.textContent = initials(user.name);
      element.classList.add('cdc-avatar-fallback');
    }
  };

  const buildToolbar = async (topbar) => {
    if (document.querySelector('#cdc-topbar-actions') || topbar.dataset.cdcTopbarMounting === 'true') return;
    topbar.dataset.cdcTopbarMounting = 'true';

    let user = { name: 'Usuário CDC', email: '', avatar: null };
    try {
      const response = await fetch('/admin/api/session-user', { credentials: 'same-origin' });
      if (response.ok) user = await response.json();
    } catch (_error) {
      // A barra permanece utilizável mesmo se os dados do perfil não carregarem.
    }

    const toolbar = document.createElement('div');
    toolbar.id = 'cdc-topbar-actions';
    toolbar.className = 'cdc-topbar-actions';

    const home = createButton('cdc-home-button', 'Ir para o início', icons.home);
    home.addEventListener('click', () => { window.location.href = '/admin'; });

    const theme = createButton('cdc-theme-toggle', 'Alternar tema', icons.moon);
    theme.addEventListener('click', () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark'));

    const accountWrap = document.createElement('div');
    accountWrap.className = 'cdc-account-wrap';
    const account = createButton('cdc-account-button', 'Abrir menu da conta', icons.user);
    account.classList.add('cdc-account-button');
    renderAvatar(account, user);
    account.setAttribute('aria-haspopup', 'menu');
    account.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('div');
    menu.className = 'cdc-account-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <div class="cdc-account-summary">
        <strong class="cdc-account-name"></strong>
        <span class="cdc-account-email"></span>
      </div>
      <button type="button" role="menuitem" data-action="profile">${icons.profile}<span>Perfil do usuário</span></button>
      <button type="button" role="menuitem" data-action="logout">${icons.logout}<span>Sair</span></button>`;
    menu.querySelector('.cdc-account-name').textContent = user.name;
    menu.querySelector('.cdc-account-email').textContent = user.email;

    const closeMenu = () => {
      menu.classList.remove('is-open');
      account.setAttribute('aria-expanded', 'false');
    };
    account.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      account.setAttribute('aria-expanded', String(open));
    });
    menu.querySelector('[data-action="profile"]').addEventListener('click', () => {
      closeMenu();
      showProfile(user);
    });
    menu.querySelector('[data-action="logout"]').addEventListener('click', async () => {
      const response = await fetch('/admin/logout', { method: 'POST', credentials: 'same-origin' });
      if (response.ok) window.location.href = '/admin/login';
    });
    document.addEventListener('click', (event) => {
      if (!accountWrap.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        document.querySelector('#cdc-profile-dialog')?.remove();
      }
    });

    accountWrap.append(account, menu);
    toolbar.append(home, theme, accountWrap);
    topbar.appendChild(toolbar);
    topbar.dataset.cdcTopbarMounting = 'false';
    applyTheme(getTheme());
  };

  const mount = () => {
    const topbar = document.querySelector('[data-css="topbar"]');
    if (topbar) buildToolbar(topbar);
  };

  new MutationObserver(mount).observe(document.documentElement, { childList: true, subtree: true });
  mount();
})();
