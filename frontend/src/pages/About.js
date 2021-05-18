import { Box, Container, Grid, List, ListItem, Paper, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function People(props) {
  const classes = useStyles();
  const { username, nick, profile, head, link, readmeState } = props.people ? props.people : props;
  return <Box style={{ padding: 20 }}>
    <Grid container spacing={3}>
      <Grid item xs={9} lg={5}>
        <Grid container spacing={3}>
          <Grid item xs={4} sm={3} lg={2}>
            <Box style={{ display: 'flex', flexDirection: "column" }} onClick={() => { window.open(link, '_blank'); }}>
              <Box>
                <Avatar alt={nick} src={head} className={classes.large}></Avatar>
              </Box>
              <Box>
                <Typography variant="h4">{nick}</Typography>
                <Typography variant="body1">@{username}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={5} lg={3} onClick={() => { window.open(link, '_blank'); }}>
            {readmeState ? <Box>
              <img src={readmeState}></img>
            </Box> : null}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={7}>
        <Paper>
          <Box style={{ backgroundColor: "#00000020", padding: 30, borderLeftStyle: "solid", borderLeftWidth: 10, borderLeftColor: "#00000040" }}>
            <Typography variant="body1">{profile}</Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box >
}

export default function About(props) {
  const people = [
    {
      username: 'chiro2001',
      nick: 'Chiro',
      profile: "I like it.",
      head: 'https://avatars.githubusercontent.com/u/41908064?v=4',
      link: 'https://github.com/chiro2001',
      readmeState: 'https://github-readme-stats.vercel.app/api?show_icons=false&username=chiro2001&count_private=true&include_all_commits=true&hide_border=true&hide_title=true&hide_rank=true&locale=cn'
    },
    {
      username: 'criwits',
      nick: 'Hans Wan',
      profile: "¯\\_(ツ)_/¯",
      head: 'https://avatars.githubusercontent.com/u/59825102?v=4',
      link: 'https://github.com/criwits/',
      readmeState: 'https://github-readme-stats.vercel.app/api?show_icons=false&username=criwits&count_private=true&include_all_commits=true&hide_border=true&hide_title=true&hide_rank=true&locale=cn'
    },
  ];
  return <Container maxWidth="lg">
    <List>
      {people.map((v, k) => <ListItem key={k}><People people={v}></People></ListItem>)}
    </List>
  </Container>
}