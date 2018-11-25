"use strict";

const {
  BLIZZARD_API_KEY,
  BLIZZARD_SECRET,
  BLIZZARD_REGION,
  DATABASE_URL,
  PORT,
  NODE_ENV
} = process.env
console.log()
const _PORT = parseInt(PORT, 10)

var options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['htm', 'html'],
  index: 'index.html',
  lastModified: true,
  maxAge: '1d',
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
    res.header('Cache-Control', 'public, max-age=1d');
  }
}
const Sequelize = require('sequelize')
const sequelize = new Sequelize(DATABASE_URL, {})

const cookieParser = require('cookie-parser')
const passport = require('passport')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const blizzard = require("blizzard.js").initialize({apikey: BLIZZARD_API_KEY, origin: BLIZZARD_REGION})
const api = require("./routes/api")
const admin = require('./routes/admin')
const auth = require('./routes/auth')
const http = require('http')
const socket = require('socket.io')
const app = express()

app.use(bodyParser.json({limit: '50mb'}))

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})
var server = http.Server(app)
var io = socket(server)
server.listen(PORT, () => { console.log(`server running on ${PORT}`) })

auth(express, app, passport, session, sequelize)
api(app, blizzard, sequelize)
admin(app)

app.use('/js', express.static(__dirname + '/public/js'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/img', express.static(__dirname + '/public/img'))
app.use('/', express.static(__dirname + '/public', options))
app.use('*', express.static(__dirname + '/public', options))

io.on('connection', (socket) => {
  console.log('Client connected: requesting session id');
  socket.on('session-confirmed', (data) => {
    console.log(`Client session id acquired: ${data.session_id}`)
    socket.join(data.session_id)
  })
  socket.emit('confirm-session');
  socket.on('close', () => console.log(`Client Disconnected ${socket.id}`))
  socket.on('retry-auth', (data) => {
    console.log(`Request for session ${data.session_id} to retry auth`)
    io.to(data.session_id).emit('retry-then', {or: 'close'})
  })
})