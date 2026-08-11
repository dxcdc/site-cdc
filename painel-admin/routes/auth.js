import express from 'express'
import passport from '../config/passport.js'
import {
  addDatabaseEmail,
  environmentEmails,
  listDatabaseEmails,
  removeDatabaseEmail,
} from '../services/oauthAccess.js'

const router = express.Router()

const sessionUser = (req) => req.user || req.session?.passport?.user
const requireAdminApi = (req, res, next) => sessionUser(req)
  ? next()
  : res.status(401).json({ error: 'Sessão não autenticada' })

const requireSameOrigin = (req, res, next) => {
  const origin = req.get('origin')
  if (origin && origin !== process.env.BASE_URL) {
    return res.status(403).json({ error: 'Origem não autorizada' })
  }
  return next()
}

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

router.get('/admin/api/oauth-access', requireAdminApi, async (_req, res, next) => {
  try {
    return res.json({
      configured: hasGoogleOAuth,
      callbackUrl: `${process.env.BASE_URL}/admin/auth/google/callback`,
      protectedEmails: environmentEmails(),
      emails: await listDatabaseEmails(),
    })
  } catch (error) {
    return next(error)
  }
})

router.post('/admin/api/oauth-access', requireAdminApi, requireSameOrigin, express.json(), async (req, res, next) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!validEmail(email)) return res.status(400).json({ error: 'Informe um e-mail válido' })

  try {
    return res.status(201).json(await addDatabaseEmail(email))
  } catch (error) {
    return next(error)
  }
})

router.delete('/admin/api/oauth-access/:id', requireAdminApi, requireSameOrigin, async (req, res, next) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Registro inválido' })

  try {
    await removeDatabaseEmail(id)
    return res.status(204).end()
  } catch (error) {
    return next(error)
  }
})

router.get('/admin/api/session-user', (req, res) => {
  const user = sessionUser(req)
  if (!user) return res.status(401).json({ error: 'Sessão não autenticada' })

  const email = user.email || user.emails?.[0]?.value || ''
  const name = user.name || user.displayName || email.split('@')[0] || 'Usuário CDC'
  const avatar = user.picture || user.photos?.[0]?.value || process.env.ADMIN_AVATAR_URL || null

  return res.json({ name, email, avatar })
})

router.post('/admin/logout', (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) return next(logoutError)
    req.session.destroy((sessionError) => {
      if (sessionError) return next(sessionError)
      res.clearCookie('connect.sid')
      return res.status(204).end()
    })
  })
})

const hasGoogleOAuth = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== '<SEU_GOOGLE_CLIENT_ID>' &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== '<SEU_GOOGLE_CLIENT_SECRET>'
)

if (hasGoogleOAuth) {
  router.get('/admin/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

  router.get('/admin/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/admin/login?error=oauth' }),
    (req, res) => {
      res.redirect('/admin')
    }
  )
}

router.get('/admin/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Painel Admin CDC - Login</title>
      <style>
        body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f4f6f8; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .login-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; max-width: 400px; text-align: center; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #a7181d; margin-bottom: 0.5rem; }
        .subtitle { font-size: 0.9rem; color: #666; margin-bottom: 1.5rem; }
        .form-group { margin-bottom: 1.25rem; text-align: left; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #444; font-weight: 600; }
        input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 1rem; }
        .password-field { position: relative; }
        .password-field input { padding-right: 3.25rem; }
        .password-toggle { position: absolute; top: 50%; right: 0.35rem; transform: translateY(-50%); width: 2.5rem; height: 2.5rem; display: grid; place-items: center; padding: 0; color: #4b5563; background: transparent; border: 0; border-radius: 50%; }
        .password-toggle:hover, .password-toggle:focus-visible { color: #a7181d; background: #fff3e0; outline: 2px solid #fe9a03; }
        .password-toggle svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .password-toggle .eye-closed { display: none; }
        .password-toggle[data-visible="true"] .eye-open { display: none; }
        .password-toggle[data-visible="true"] .eye-closed { display: block; }
        button { width: 100%; padding: 0.75rem; background: #fe9a03; border: none; border-radius: 6px; color: #222; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        button:hover { background: #cb7a01; }
        .alert { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.875rem; }
        .hint { font-size: 0.8rem; color: #777; margin-top: 1.5rem; border-top: 1px solid #eee; padding-top: 1rem; }
      </style>
    </head>
    <body>
      <div class="login-card">
        <div class="logo">🏢 Painel Admin CDC</div>
        <div class="subtitle">Gestão de Governança & Conteúdo</div>
        ${req.query.error ? `<div class="alert">${req.query.error === 'oauth' ? 'A conta Google utilizada não está autorizada para este painel.' : 'Credenciais inválidas. Verifique seu e-mail e senha.'}</div>` : ''}
        <form action="/admin/login" method="POST">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" autocomplete="username" required />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <div class="password-field">
              <input type="password" id="password" name="password" autocomplete="current-password" required />
              <button type="button" class="password-toggle" id="password-toggle" data-visible="false" aria-label="Mostrar senha" title="Mostrar senha">
                <svg class="eye-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg class="eye-closed" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18"></path><path d="M10.6 6.2A11.8 11.8 0 0 1 12 6c6.5 0 10 6 10 6a18.5 18.5 0 0 1-2.1 2.8M6.6 6.6C3.6 8.4 2 12 2 12s3.5 6 10 6a10.7 10.7 0 0 0 4.3-.9"></path><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"></path></svg>
              </button>
            </div>
          </div>
          <button type="submit">Entrar no Painel</button>
        </form>
        ${hasGoogleOAuth ? '<div style="margin-top:1rem;"><a href="/admin/auth/google">Ou entrar com Google OAuth</a></div>' : ''}
        <div class="hint">Painel administrativo - ONG CDC</div>
      </div>
      <script>
        (() => {
          const input = document.getElementById('password');
          const toggle = document.getElementById('password-toggle');
          toggle.addEventListener('click', () => {
            const visible = input.type === 'text';
            input.type = visible ? 'password' : 'text';
            toggle.dataset.visible = String(!visible);
            toggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
            toggle.title = visible ? 'Mostrar senha' : 'Ocultar senha';
            input.focus();
          });
        })();
      </script>
    </body>
    </html>
  `)
})

router.post('/admin/login', express.urlencoded({ extended: true }), (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email === adminEmail && password === adminPassword) {
    req.session.passport = { user: { id: 1, email: adminEmail, name: 'Admin CDC' } };
    return res.redirect('/admin');
  } else {
    return res.redirect('/admin/login?error=1');
  }
})

export default router
