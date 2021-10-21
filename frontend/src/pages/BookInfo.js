import { Container, Grid, IconButton, Typography } from "@material-ui/core";
import React from "react";
import ShareIcon from '@material-ui/icons/Share';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { api } from '../api/api';
import { getHashedQuery, objectUpdate } from "../utils/utils";

function BookInfoFrame(props) {
  const { info } = props;
  const convert_map = {
    base_info: '基本信息',
    description: '描述',
    rating_nums: '评分'
  };
  const hidden_map = {
    douban_id: 1,
    created_at: 1,
    douban_url: 1,
    comment_number: 1,
    pricing: 1,
    updated_at: 1
  };
  return <div>
    <Typography variant="h5">{info.title}</Typography>
    {Object.keys(info).map((k, v) => {
      if (k == 'title') return null;
      if (hidden_map[k]) return null;
      return <Typography key={k} varian="body1" color="textSecondary">{convert_map[k] || k}: {info[k]}</Typography>
    })}
    <img src={info.img_url}></img>
  </div>;
}

function BookOperation(props) {
  const { info } = props;
  if (!info) return null;
  return <div>
    <Grid container>
      <Grid item xs={4}>
        <IconButton>
          <ShareIcon></ShareIcon>
        </IconButton>
      </Grid>
      <Grid item xs={4}>
        <IconButton>
          <PlaylistAddIcon></PlaylistAddIcon>
        </IconButton>
      </Grid>
      <Grid item xs={4}>
        <IconButton>
          <ContactMailIcon></ContactMailIcon>
        </IconButton>
      </Grid>
    </Grid>
  </div>;
}

function BookComments(props) {
  const { info, comments } = props;
  if (!info || !comments) return null;
  return <div>
    {comments.map((comment, i) => {
      return <>
        <div>{comment.uid}</div>
      </>;
    })}
  </div>;
}

export default function BookInfo(props) {
  const [state, setInnerState] = React.useState({
    title: null,
    info: null,
    comments: null,
    recommends: null,
    requestingInfo: false,
    requestingComments: false,
    requestingRecommends: false
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  const query = getHashedQuery();
  console.log(query);
  if (state.title !== query[0][1]) {
    setState({ title: query[0][1] });
    return <Container>Loading...</Container>;
  }
  if (!state.requestingInfo) {
    setState({ requestingInfo: true });
    api.request('search', 'GET', { key: state.title, src: "local_database" }).then(resp => {
      let info = null;
      try {
        info = resp.data.search.local_database.books[0];
      } catch (e) {
        console.error(e);
      }
      if (!info) {
        setState({ requestingInfo: true, info: false });
      } else {
        setState({ requestingInfo: true, info: info });
      }
    });
  }
  if (state.info === false) {
    return <Container>
      <Typography color="secondary" variant="h5">数据库扩展中……</Typography>
      <Typography color="textSecondary" variant="body2">数据库扩展中……</Typography>
    </Container>
  }
  return <>
    <Grid container spacing={1}>
      <Grid item lg={4} sm={6} xs={12}>
        <BookInfoFrame info={state.info}></BookInfoFrame>
      </Grid>
      <Grid item lg xs sm xs>
        <BookOperation info={state.info}></BookOperation>
      </Grid>
    </Grid>
  </>;
}