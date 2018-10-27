"use strict";

const {
  BLIZZARD_API_KEY,
  BLIZZARD_SECRET,
  BLIZZARD_REGION,
  PORT
} = process.env

const cookieParser = require('cookie-parser')
const passport = require('passport')
const express = require('express')
const session = require('express-session')
const BnetStrategy = require('passport-bnet').Strategy
const blizzard = require("blizzard.js").initialize({apikey: BLIZZARD_API_KEY, origin: BLIZZARD_REGION})
const api = require("./routes/api")

const callbackHost = (PORT === 8080) ? '' : 'https://www.wowwebtools.com'
const callbackURL = `${callbackHost}/auth/bnet/callback` 

passport.use(new BnetStrategy({
  clientID: BLIZZARD_API_KEY,
  clientSecret: BLIZZARD_SECRET,
  callbackURL: "/auth/bnet/callback",
  region: BLIZZARD_REGION,
  scope: ['wow.profile']
}, function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile)
  done(null, profile)
}))

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})

const app = express()

app.use(session({ 
  secret: BLIZZARD_SECRET,
  cookie: {
    httpOnly: false
  },
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static('public'))

app.get('/auth/bnet',
  passport.authenticate('bnet'));
 
app.get('/auth/bnet/callback',
  passport.authenticate('bnet', { failureRedirect: '/' }),
  function(req, res){
    res.redirect('/');
  })

app.get('/session', (req, res) => {  
  const status = req.user ? 200 : 404
  res.status(status).send(req.user)
})

api(app, blizzard)

app.listen(PORT, () => { console.log(`server running on ${PORT}`) })
