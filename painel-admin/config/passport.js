import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
import { isGoogleEmailAuthorized } from '../services/oauthAccess.js'
dotenv.config()

const hasGoogleOAuth = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== '<SEU_GOOGLE_CLIENT_ID>' &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== '<SEU_GOOGLE_CLIENT_SECRET>'
)

if (hasGoogleOAuth) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL || 'http://localhost:3001'}/admin/auth/google/callback`,
    state: true,
  }, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value?.trim().toLowerCase()
    const emailVerified = profile._json?.email_verified === true
    const authorized = emailVerified && await isGoogleEmailAuthorized(email)

    if (!email || !authorized) {
      return done(null, false, { message: 'Conta Google não autorizada' })
    }

    return done(null, {
      id: profile.id,
      email,
      name: profile.displayName || email.split('@')[0],
      picture: profile.photos?.[0]?.value || null,
      provider: 'google',
    });
  }));
} else {
  console.warn('⚠️ Google OAuth não configurado (GOOGLE_CLIENT_ID ausente ou placeholder). Login local ativado no Painel Admin.');
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport
