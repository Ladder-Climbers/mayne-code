import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import BookItem from "../components/BookItem";

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
      cover: "https://tse1-mm.cn.bing.net/th/id/OIP.k7lJNlhDglQEC5j6mSlNVwHaJ9?w=192&h=258&c=7&o=5&dpr=1.25&pid=1.7"
    },
    {
      title: "fangguojieryuan2",
      author: "ha",
      desc: "a small book",
      cover: "https://tse1-mm.cn.bing.net/th/id/OIP.k7lJNlhDglQEC5j6mSlNVwHaJ9?w=192&h=258&c=7&o=5&dpr=1.25&pid=1.7"
    },
    {
      title: "fangguojieryuan",
      author: "ha",
      desc: "a small book",
      cover: "https://tse1-mm.cn.bing.net/th/id/OIP.k7lJNlhDglQEC5j6mSlNVwHaJ9?w=192&h=258&c=7&o=5&dpr=1.25&pid=1.7"
    },
    {
      title: "fangguojieryuan2",
      author: "ha",
      desc: "a small book",
      cover: "https://tse1-mm.cn.bing.net/th/id/OIP.k7lJNlhDglQEC5j6mSlNVwHaJ9?w=192&h=258&c=7&o=5&dpr=1.25&pid=1.7"
    },
    {
      title: "fangguojieryuan",
      author: "ha",
      desc: "a small book",
      cover: "https://tse1-mm.cn.bing.net/th/id/OIP.k7lJNlhDglQEC5j6mSlNVwHaJ9?w=192&h=258&c=7&o=5&dpr=1.25&pid=1.7"
    },
    {
      title: "fangguojieryuan2",
      author: "ha",
      desc: "a small book",
      cover: "https://tse1-mm.cn.bing.net/th/id/OIP.k7lJNlhDglQEC5j6mSlNVwHaJ9?w=192&h=258&c=7&o=5&dpr=1.25&pid=1.7"
    },
  ];
  return (<GridList cellHeight={500} className={classes.gridList}>
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
  </GridList>);
};