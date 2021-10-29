import React from 'react';
import { Popover, List, ListItem, ListItemText, Button, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
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
  const { onSearch, defaultValue } = props;
  const searchInfo = store.getState().searchInfo;
  const [searchValue, setSearchValue] = React.useState(defaultValue ? (defaultValue.key ? defaultValue.key : '') : '');
  const [searchType, setSearchType] = React.useState(searchInfo ? (defaultValue ? defaultValue.src : Object.keys(searchInfo)[0]) : null);
  const [searchLogs, setSearchLogs] = React.useState(null);
  const [reqeustedSeachLogs, setRequestedSearchLogs] = React.useState(false);
  const [popAnchor, setPopAnchor] = React.useState(null);
  const handleSearch = () => {
    if (!onSearch) return;
    setSearchLogs(null);
    setRequestedSearchLogs(false);
    onSearch(searchValue, searchType, searchInfo);
  };
  if (!reqeustedSeachLogs) {
    setRequestedSearchLogs(true);
    api.request('search', "PUT").then(resp => {
      setSearchLogs(resp.data.search_logs);
    });
  }
  return (
    <>
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
            value={searchValue}
            onFocus={(e) => {
              setPopAnchor(e.currentTarget);
            }}
            onBlur={() => {
              setPopAnchor(null);
            }}
          ></TextField>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={handleSearch}>搜索</Button>
        </Grid>
      </Grid>
      <Popover
        style={{ pointerEvents: 'none' }}
        disableAutoFocus
        disableEnforceFocus
        open={!!popAnchor}
        anchorEl={popAnchor}
        onClose={() => { setPopAnchor(null); }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <List>
          {searchLogs && searchLogs.map((log, v) => <ListItem
            button
            key={log && (log.created_at || log.key)}
            onClick={() => {
              onSearch(log, searchType, searchInfo);
            }}
            >
            <ListItemText primary={log.key}></ListItemText>
          </ListItem>)}
          {(!searchLogs || (searchLogs && searchLogs.length === 0)) && <ListItem>
            <ListItemText primary="无搜索记录"></ListItemText>
          </ListItem>}
        </List>
      </Popover>
    </>);
};