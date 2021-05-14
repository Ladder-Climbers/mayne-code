import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import BookItem from "../components/BookItem";
import { Box, Button } from '@material-ui/core';

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
  const books = [
    {
      title: "fangguojieryuan",
      author: "haha",
      desc: "a small book",
      cover: "https://img3.doubanio.com/lpic/s24223015.jpg"
    },
    {
      title: "fangguojieryuan2",
      author: "ha",
      desc: "a small book",
      cover: "https://img3.doubanio.com/lpic/s24223015.jpg"
    },
    {
      title: "fangguojieryuan",
      author: "ha",
      desc: "a small book",
      cover: "https://img3.doubanio.com/lpic/s24223015.jpg"
    },
    {
      title: "fangguojieryuan2",
      author: "ha",
      desc: "a small book",
      cover: "https://img3.doubanio.com/lpic/s24223015.jpg"
    },
    {
      title: "fangguojieryuan",
      author: "ha",
      desc: "a small book",
      cover: "https://img3.doubanio.com/lpic/s24223015.jpg"
    },
    {
      title: "fangguojieryuan2",
      author: "ha",
      desc: "a small book",
      cover: "https://img3.doubanio.com/lpic/s24223015.jpg"
    },
  ];
  return (<Box>
    <Button fullWidth>刷新</Button>
    <br />
    <GridList cellHeight={500} className={classes.gridList}>
      {/* <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
      <ListSubheader component="div">December</ListSubheader>
    </GridListTile> */}
      {books.map((v, k) => {
        return <GridListTile key={k}>
          <BookItem book={v}></BookItem>
        </GridListTile>;
      })}
      {/* {tileData.map((tile) => (
      
    ))} */}
    </GridList>
  </Box>);
};