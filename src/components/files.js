import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  main: '100vw'
}

class Files extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: []
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
    fetch('/admin/json', {
      signal: request.signal
    })
      .then(res => res.json())
      .then((files) => {
        this.setState({files})
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

  loadData() {
    Promise.all([
      fetch('/api/realms').then(r => r.json()),
      fetch('/api/races').then(r => r.json()),
      fetch('/api/classes').then(r => r.json()),
      fetch('/api/achievements').then(r => r.json()),
      fetch('/api/guild/rewards').then(r => r.json()),
      fetch('/api/guild/perks').then(r => r.json()),
      fetch('/api/guild/achievements').then(r => r.json()),
      fetch('/api/item/classes').then(r => r.json()),
      fetch('/api/talents').then(r => r.json()),
      fetch('/api/pet/types').then(r => r.json())
    ]).then(([
        {realms}, 
        {races}, 
        {classes}, 
        {achievements},
        {rewards},
        {perks},
        {achievements: guild_achievements},
        {classes: item_classes},
        talents,
        {petTypes}
      ]) => {
        const data = {
          realms, 
          races, 
          classes, 
          achievements, 
          rewards, 
          perks, 
          guild_achievements,
          item_classes,
          talents,
          petTypes
        }

        Object.keys(data).map(key => {
          fetch('/admin/write', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: key,
              contents: data[key]
            })
          })
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  render() {
    const {files} = this.state
    const message = (files.length === 0) ? <Button onClick={this.loadData}>Load Data</Button> : <Paper><Typography>{`${files.length} / 10 files loaded`}</Typography><Button>Reload Data</Button></Paper>
    return <div>{message}</div>
  }
}

export default withStyles(styles)(Files)