const fs = require('fs')
const express = require("express")

module.exports = (app) => {
  fs.readdirSync(`./public/json`, {withFileTypes: true})
}