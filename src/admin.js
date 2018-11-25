import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Theme from './theme'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Characters from './components/characters'
import Files from './components/files'

export default class Admin extends Component {
  render() {
    const {session} = this.props
    return (
      <Grid
        justify="space-between" // Add it here :)
        container 
        spacing={8}
      >
        <Grid item>
          <Characters session={session} realm="Bloodhoof" guild="Booty Bangers Union" sortBy="level"/>
        </Grid>
        <Grid item>
          <Files session={session}/>
        </Grid>
      </Grid>
    )
  }
}