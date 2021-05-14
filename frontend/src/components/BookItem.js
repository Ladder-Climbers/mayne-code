import React from 'react';
import clsx from 'clsx';
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Collapse, Container, IconButton, makeStyles, Menu, MenuItem, Typography } from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));


export default function BookItem(props) {
  const classes = useStyles();
  const { book } = props;
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  return (<Card className={classes.root}>
    <CardHeader
      action={
        <Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorEl={anchorEl}>
            <MenuItem>删除</MenuItem>
          </Menu>
        </Box>
      }
      title={book.title}
      subheader={book.author}
    />
    <CardMedia
      className={classes.media}
      image={book.cover}
      title={book.title}
    />
    <CardContent>
      <Typography variant="body2" color="textSecondary" component="p">
        {book.desc}
      </Typography>
    </CardContent>
    <CardActions disableSpacing>
      <IconButton>
        <FavoriteIcon />
      </IconButton>
      <IconButton>
        <ShareIcon />
      </IconButton>
      <IconButton
        className={clsx(classes.expand, {
          [classes.expandOpen]: expanded,
        })}
        onClick={() => { setExpanded(!expanded); }}
        aria-expanded={expanded}
        aria-label="show more"
      >
        <ExpandMoreIcon />
      </IconButton>
    </CardActions>
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
        NONE
      </CardContent>

    </Collapse>
  </Card>);
};