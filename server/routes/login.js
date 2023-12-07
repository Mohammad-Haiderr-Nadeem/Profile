const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const session = require("express-session");
const { validateUser } = require("../controllers/login");

const router = express.Router();

router.use(
  session({
    secret: "router-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

process.env.GOOGLE_CLIENT_ID =
  "414289679851-bs69ov5eak5qe7peek9bv1dpn1shnu44.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "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";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
      accessType: "offline",
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.displayName + "@gmail.com",
          gender: "N/A",
        };
        return done(null, user, accessToken, profile);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
    prompt: "consent select_account",
  })
);

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
  }),
  validateUser
);

module.exports = router;
