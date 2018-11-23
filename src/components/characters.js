import React, {Component} from 'react'
import Character from './character'
import Grid from '@material-ui/core/Grid'

export default class Characters extends Component {
  constructor(props) {
    super(props)
    const {session, characters, reload, guild, realm, sortBy} = props
    this.state = {
      session,
      characters,
      reload,
      guild,
      realm,
      sortBy
    }
  }
  componentDidMount() {
    const {
      session,
      request, 
      reload, 
      characters
    } = this.state
    if (session.user === undefined) {
      return
    }
    if (request) {
      request.abort()
    }
    if ( reload || (characters || []).length === 0 ) {
      const new_request = new AbortController()
      this.setState({
        request: new_request
      })
      fetch('/api/characters', {
        signal: new_request.signal
      })
        .then(res => res.json())
        .then(({characters}) => {
          this.setState({characters})
        })
        .catch((err) => {
          if (err instanceof DOMException && err.code === 20) {
            console.dir('request aborted')
          } else {
            throw err
          }
        })
    }
  }
  componentWillUnmount() {
    const {request} = this.state
    request.abort()
  }

  getRenderCharacters() {
    const {characters, sortBy} = this.state
    return (characters || []).filter((character) => {
      return ['guild', 'realm'].map(field => {
        if (this.state[field]) {
          return character[field] === this.state[field]
        }
        return true
      }).filter(pass => pass).length == 2
    }).sort((a, b) => {
      const key = sortBy || 'lastmodified'
      return a[key] - b[key]
    })
  }

  renderCharacters() {
    return this.getRenderCharacters().map((character, i) => {
      return (<Grid item key={`characters-${i}`}>
        <Character character={character}/>
      </Grid>)
    })
  }
  render() {
    const characters = this.renderCharacters() || null
    return (
      <Grid
        justify="space-between" // Add it here :)
        container 
        spacing={8}
      >
        {characters}
      </Grid>
    )
  }
}