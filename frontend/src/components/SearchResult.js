import { Box, Grid, List, ListItem, Typography } from "@material-ui/core";
import React from "react";
import BookItem from "./BookItem";

function SmartSearchResult(props) {
  const { books } = props;
  // console.log('books', books);
  return <Grid container spacing={3}>
    {books && books.map((book, k) => <Grid key={k} item xs={12} sm={6} lg={3}><BookItem book={{
      title: book.title,
      author: book.abstract,
      desc: null,
      cover: book.cover_url,
      rating: book.rating
    }}></BookItem></Grid>)}
  </Grid>;
}

function DoubanResult(props) {
  const { books } = props;
  return <Grid container spacing={3}>
    {books && books.map((book, k) => <Grid key={k} item xs={12} sm={6} lg={3}><BookItem book={{
      title: book.title,
      author: book.abstract,
      desc: null,
      cover: book.cover_url
    }}></BookItem></Grid>)}
  </Grid>;
}

export function LocalDatabaseResult(props) {
  const { books } = props;
  console.log('local props', props);
  return <Grid container spacing={3}>
    {books && books.map((book, k) => <Grid key={k} item xs={12} sm={6} lg={3}><BookItem book={{
      title: book.title,
      author: book.base_info,
      desc: book.description,
      cover: null
    }}></BookItem></Grid>)}
  </Grid>;
}

export default function SearchResult(props) {
  const { result } = props;
  return <List>
    {result.smart_search ? <ListItem>
      <Box>
        <Typography variant="h4">智能搜索</Typography>
        <SmartSearchResult books={result.smart_search.books}></SmartSearchResult>
      </Box>
    </ListItem> : null}
    {result.douban ? <ListItem>
      <Box>
        <Typography variant="h4">豆瓣搜索</Typography>
        <SmartSearchResult books={result.douban}></SmartSearchResult>
      </Box>
    </ListItem> : null}
    {result.local_database ? <ListItem>
      <Box>
        <Typography variant="h4">数据库搜索</Typography>
        <LocalDatabaseResult books={result.local_database.books}></LocalDatabaseResult>
      </Box>
    </ListItem> : null}
  </List>
}