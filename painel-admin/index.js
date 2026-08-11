import express from 'express'
import session from 'express-session'
import passport from './config/passport.js'
import { adminJs } from './config/admin.js'
import { sequelize } from './config/database.js'
import authRoutes from './routes/auth.js'
import uploadEditorImageRoute from './routes/uploadIMG.js';
import AdminJSExpress from '@adminjs/express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

// Gera o bundle dos componentes personalizados antes de aceitar requisições.
// Em desenvolvimento, o watch também evita servir um bundle antigo copiado da máquina local.
if (process.env.NODE_ENV === 'production') {
    await adminJs.initialize()
} else {
    await adminJs.watch()
}

for (const variable of ['ADMIN_EMAIL', 'ADMIN_PASSWORD', 'COOKIE_SECRET']) {
    if (!process.env[variable] || process.env[variable].startsWith('<')) {
        throw new Error(`${variable} deve ser configurada com um valor seguro`)
    }
}

app.set('trust proxy', 1)

app.use(express.static('public'))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/admin/css', express.static(path.join(__dirname, 'public/css')))
app.use('/admin/js', express.static(path.join(__dirname, 'public/js')))
app.use('/admin/assets', express.static(path.join(__dirname, 'assets')))
app.get('/admin/frontend/assets/components.bundle.js', (_req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store',
    })
    res.type('application/javascript').sendFile(
        path.join(process.cwd(), '.adminjs/bundle.js'),
        { dotfiles: 'allow' },
    )
})

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' && process.env.BASE_URL?.startsWith('https://'),
    },
}))

app.use(passport.initialize())
app.use(passport.session())

// Rotas públicas e de autenticação
app.use(authRoutes)
app.use(uploadEditorImageRoute);
app.use("/assets", express.static(path.join(__dirname, './assets')));

// Proteção de rotas do Painel AdminJS
app.use(adminJs.options.rootPath, (req, res, next) => {
    if (req.path.startsWith('/auth/google') || req.path.startsWith('/login')) {
        next()
    } else if (req.session.passport && req.session.passport.user) {
        next()
    } else {
        res.redirect(`${adminJs.options.rootPath}/login`)
    }
})

// Redirecionamento da raiz / para /admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});

const adminRouter = AdminJSExpress.buildRouter(adminJs)
app.use(adminJs.options.rootPath, adminRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🛠️ Painel AdminJS rodando em http://localhost:${PORT}/admin`)
})
