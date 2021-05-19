import { Box, Container, Grid, List, ListItem, Paper, Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { isChinese } from "../utils/utils";

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
  let nickHead;
  if (((!isChinese(nick[0])) && ((nick[1] && (!isChinese(nick[1]))) || (!nick[1]))) && !head) nickHead = nick.slice(0, 2);
  const leftContent = <Box style={{ display: 'flex', flexDirection: "column", minWidth: 90 }} onClick={() => { link && window.open(link, '_blank'); }}>
    <Box>
      {head ? <Avatar alt={nick} src={head} className={classes.large}></Avatar> : <Avatar alt={nick} className={classes.large}>{nickHead ? nickHead : nick[0]}</Avatar>}
    </Box>
    <Box>
      <Typography variant="h4">{nick}</Typography>
      {username ? <Typography variant="body1">@{username}</Typography> : null}
    </Box>
  </Box>;
  return <Box style={{ padding: 20, width: "100%" }}>
    <Grid container spacing={3}>
      <Grid item xs={9} lg={5}>
        <Grid container spacing={3}>
          <Grid item xs={4} lg={3}>
            {leftContent}
          </Grid>
          <Grid item xs={5} lg={4} onClick={() => { window.open(link, '_blank'); }}>
            {readmeState ? <Box>
              <img src={readmeState}></img>
            </Box> : null}
          </Grid>
        </Grid>
      </Grid>
      {profile ? <Grid item xs={12} lg={7}>
        <Paper style={{ width: "100%" }}>
          <Box style={{ backgroundColor: "#00000020", padding: 30, borderLeftStyle: "solid", borderLeftWidth: 10, borderLeftColor: "#00000040" }}>
            <Typography variant="body1">{profile}</Typography>
          </Box>
        </Paper>
      </Grid> : null}
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
    {
      username: 'lin-zhifan',
      nick: 'Kiryu Sento',
      head: 'https://portrait.gitee.com/uploads/avatars/user/2761/8283353_lin-zhifan_1620866347.png!avatar200',
      link: 'https://gitee.com/lin-zhifan'
    },
    {
      username: 'sealls',
      nick: '海豹',
      link: 'https://gitee.com/sealls',
      head: "http://bed-1254016670.cos.ap-guangzhou.myqcloud.com/my_imgs/kyMwmz_QQ%E5%9B%BE%E7%89%8720210519090319.jpg"
    },
    {
      nick: '魂莫千羽',
      head: "http://bed-1254016670.cos.ap-guangzhou.myqcloud.com/my_imgs/Rserrx_QQ%E5%9B%BE%E7%89%8720210519090319.jpg"
    },
  ];
  const ladderClimbers = {
    username: 'Ladder-Climbers',
    nick: 'Ladder Climbers',
    profile: "来自哈工深的项目开发小组~",
    head: 'https://avatars.githubusercontent.com/u/74187667?s=200&v=4',
    link: 'https://gitee.com/ladder-climbers'
  };
  return <Container maxWidth="lg">
    <Typography variant="h4">关于我们</Typography>
    <People people={ladderClimbers}></People>
    <Grid container>
      {people.map((v, k) =>
        <Grid key={k} item xs={v.readmeState ? 12 : 4}>
          <People people={v}></People>
        </Grid>
      )}
    </Grid>
  </Container>
}