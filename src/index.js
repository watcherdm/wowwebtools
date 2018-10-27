import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import * as Colors from '@material-ui/core/colors'
import { withTheme } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

const getTheme = () => {
  let overwrites = {      
    "palette": {
      type: 'dark',
      "primary": {
        main: Colors.cyan[700],
        dark: Colors.cyan[800],
        contrastText: Colors.grey[600]
      },
      "accent": {
        main: Colors.purple[500],
        dark: Colors.purple[400],
        contrastText: Colors.purple[300]
      }
    },
    typography: {
      useNextVariant: true
    }
  }
  return createMuiTheme(overwrites);
}

class App extends Component {
  render() {
    return <MuiThemeProvider theme={getTheme()}>
      <CssBaseline/>
      <AppBar position="fixed" color="primary">
        <strong>Booty Bangers Union</strong>
        <a href="/test">Test</a>
        <a href="/test">Test</a>
        <a href="/test">Test</a>
        <a href="/test">Test</a>
      </AppBar>
    </MuiThemeProvider>
  }
}

ReactDOM.render(<App/>, document.getElementById("app"))