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

app.use(express.static('public'))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.use(session({
    secret: process.env.COOKIE_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: true,
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
