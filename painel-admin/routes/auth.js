import express from 'express'
import passport from '../config/passport.js'

const router = express.Router()

const hasGoogleOAuth = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== '<SEU_GOOGLE_CLIENT_ID>' &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== '<SEU_GOOGLE_CLIENT_SECRET>'
)

if (hasGoogleOAuth) {
  router.get('/admin/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

  router.get('/admin/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/admin/login' }),
    (req, res) => {
      res.redirect('/admin')
    }
  )
}

router.get('/admin/login', (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ongcdc.org.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_password';

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
        ${req.query.error ? '<div class="alert">Credenciais inválidas. Verifique seu e-mail e senha.</div>' : ''}
        <form action="/admin/login" method="POST">
          <div class="form-group">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" value="${adminEmail}" required />
          </div>
          <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" id="password" name="password" value="${adminPassword}" required />
          </div>
          <button type="submit">Entrar no Painel</button>
        </form>
        ${hasGoogleOAuth ? '<div style="margin-top:1rem;"><a href="/admin/auth/google">Ou entrar com Google OAuth</a></div>' : ''}
        <div class="hint">Laboratório Local — ONG CDC</div>
      </div>
    </body>
    </html>
  `)
})

router.post('/admin/login', express.urlencoded({ extended: true }), (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ongcdc.org.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin_password';

  if (email === adminEmail && password === adminPassword) {
    req.session.passport = { user: { id: 1, email: adminEmail, name: 'Admin CDC' } };
    return res.redirect('/admin');
  } else {
    return res.redirect('/admin/login?error=1');
  }
})

export default router
