import React from 'react';
import { Button, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import Recomends from "../components/Recommends";
import { api } from "../api/api";
import SearchBox from '../components/SearchBox';
import PopularAuthors from '../components/PopularAuthors';
import PopularTags from '../components/PopularTags';
import Slides from '../components/Slides';
export default function Dashboard() {
  return (<Container>
    <SearchBox></SearchBox>
    <br />
    <Divider></Divider>
    <Slides></Slides>
    <br />
    <Divider></Divider>
    <br />
    <Grid container spacing={10}>
      <Grid item lg={6} sm={12} style={{ padding: 20 }}>
        <PopularAuthors></PopularAuthors>
      </Grid>
      <Grid item lg={6} sm={12} style={{ padding: 20 }}>
        <PopularTags></PopularTags>
      </Grid>
    </Grid>
    <br />
    <Divider></Divider>
    <br />
    <Recomends></Recomends>
  </Container>);
};