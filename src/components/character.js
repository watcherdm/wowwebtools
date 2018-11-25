import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
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
    const {
      race, 
      gender, 
      thumbnail, 
      name, 
      realm, 
      level,
      updatedDate
    } = character
    const renderHost = '//render-us.worldofwarcraft.com'
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
            {name} {level}
          </Typography>
          <Typography component="p">
            {realm}
            {updatedDate}
            <Button component='span' onClick={() => fetch(`/api/character/${realm.toLowerCase()}/${name.toLowerCase()}/professions`)}>Professions</Button>
            <Button component='span' onClick={() => fetch(`/api/character/${realm.toLowerCase()}/${name.toLowerCase()}/items`)}>Items</Button>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  }
}

export default withStyles(styles)(Character)