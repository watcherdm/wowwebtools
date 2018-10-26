"use strict";

const {
  BLIZZARD_API_KEY,
  BLIZZARD_SECRET,
  PORT
} = process.env

const passport = require('passport')
const express = require('express')
const BnetStrategy = require('passport-bnet').Strategy
const blizzard = require("blizzard.js").initialize({apikey: BLIZZARD_API_KEY})

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

app.get('/data/wow/realm/:realmSlug', ( req, res) => {
  if (req.user === undefined) {
    res.redirect('/auth/bnet')
  } else {
    console.log(req.user)
    blizzard.data.realm({realm: req.params.realmSlug}).then(({data}) => {
      res.send(data)
    }).catch((err) => {
      console.log(err.stack)
      res.send('Something went wrong, check the server logs')
    })    
  }
})

app.listen(PORT, () => { console.log(`server running on ${PORT}`) })
