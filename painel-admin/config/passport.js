import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import dotenv from 'dotenv'
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
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
} else {
  console.warn('⚠️ Google OAuth não configurado (GOOGLE_CLIENT_ID ausente ou placeholder). Login local ativado no Painel Admin.');
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport
