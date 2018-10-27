const commonHandler = (data) => {
  console.log(data)
}

const API = {
  bloodhoof: () => {
    return $.get('/data/wow/realm/bloodhoof').then(commonHandler)
  },
  characters: () => {
    return $.get('/data/wow/characters').then(commonHandler)
  },
  classes: () => {
    return $.get('/data/wow/classes').then(commonHandler)
  },
  races: () => {
    return $.get('/data/wow/races').then(commonHandler)
  },
  achievements: () => {
    return $.get('/data/wow/achievements').then(commonHandler)
  },
  guild: {
    rewards: () => {
      return $.get('/data/wow/guild/rewards').then(commonHandler)
    },
    perks: () => {
      return $.get('/data/wow/guild/perks').then(commonHandler)
    },
    achievements: () => {
      return $.get('/data/wow/guild/achievements').then(commonHandler)
    }
  },
  item: {
    classes: () => {
      return $.get('/data/wow/item/classes').then(commonHandler)
    }
  },
  talents: () => {
    return $.get('/data/wow/talents').then(commonHandler)
  }
}

function generateClickable(obj, elem, namespace = '') {
  Object.keys(obj).map(key => {
    if (typeof obj[key] === 'function') {
      const link = $(`<button>${namespace} ${key}</button>`)
      link.on('click', obj[key])
      link.appendTo(elem)
    } else {
      const container = $(`<div>${key}</div>`)
      container.appendTo(elem)
      generateClickable(obj[key], container, [namespace, key].filter(x=>x).join('.'))
    }
  })
}

generateClickable(API, '.tools')

$.get("/session").then((session) => {
  $('.tools').show()
}, () => {
  $('.tools').hide()
  $("<a href='/auth/bnet'>Login</a>").appendTo("body")
})
