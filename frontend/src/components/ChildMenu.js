import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
const useStyles = makeStyles({
  root: {
    width: 500,
    display:'flex',

  },
});

export default function SimpleBottomNavigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Top" icon={<ArrowUpwardIcon onClick={arrowUpwardIcon(...this.props)}/>}  />
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
    </BottomNavigation>
  );
}
function arrowUpwardIcon(props){//To top
  const {ArrowUpwardIcon,window}=props;
  const trigger = useScrollTrigger({
    target:window ? window():undefined,
    disableHysteresis:true,
    threshold:100,
  });
}
