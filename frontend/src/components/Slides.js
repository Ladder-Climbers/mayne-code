
import React,{useEffect,moment} from "react";
import { Box, Button, makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) =>({
  root:{
    borderStyle:'dotted',

  }
}))
var i=-1;
export default function Slides(props) {
  
  const images = [
    'https://img3.doubanio.com/lpic/s24223015.jpg', 'https://material-ui.com/static/images/grid-list/vegetables.jpg', 'https://material-ui.com/static/images/grid-list/star.jpg'
  ]
  const [image, setImage] = React.useState(images[0]);

 setTimeout(()=>{
    i++;
    setImage(images[i]);
    if(i==images.length-1){
      i=-1;
    }
  },10000);
  /*setInterval(function() { 
    for(var i=0;i<images.length;i++)
    {setImage(images[i])
    if(i===images.length-1)
    i=0;
  }
 },4000);*/
  return (<Paper>
    <img src={image}></img>
    <Box style={{ display: "flex" }}>
      {images.map((v, k) => <Button key={k} onClick={() => { setImage(images[k]) }}>{k}</Button>)}
      
    </Box>
  </Paper>);
}
