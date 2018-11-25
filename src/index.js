import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import AppBar from '@material-ui/core/AppBar'
import Switch from '@material-ui/core/Switch'
import Dialog from '@material-ui/core/Dialog'
import Drawer from '@material-ui/core/Drawer'
import Avatar from '@material-ui/core/Avatar'
import Characters from './components/characters'
import Toolbar from '@material-ui/core/Toolbar'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Theme from './theme'
import Admin from './admin'
import Main from './main'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {session:{}}
    this.changeAuth = this.changeAuth.bind(this)
    this.socket = io()
    this.socket.on('retry-then', ({or}) => {
      console.log('retry request received in client window', or)
      this.componentDidMount().then(() => {
        this.setState({
          showBlizzardAuth: false
        })
      })
    })
    this.socket.on('confirm-session', () => {
      const {session} = this.state
      if (session.id) {
        this.socket.emit('session-confirmed', {location: location.href, session_id: this.state.session.id})      
      } else {
        this.componentDidMount().then((session) => {
          this.socket.emit('session-confirmed', {location: location.href, session_id: this.state.session.id})      
        })
      }
    })
  }

  componentDidMount() {
    return fetch("/auth/session").then((res) => res.json()).then((session) => {
      this.setState({session})
    })
  }

  changeAuth() {
    const {session} = this.state
    if (session.user) {
      fetch('/auth/logout')
        .then((res) => res.json()).then((session) => this.setState({session}))
    } else {
      this.setState({
        showBlizzardAuth: true
      })
    }
  }

  selectCharacter() {
    this.setState({
      selectCharacter: !!this.state.selectCharacter
    })    
  }
  toggleDrawer(anchor, show) {
  }

  render() {
    const {session, showBlizzardAuth} = this.state
    if (showBlizzardAuth) {
      window.open("/auth/bnet")
    }
    return <Router>
      <Theme>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Grid
              justify="space-between"
              container 
              spacing={24}
            >
              <Grid item>
                <Typography variant="h4" color="primary">
                  Booty Bangers Union
                </Typography>
              </Grid>

              <Grid item>
                <Button variant='contained' color="primary">
                  <Link to="/">Home</Link>
                </Button>
              </Grid>
              <Grid item>
                <Button disabled={!session.user} variant='contained' color="primary">
                  <Link to="/admin">Admin</Link>
                </Button>
              </Grid>
              <Grid item>
                <Drawer open={this.state.selectCharacter} onClose={this.selectCharacter}>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={this.selectCharacter}
                    onKeyDown={this.selectCharacter}
                  >
                    <Characters session={session} guild='Booty Bangers Union' realm='Bloodhoof'/>
                  </div>
                </Drawer>

                <Switch 
                  checked={!!session.user} 
                  onChange={this.changeAuth}/>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Route path="/" exact component={Main} />
        <Route path="/admin" render={(props) => <Admin {...props} session={session}/> } />
      </Theme>
    </Router>
  }
}

ReactDOM.render(<App/>, document.getElementById("app"))