import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Theme from './theme'
import Paper from '@material-ui/core/Paper'

export default class Admin extends Component {
  render() {
    return (<Paper><div>Hello World</div></Paper>)
  }
}

ReactDOM.render(<Admin/>, document.getElementById('app'))