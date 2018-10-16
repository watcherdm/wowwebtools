"use strict";

const https = require('https')
const http = require('http')

const PORT = parseInt(process.argv[2], 10)

function handleRequest(req, res) {
  res.end('Everything works!')
}

console.log(PORT)
const server = http.createServer(handleRequest)
server.listen(PORT, function(){
  console.log('server listening on ' + PORT)
})