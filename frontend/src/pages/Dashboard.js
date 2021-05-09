import React from 'react';
import { Button, Container, Grid, TextField, Typography } from "@material-ui/core";

export default function Dashboard() {
  const [searchValue, setSearchValue] = React.useState('');
  const handleSeach = () => {
    console.log('search', searchValue);
  };
  return (<Container>
    <Grid container spacing={3}>
      <Grid item xs={2}></Grid>
      <Grid item xs={7}>
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
  </Container>);
};