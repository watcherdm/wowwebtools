import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Theme from './theme'
import Character from './components/character'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

export default class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      characters: []
    }
  }
  componentDidMount() {
    if (this.state.request) {
      this.state.request.abort()
    }
    const request = new AbortController()
    this.setState({
      request
    })
    fetch('/api/characters', {
      signal: request.signal
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
  componentWillUnmount() {
    this.state.request.abort()
  }
  renderCharacters() {
    const {characters} = this.state
    return characters.map((character, i) => {
      return (<Grid item key={`characters-${i}`}><Character character={character}/></Grid>)
    })
  }
  render() {
    const characters = this.renderCharacters() || null
    return (
      <Grid
        justify="space-between" // Add it here :)
        container 
        spacing={24}
      >
        {characters}
      </Grid>
    )
  }
}

ReactDOM.render(<Admin/>, document.getElementById('app'))