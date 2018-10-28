import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  card: {
    width: '10vw',
  },
  media: {
    height: 140,
  },
};

class Character extends Component {
  constructor(props) {
    super(props)
    this.state = {
      character: props.character,
      classes: props.classes
    }
  }
  render() {
    const {character, classes} = this.state
    const {race, gender, thumbnail, name, realm} = character
    const renderHost = 'http://render-us.worldofwarcraft.com'
    const insetPath = thumbnail.replace(/avatar/, 'inset')
    const altPath = `/wow/static/images/2d/inset/${race}-${gender}.jpg`
    return <Card className={classes.card} raised={true}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={`${renderHost}/character/${insetPath}?alt=${altPath}`}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography component="p">
            {realm}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  }
}

export default withStyles(styles)(Character)