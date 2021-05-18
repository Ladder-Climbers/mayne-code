import { Box, Container, Grid, Typography } from "@material-ui/core";
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
  return <Box onClick={() => { window.open(link, '_blank'); }}>
    <Grid container spacing={3}>
      <Grid item xs={12} lg={3}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Avatar alt={nick} src={head} className={classes.large}></Avatar>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="h4">{nick}</Typography>
              <Typography variant="body1">@{username}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={6}>
        {readmeState ? <Box>
          <img src={readmeState}></img>
        </Box> : null}
      </Grid>
    </Grid>
  </Box>
}

export default function About(props) {
  const people = [
    {
      username: 'chiro2001',
      nick: 'Chiro',
      profile: "I like it.",
      head: 'https://avatars.githubusercontent.com/u/41908064?v=4',
      link: 'https://github.com/chiro2001',
      // readmeState: 'https://github-readme-stats.vercel.app/api?username=chiro2001&show_icons=true&include_all_commits=true&hide_border=true'
      readmeState: 'https://github-readme-stats.vercel.app/api?show_icons=false&username=chiro2001&count_private=true&include_all_commits=true&hide_border=true&hide_title=true&hide_rank=true&locale=cn'
    }
  ];
  return <Container>
    <People people={people[0]}></People>
  </Container>
}