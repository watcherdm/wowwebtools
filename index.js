"use strict";

const https = require('https')
const http = require('http')

const PORT = 8080

function handleRequest(req, res) {
  res.end('Everything works!')
}

const server = http.createServer(handleRequest)
server.listen(PORT, function(){
  console.log('server listening on ' + PORT)
})