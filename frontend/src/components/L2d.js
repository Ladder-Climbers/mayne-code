import { Button, Fab } from "@material-ui/core";
import AssistantIcon from '@material-ui/icons/Assistant';
import React from "react";
import '../css/waifu.css';

export default function L2d(props) {
  const [clicked, setCLicked] = React.useState(false);
  // console.log('window.started', window.started);
  if (!clicked)
    // return <Button onClick={() => {
    //   window.started = false;
    //   // console.log("start");
    // }}>点击显示</Button>;
    return <Fab color="primary" onClick={() => {
      window.started = false;
      setCLicked(true);
    }}>
      <AssistantIcon></AssistantIcon>
    </Fab>;
  return null;
}