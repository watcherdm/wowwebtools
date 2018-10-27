import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import AppBar from '@material-ui/core/AppBar'
import Switch from '@material-ui/core/Switch'
import Dialog from '@material-ui/core/Dialog'
import Avatar from '@material-ui/core/Avatar'
import Theme from './theme'
import Admin from './admin'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {session:{}}
    this.changeAuth = this.changeAuth.bind(this)
    this.socket = io()
    this.socket.on('retry-then', ({or}) => {
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
    return fetch("/auth/session").then((res) => res.json()).then((session) => this.setState({session}))
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

  render() {
    const {session, showBlizzardAuth} = this.state
    if (showBlizzardAuth) {
      window.open("/auth/bnet")
    }
    return <Router>
      <Theme>
        <AppBar position="static" color="secondary">
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>

          <Switch 
            checked={!!session.user} 
            color='secondary'
            onChange={this.changeAuth}/>
          
        </AppBar>
        <Route path="/" exact component={() => <div/>} />
        <Route path="/admin" exact component={Admin} />
      </Theme>
    </Router>
  }
}

ReactDOM.render(<App/>, document.getElementById("app"))