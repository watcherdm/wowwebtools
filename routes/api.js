let blizzard = null

const {
  BLIZZARD_API_KEY,
  BLIZZARD_SECRET,
  BLIZZARD_REGION,
  PORT
} = process.env

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
        console.log(error)
        res.status(404).end('Error checking token')
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

module.exports = function(app, _blizzard) {

  blizzard = _blizzard

  function commonHandler(req, res, next) {
    return ({data}) => {
      res.data = data
      next()
    }
  }

  app.get('/data/wow/realm/:realmSlug', 
    checkToken, 
    refreshToken, 
    (req, res, next) => {
      blizzard.data.realm({
        origin: BLIZZARD_REGION,
        realm: req.params.realmSlug, 
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  app.get('/data/wow/characters', 
    checkToken, 
    refreshToken, 
    (req, res, next) => {
      blizzard.account.wow({
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)

  app.get('/data/wow/playable-class', 
    checkToken, 
    refreshToken, 
    (req, res, next) => {
      blizzard.data.classes({
        namespace: 'static-us',
        origin: BLIZZARD_REGION,
        access_token: req.user.token
      }).then(commonHandler(req, res, next))
    },
    finisher)
}