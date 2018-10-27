const API = {
  realms : {
    bloodhoof: () => {
      return $.get('/data/wow/realm/bloodhoof')
    }
  },
  characters: () => {
    return $.get('/data/wow/characters')
  },
  classes: () => { 
    return $.get('/data/wow/playable-class')
  }
}
$('.characters').on('click', API.characters)
$('.realm').on('click', API.realms.bloodhoof)
$('.classes').on('click', API.classes)
$.get("/session").then((session) => {
  $('.tools').show()
}, () => {
  $('.tools').hide()
  $("<a href='/auth/bnet'>Login</a>").appendTo("body")
})
