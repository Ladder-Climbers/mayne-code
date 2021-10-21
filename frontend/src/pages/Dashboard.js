import React from 'react';
import { Box, Button, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import Recomends from "../components/Recommends";
import { api } from "../api/api";
import SearchBox from '../components/SearchBox';
import PopularAuthors from '../components/PopularAuthors';
import PopularTags from '../components/PopularTags';
import Slides from '../components/Slides';
import history from "../utils/history";
import { urlEncode } from '../utils/utils';
import { Redirect } from 'react-router-dom';
export default function Dashboard(props) {
  const [visit, setVisit] = React.useState(null);
  if (visit) {
    return <Redirect to={visit}></Redirect>;
  }
  return (<Container>
    <Box>
      <Box style={{ paddingLeft: 40, paddingRight: 40 }}>
        <SearchBox onSearch={(key, src) => {
          // history.push({ pathname: "/search", search: '?' + urlEncode({ key, src }).slice(1) });
          setVisit(`/search?key=${key}&src=${src}`);
          // history.push({ pathname: "/search", params: { key, src } });
        }}></SearchBox>
      </Box>
    </Box>
    <br />
    <Divider></Divider>
    {/* <Slides></Slides> */}
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