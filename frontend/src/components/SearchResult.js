import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import BookItem from "./BookItem";

function SmartSearchResult(props) {
  const { books } = props;
  console.log('books', books);
  return <Grid container spacing={3}>
    {books.map((book, k) => <Grid key={k} item xs={6} sm={4} lg={3}><BookItem book={{
      title: book.title,
      author: book.abstract,
      desc: null,
      cover: book.cover_url
    }}></BookItem></Grid>)}
  </Grid>
}

export default function SearchResult(props) {
  const { result } = props;
  return <Box>
    <Typography variant="h6">智能搜索</Typography>
    <SmartSearchResult books={result.smart_search.books}></SmartSearchResult>
  </Box>
}