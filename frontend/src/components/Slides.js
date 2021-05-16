
import React, { useEffect, moment } from "react";
import { Box, Button, makeStyles, Paper, Slide } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    borderStyle: 'dotted',
  }
}))
var i = -1;
// export default function Slides(props) {
//   const images = [
//     'https://img3.doubanio.com/lpic/s24223015.jpg', 'https://material-ui.com/static/images/grid-list/vegetables.jpg', 'https://material-ui.com/static/images/grid-list/star.jpg'
//   ]
//   const [imageIndex, setImage] = React.useState(images[0]);
//   setTimeout(() => {
//     i++;
//     setImage(images[i]);
//     if (i == images.length - 1) {
//       i = -1;
//     }
//   }, 10000);
//   /*setInterval(function() { 
//     for(var i=0;i<images.length;i++)
//     {setImage(images[i])
//     if(i===images.length-1)
//     i=0;
//   }
//  },4000);*/
//   return (<Paper>
//     <img src={imageIndex}></img>
//     <Box style={{ display: "flex" }}>
//       {images.map((v, k) => <Button key={k} onClick={() => { setImage(images[k]) }}>{k}</Button>)}
//     </Box>
//   </Paper>);
// }


export default class Slides extends React.Component {
  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.images = [
      'https://material-ui.com/static/images/grid-list/breakfast.jpg',
      'https://material-ui.com/static/images/grid-list/vegetables.jpg',
      'https://material-ui.com/static/images/grid-list/star.jpg'
    ]
    this.state = {
      imageIndex: 0,
      imageLastIndex: this.images.length - 1,
      sliding: false,
      clickOnSliding: false
    };
    this.slidesRunning = null;
    this.refreshTime = 1000;
  }
  refresh() {
    if (!this.slidesRunning) return;
    console.log('refresh');
    const k = (this.state.imageIndex === this.images.length - 1) ? 0 : (this.state.imageIndex + 1);
    this.setState({ imageIndex: k, imageLastIndex: this.state.imageIndex, sliding: true });
    setTimeout(() => {
      if (this.state.clickOnSliding) return;
      this.setState({ sliding: false });
    }, 500);
    setTimeout(this.refresh, this.refreshTime);
  }
  componentDidMount() {
    console.log('componentDidMount');
    this.slidesRunning = true;
    setTimeout(this.refresh, this.refreshTime);
  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.slidesRunning = false;
  }
  render() {
    return <Paper>
      {/* <Box>
        <img src={this.images[this.state.imageIndex]}></img>
      </Box> */}
      <Slide direction={!this.state.sliding ? "left" : "right"} in={!this.state.sliding} timeout={{ enter: 500, exit: 500 }} mountOnEnter unmountOnExit>
        <img style={{ height: 300, width: "100%" }} src={this.images[this.state.sliding ? this.state.imageLastIndex : this.state.imageIndex]}></img>
      </Slide>
      {/* <Slide direction={this.state.sliding ? "left" : "right"} in={this.state.sliding} timeout={{ enter: 500, exit: 500 }} mountOnEnter unmountOnExit>
        <img src={this.images[this.state.imageLastIndex]}></img>
      </Slide> */}
      <Box style={{ display: "flex", justifyContent: "center" }}>
        {this.images.map((v, k) => <Button key={k} onClick={() => { this.setState({ imageIndex: k }) }}>{k}</Button>)}
      </Box>
    </Paper >
  }
}