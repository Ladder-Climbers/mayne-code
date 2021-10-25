import { Button, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from "@material-ui/core";
import React from "react";
import ShareIcon from '@material-ui/icons/Share';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import { api } from '../api/api';
import { getHashedQuery, getUidUser, objectUpdate, parseTime, updateUsers } from "../utils/utils";
import store from "../data/store";
import { setMessage } from "../data/action";

function UserSearch(props) {
  const { onSelect } = props;
  const [searchKey, setSearchKey] = React.useState("");
  const [users, setUsers] = React.useState(null);
  const [requesting, setRequesting] = React.useState(false);
  if (!requesting) {
    setRequesting(true);
    api.request('user_info', "GET", { key: searchKey }).then(resp => {
      setRequesting(true);
      setUsers(resp.data.user_search);
    });
  }
  return <div>
    <List>
      {users && users.map((user, v) => <ListItem button key={user.uid} onClick={() => {
        onSelect && onSelect(user);
      }}>
        {/* <Typography variant="body1" color="primary">{user.username}</Typography> */}
        <ListItemText primary={user.username}></ListItemText>
      </ListItem>)}
    </List>
    <TextField value={searchKey} fullWidth onChange={e => setSearchKey(e.target.value)} variant="outlined"></TextField>
    <Button color="primary" fullWidth onClick={() => setRequesting(false)}>搜索</Button>
  </div>;
}

function UserFriends(props) {
  const { onSelect } = props;
  const [users, setUsers] = React.useState(null);
  const [requesting, setRequesting] = React.useState(false);
  if (!requesting) {
    setRequesting(true);
    api.request('square/relations', "GET").then(resp => {
      setRequesting(true);
      setUsers(resp.data.relations.friends);
    });
  }
  if (requesting && !users) {
    return <>加载中……</>;
  }
  return <List>
    {users && users.map((user, v) => <ListItem button onClick={() => {
      onSelect && onSelect(user);
    }}>
      <ListItemText primary={getUidUser(user.uid) && user.uid}></ListItemText>
    </ListItem>)}
  </List>;
}

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
    updated_at: 1,
    img_url: 1,
    description: 1
  };
  return <div>
    <Typography variant="h3">{info.title}</Typography>
    {Object.keys(info).map((k, v) => {
      if (k == 'title') return null;
      if (hidden_map[k]) return null;
      return <Typography key={k} varian="body1" color="textSecondary">{convert_map[k] || k}: {info[k]}</Typography>
    })}
    <img src={info.img_url}></img>
  </div>;
}

function BookDescFrame(props) {
  const { info } = props;
  const convert_map = {
    base_info: '基本信息',
    description: '描述',
    rating_nums: '评分'
  };
  const selected_map = {
    description: 1
  };
  return <div>
    {Object.keys(info).map((k, v) => {
      if (k == 'title') return null;
      if (!selected_map[k]) return null;
      return <div key={k}><Typography varian="body1" color="textSecondary">{convert_map[k] || k}: </Typography>
        <Typography varian="body1" color="textPrimary">{info[k]}</Typography></div>;
    })}
    <img src={info.img_url}></img>
  </div>;
}

function BookOperation(props) {
  const { info } = props;
  const [state, setInnerState] = React.useState({
    openShare: false,
    openAddList: false,
    openRecommend: false
  });
  const setState = (update) => setInnerState(objectUpdate(state, update));
  if (!info) return null;
  const UserList = (props) => <>
    <Typography varian="body2" color="textSecondary">搜索用户</Typography>
    <UserSearch {...props}></UserSearch>
    <Typography varian="body2" color="textSecondary">好友列表</Typography>
    <UserFriends {...props}></UserFriends>
  </>;
  return <div>
    <Grid container>
      <Grid item xs={4}>
        <IconButton onClick={() => setState({ openShare: true })}>
          <ShareIcon></ShareIcon>
        </IconButton>
        <Typography variant="body2" color="textSecondary">分享此书</Typography>
      </Grid>
      <Grid item xs={4}>
        <IconButton onClick={async () => {
          await api.request('square/book_list', "POST", {book_title: info.title, list_name: "默认书单"});
          store.dispatch(setMessage("加入书单(默认书单)成功！"));
        }}>
          <PlaylistAddIcon></PlaylistAddIcon>
        </IconButton>
        <Typography variant="body2" color="textSecondary">加入书单</Typography>
      </Grid>
      <Grid item xs={4}>
        <IconButton onClick={() => setState({ openShare: true })}>
          <ContactMailIcon></ContactMailIcon>
        </IconButton>
        <Typography variant="body2" color="textSecondary">推荐给…</Typography>
      </Grid>
    </Grid>
    <Dialog open={state.openShare} onClose={() => setState({ openShare: false })}>
      <DialogTitle>分享{info.title}给：</DialogTitle>
      <DialogContent>
        <UserList onSelect={async (user) => {
          await api.request('square/messages', "POST", {to_uid: user.uid, content: `分享书籍：${info.title}`});
          store.dispatch(setMessage("分享成功！"));
          setState({ openShare: false });
        }}></UserList>
      </DialogContent>
    </Dialog>
  </div>;
}

