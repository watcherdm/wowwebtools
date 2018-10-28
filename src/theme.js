import React, {Component} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import {cyan, grey, purple} from '@material-ui/core/colors'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'

export default class WwtTheme extends Component {

  static overwrites() {
    return { 
      "palette": {
        type: 'dark',
        "primary": {
          main: cyan[700],
          dark: cyan[800],
          contrastText: grey[600]
        },
        "secondary": {
          main: purple[500],
          dark: purple[400],
          contrastText: purple[300]
        }
      },
      typography: {
        useNextVariants: true
      }
    }
  }

  render() {
    const {children} = this.props
    return <MuiThemeProvider theme={createMuiTheme(WwtTheme.overwrites())}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  }
}