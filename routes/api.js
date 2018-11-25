const express = require('express')
const {Character} = require('../models')
const {
  BLIZZARD_API_KEY,
  BLIZZARD_SECRET,
  BLIZZARD_REGION,
  PORT,
  DISCORD_URL
} = process.env

module.exports = function(app, blizzard, sequelize) {
  const api = express.Router()
  const checkToken = (req, res, next) => {
    console.log('checking for tokens')
    if (req.user) {
      const {token} = req.user
      console.log(`user found with token ${token}`)
      blizzard.checkToken(BLIZZARD_REGION, {token})
        .then(({data}) => {
          const exp = new Date(data.exp * 1000)
          if (Date.now() > exp) {
            console.log(`Token expired ${exp.toISOString()} :: attempting to refresh`)
            req.token_expired = true
          }
          console.log('Token is still valid, we will use it')
          next()
        }, (error) => {
          req.token_expired = true
          next()
        })
    } else {
      res.status(404).end('Unauthenticated to query data')
    }
  }

  const refreshToken = (req, res, next) => {
    if (!req.token_expired) {
      next()
      return
    }
    console.log('refreshing token')
    blizzard.fetchToken(region, {
      grant_type: "client_credentials", 
      client_id: BLIZZARD_API_KEY, 
      client_secret: BLIZZARD_SECRET
    }).then(({data}) => {
      console.log(data)
      next()
    }, (error) => {
      console.dir(error.response.data)
      res.status(404).end('Unable to refresh token')
    })
  }

  function finisher(req, res) {
    if (res.data) {
      res.send(res.data)
    } else {
      res.status(404).send('Something went wrong, check the server logs')
    }
  }

  function commonHandler(req, res, next) {
    return ({data}) => {
      res.data = data
      next()
    }
  }

  api.use(checkToken, refreshToken)

  api.route('/realms').get(
    (req, res, next) => {
      blizzard.data.realm({
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher
  )

  api.route('/realm/:realmSlug').get(
    (req, res, next) => {
      blizzard.data.realm({
        origin: BLIZZARD_REGION,
        realm: req.params.realmSlug, 
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/characters').get(
    (req, res, next) => {
      if (req.user.bid == null || req.query.refresh) {
        res.characters = []
        next()
      } else {
        Character.findAll({where: {bid: req.user.bid}}).then(characters => {
          res.characters = characters
          next()
        })        
      }
    },
    (req, res, next) => {
      let request
      if (res.characters.length !== 0) {
        res.data = {characters: res.characters}
        next()
        // check for expiration and try loading again
        // otherwise, these should be fine for now, just return them
      } else {
        console.log('requesting account info from Blizzard')
        blizzard.account.wow({
          origin: BLIZZARD_REGION,
          access_token: req.user.token
        }).then(({data: {characters}}) => {
          console.log(`got ${characters.length} characters from blizzard`)
          return sequelize.transaction((t) => {
            return Promise.all(characters.map(_character => {
              _character.bid = req.user.bid
              return Character.findOrCreate({
                where: {
                  bid: req.user.bid,
                  name: _character.name,
                  realm: _character.realm
                },
                defaults: _character,
                transaction: t
              }).then(([character, created]) => {
                if (created) {
                  console.log(`Added character ${character.name} to DB with id: ${character.id}`)                
                } else {
                  // probably need to update the character at this point
                  if (_character.lastUpdated !== character.lastUpdated) {
                    console.log(`The remote character has been updated ${_character.lastUpdated} / ${character.lastUpdated}.`, character, _character)
                  } else {
                    console.log('The remote character has not changed since last sync')
                  }
                  console.log(`Found character ${character.name} in DB with id: ${character.id}`)
                }
                return character
              }).catch(err => {console.log(err)})
            }))
          })
        }).then((characters) => {
          return {data: {characters}}
        }).then(commonHandler(req, res, next))
      }
    },
    finisher)

  api.route('/races').get((req, res, next) => {
      blizzard.wow.data( 'character-races', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/classes').get(
    (req, res, next) => {
      blizzard.wow.data('character-classes', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/achievements').get(
    (req, res, next) => {
      blizzard.wow.data('character-achievements', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/guild/rewards').get(
    (req, res, next) => {
      blizzard.wow.data('guild-rewards', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/guild/perks').get(
    (req, res, next) => {
      blizzard.wow.data('guild-perks', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/guild/achievements').get(
    (req, res, next) => {
      blizzard.wow.data('guild-achievements', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/item/:itemId').get(
    (req, res, next) => {
      blizzard.wow.item({
        id: req.params.itemId,
        namespace: 'dynamic-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/recipe/:recipeId').get(
    (req, res, next) => {
      blizzard.wow.recipe({
        id: req.params.recipeId,
        namespace: 'dynamic-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)


  api.route('/item/classes').get(
    (req, res, next) => {
      blizzard.wow.data('item-classes', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/talents').get(
    (req, res, next) => {
      blizzard.wow.data('talents', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/pet/types').get(
    (req, res, next) => {
      blizzard.wow.data('pet/types', {
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  api.route('/character/:realm/:name/:field').get((req, res, next) => {
    const {realm, name, field} = req.params
    console.log(`handling request to get ${name}:${realm} data ${field}`)
    blizzard.wow.character(field, {
      access_token: req.user.token,
      ...req.params
    }).then(commonHandler(req, res, next)).catch(err => {
      console.error(err.response.status)
      res.status(500)
      res.json({err: err.reponse.data})
    })
  }, finisher)

  api.route('/guild/:realm/:name/:field').get((req, res, next) => {
    const {realm, name, field} = req.params
    blizzard.wow.guild(field, {
      access_token: req.user.token,
      ...req.params
    }).then(commonHandler(req, res, next))
  }, finisher)

  api.route('/discord').get((req, res, next) => {
    const {realm, guild, characters} = req.params
    return DISCORD_URL
  }, finisher)

  app.use('/api', api)

}