export function CommentItem(props) {
  const { info, comment } = props;
  // const [user, setUser] = React.useState(getUidUser(comment && comment.uid));
  const user = getUidUser(comment && comment.uid);
  const [requested, setRequested] = React.useState(false);
  // if (!comment || !info) return null;
  if (!comment) return null;
  // if (!requested && !user) {
  //   setRequested(true);
  //   api.request(`user/${comment.uid}`, "GET").then(resp => {
  //     setUser(resp.data.user);
  //     setRequested(true);
  //   });
  // }
  if (!user && !requested) {
    api.request(`user/${comment.uid}`, "GET").then(resp => {
      updateUsers(resp.data.user);
      setRequested(true);
    });
  }
  const showInfo = <span>[{(user && user.username) || comment.uid}]{info ? "" : `在[${comment.book_title}]发表了评论`}: {parseTime(comment.updated_at)}</span>;
  return <div>
    <Typography varian="body1" color="primary">{showInfo}</Typography>
    <Typography varian="body2" color="textPrimary" style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
  </div>;
}

function BookCommentsAdd(props) {
  const { info } = props;
  const [input, setInput] = React.useState("");
  if (!info) return null;
  return <>
    <TextField multiline fullWidth variant="outlined" value={input} onChange={e => {
      setInput(e.target.value);
    }}></TextField>
    <Button fullWidth color="primary" onClick={async () => {
      api.request('square/comments', "POST", { book_title: info.title, content: input }).then(resp => {
        
      });
    }}>发送书评</Button>
  </>;
}

function BookComments(props) {
  const { info, comments } = props;
  if (!info || !comments || JSON.stringify(comments) === '{}') return null;
  return <div>
    {comments.map((comment, i) => {
      return <div key={i}>
        <CommentItem {...props} comment={comment}></CommentItem>
      </div>;
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
  // console.log(query);
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
  if (!state.requestingComments) {
    setState({ requestingComments: true });
    api.request('square/comments', 'GET', { book_title: state.title }).then(resp => {
      let comments = null;
      try {
        comments = resp.data.comments;
        // console.log('got comments', comments);
      } catch (e) {
        console.error(e);
      }
      if (!comments) {
        setState({ requestingComments: true, comments: false });
      } else {
        setState({ requestingComments: true, comments: comments });
      }
    });
  }
  if (state.info === false) {
    return <Container>
      <Typography color="secondary" variant="h5">数据库扩展中……</Typography>
      <Typography color="textSecondary" variant="body2">数据库扩展中……</Typography>
    </Container>
  }
  const next_props = state;
  return <>
    <Grid container spacing={1}>
      <Grid item lg={4} sm={6} xs={12}>
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center", alignItems: "center" }}>
          <Paper style={{ width: "100%", height: "100%", maxHeight: 480, maxWidth: 360 }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", flexDirection: "column", justifyItems: "center", alignItems: "center" }}>
              <Typography variant="body2" color="textSecondary">暂无封面</Typography>
            </div>
          </Paper>
        </div>
      </Grid>
      <Grid item lg xs sm xs>
        <BookInfoFrame {...next_props}></BookInfoFrame>
        <BookDescFrame {...next_props}></BookDescFrame>
        <BookOperation {...next_props}></BookOperation>
      </Grid>
    </Grid>
    <Grid container spacing={1}>
      {state.comments && <Grid item lg={4}>
      </Grid>}
      {state.comments && <Grid item lg={8}>
        <Typography variant="h5">查看书评</Typography>
        <BookComments {...next_props}></BookComments>
        <BookCommentsAdd {...next_props}></BookCommentsAdd>
      </Grid>}
    </Grid>
  </>;
}