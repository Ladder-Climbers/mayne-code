import { Box, Button, Paper } from "@material-ui/core";
import React from "react";

export default function Slides(props) {
  const images = [
    'https://img3.doubanio.com/lpic/s24223015.jpg', 'https://material-ui.com/static/images/grid-list/vegetables.jpg', 'https://material-ui.com/static/images/grid-list/star.jpg'
  ]
  const [image, setImage] = React.useState(images[0]);
  return (<Paper>
    <img src={image}></img>
    <Box style={{ display: "flex" }}>
      {images.map((v, k) => <Button key={k} onClick={() => { setImage(images[k]) }}>{k}</Button>)}
    </Box>
  </Paper>);
}