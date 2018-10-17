"use strict";

const {
  BLIZZARD_API_KEY,
  BLIZZARD_SECRET
} = process.env

const passport = require('passport')
const express = require('express')
const BnetStrategy = require('passport-bnet').Strategy

passport.use(new BnetStrategy({
  clientID: BLIZZARD_API_KEY,
  clientSecret: BLIZZARD_SECRET,
  callbackURL: "https://www.wowwebtools.com/auth/bnet/callback",
  region: "us",
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

const PORT = parseInt(process.argv[2], 10)

const app = express()

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  const hi = `everything works ${(new Date()).getTime()}`
  console.log(hi)
  res.end(hi)
})

app.get('/auth/bnet',
    passport.authenticate('bnet'));
 
app.get('/auth/bnet/callback',
    passport.authenticate('bnet', { failureRedirect: '/' }),
    function(req, res){
      console.log('we got through')
      res.redirect('/');
    })

app.listen(PORT, () => { console.log(`server running on ${PORT}`) })
