import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import BookItem from "../components/BookItem";
import { Box, Button, Grid, LinearProgress, Typography, useScrollTrigger } from '@material-ui/core';
import { api } from '../api/api';
import { setErrorInfo } from '../data/action';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    // width: 500,
    // height: 450,
  },
}));


export default function Recomends() {
  const classes = useStyles();
  // const books = [
  //   {
  //     title: "fangguojieryuan",
  //     author: "haha",
  //     desc: "a small book",
  //     cover: "https://material-ui.com/static/images/grid-list/star.jpg"
  //   },
  //   {
  //     title: "fangguojieryuan2",
  //     author: "ha",
  //     desc: "a small book",
  //     cover: "https://material-ui.com/static/images/grid-list/star.jpg"
  //   },
  //   {
  //     title: "fangguojieryuan",
  //     author: "ha",
  //     desc: "a small book",
  //     cover: "https://material-ui.com/static/images/grid-list/star.jpg"
  //   },
  //   {
  //     title: "fangguojieryuan2",
  //     author: "ha",
  //     desc: "a small book",
  //     cover: "https://material-ui.com/static/images/grid-list/star.jpg"
  //   },
  //   {
  //     title: "fangguojieryuan",
  //     author: "ha",
  //     desc: "a small book",
  //     cover: "https://material-ui.com/static/images/grid-list/star.jpg"
  //   },
  //   {
  //     title: "fangguojieryuan2",
  //     author: "ha",
  //     desc: "a small book",
  //     cover: "https://material-ui.com/static/images/grid-list/star.jpg"
  //   },
  // ];
  const [books, setBooks] = React.useState([]);
  const [requesting, setRequesting] = React.useState(false);
  if (!requesting) {
    setRequesting(true);
    api.request('douban_top').then(resp => {
      if (resp.code !== 200) {
        setErrorInfo(resp);
      } else {
        setRequesting(false);
        setBooks(resp.data.douban_top);
      }
    })
  }
  const trigger = useScrollTrigger();
  if (trigger) { console.log("Slide to bottom"); }
  return (<Box>
    <br />
    <Typography variant="h4">好书推荐</Typography>
    <br />
    <Grid container spacing={3}>
      {books.map((v, k) => {
        return <Grid key={k} item xs={6} sm={4} lg={3}><BookItem book={v}></BookItem></Grid>;
      })}
    </Grid>
    <br></br>
    <LinearProgress color="secondary" style={{ display: (trigger ? "block" : "none") }}></LinearProgress>
  </Box>);
};