import React from 'react';
import { Button, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import Recomends from "./Recommends";
import { api } from "../api/api";
import store from '../data/store';
import { setSearchInfo } from '../data/action';

let requestingSearchInfo = false;
if (!store.getState().searchInfo && !requestingSearchInfo) {
  (async () => {
    requestingSearchInfo = true;
    const resp = await api.request('search', 'PATCH');
    store.dispatch(setSearchInfo(resp.data.search_info));
    requestingSearchInfo = false;
  })();
}


export default function SearchBox(props) {
  const { onSearch } = props;
  const searchInfo = store.getState().searchInfo;
  const [searchValue, setSearchValue] = React.useState('');
  // const searchTypeList = [
  //   '全部', '百度学术'
  // ];
  // const [searchType, setSearchType] = React.useState(searchTypeList[0]);
  const [searchType, setSearchType] = React.useState(searchInfo ? Object.keys(searchInfo)[0] : null);
  const handleSearch = () => {
    if (!onSearch) return;
    onSearch(searchValue, searchType, searchInfo);
  };
  return (
    <Grid container spacing={3}>
      {/* <Grid item xs={2}></Grid> */}
      {/* <Grid item xs={2}> */}
      <Grid item xs={4}>
        <FormControl fullWidth>
          <InputLabel>搜索类型</InputLabel>
          <Select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
            }}
          >
            {searchInfo ? Object.keys(searchInfo).map((k, v) => {
              return <MenuItem key={v} value={k}>{searchInfo[k].name}</MenuItem>
            }) : <MenuItem>正在加载</MenuItem>}
          </Select>
        </FormControl>
      </Grid>
      {/* <Grid item xs={5}> */}
      <Grid item xs={6}>
        <TextField fullWidth
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSearch();
          }}
          value={searchValue}></TextField>
      </Grid>
      {/* <Grid item xs={1}> */}
      <Grid item xs={2}>
        <Button variant="contained" color="primary" onClick={handleSearch}>搜索</Button>
      </Grid>
      {/* <Grid item xs={2}></Grid>
      <Grid item xs={6}></Grid> */}
    </Grid>);
};