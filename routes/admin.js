const glob = require('glob')
const path = require('path')
const fs = require('fs')
const express = require("express")

const admins = [
  "Psionide#1405"
]

module.exports = (app) => {
  const admin = express.Router()

  const checkAdmin = (req, res, next) => {
    const {user} = req
    if (admins.includes(user.battletag)) {
      next()
      return
    }
    console.log(`Attempt to access admin api by non admin ${user.battletag}`)
    res.status(404).end()
  }

  admin.route('/json').get(checkAdmin, (req, res) => {
    const files = glob(`./public/json/*.json`, (err, files) => {
      res.send(files)
    })
  })

  admin.route('/write').post(checkAdmin, (req, res) => {
    const {filename, contents} = req.body
    fs.writeFile(path.resolve(__dirname, `../public/json/${filename}.json`), JSON.stringify(contents, undefined, 2), {encoding: 'utf8'}, (err) => {
      if (err) {
        console.error(err)
        res.status(500).send('Darkness Here.')
      } else {
        res.send({
          success: `${filename}.json file written. Access at /json/${filename}.json to verify.`
        })
      }
    })
  })

  app.use('/admin', admin)
}