import React, {Component} from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

const styles = theme => ({
  root: {
    width: '50%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class Files extends Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      classes: props.classes
    }
    this.loadData = this.loadData.bind(this)
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

        Object.keys(data).map(prop => {
          const records = data[prop]
          this.writeJSONFile({filename: prop, contents: records })
            .then(() => {
              if (prop === 'realms') {
                records.forEach(({slug}, i) => {
                  fetch(`/api/realm/${slug}`).then(r => r.json()).then(obj => {
                    this.writeJSONFile({filename:`${prop}-${slug}`, contents: obj})
                  })
                })                
              }
            })
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  writeJSONFile({filename, contents}) {   
    return fetch('/admin/write', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename,
        contents
      })
    })
  }

  renderFiles() {
    const {files} = this.state
    return files.map((file, i) => {
      return (<ListItem key={file} button>
                <ListItemText inset primary={file.replace(/\.\/public\/json\/([\w\-]*)\.json/, '$1')} />
              </ListItem>)
    })
  }

  render() {
    const {files, classes} = this.state
    const message = (files.length === 0) ? 'Load Data' : 'Reload Data'
    return <div className={classes.root}>
      <Button onClick={this.loadData}>{message}</Button>
      <List component="nav">
        {this.renderFiles()}
      </List>
    </div>
  }
}

export default withStyles(styles)(Files)