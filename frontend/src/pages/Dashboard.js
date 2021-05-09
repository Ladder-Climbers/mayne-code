import React from 'react';
import { Button, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import Recomends from "../components/Recommends";
import { api } from "../api/api";

export default function Dashboard() {
  const [searchValue, setSearchValue] = React.useState('');
  const searchTypeList = [
    '全部', '百度学术'
  ];
  const [searchType, setSearchType] = React.useState(searchTypeList[0]);
  const handleSeach = () => {
    console.log('search', searchValue);
    api.request('test', 'GET').then(resp => resp.json()).then((d) => {
      console.log(d);
    })
  };
  return (<Container>
    <Grid container spacing={3}>
      <Grid item xs={2}></Grid>
      <Grid item xs={2}>
        <FormControl fullWidth>
          <InputLabel>搜索类型</InputLabel>
          <Select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
            }}
          >
            {searchTypeList.map((k, v) => {
              return <MenuItem key={v} value={k}>{k}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <TextField fullWidth
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSeach();
          }}
          value={searchValue}></TextField>
      </Grid>
      <Grid item xs={1}>
        <Button variant="contained" color="secondary" onClick={handleSeach}>搜索</Button>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
    <br />
    <Divider></Divider>
    <br />
    <Recomends></Recomends>
  </Container>);
};