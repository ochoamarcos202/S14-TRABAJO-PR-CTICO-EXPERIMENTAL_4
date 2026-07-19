const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/Usuario');

function configurarPassport() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

  // OAuth queda desactivado hasta configurar las credenciales de Google.
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    console.warn('OAuth de Google desactivado: faltan variables GOOGLE_*');
    return passport;
  }

  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error('Google no proporcionó un email'));

        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
          // Los usuarios OAuth no usan su contraseña para autenticarse localmente.
          usuario = await Usuario.create({
            nombre: profile.displayName || 'Usuario Google',
            email,
            password: `oauth:${profile.id}:${Date.now()}`
          });
        }
        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((usuario, done) => done(null, usuario.id));
  passport.deserializeUser(async (id, done) => {
    try {
      done(null, await Usuario.findById(id));
    } catch (error) {
      done(error);
    }
  });

  return passport;
}

module.exports = configurarPassport;
