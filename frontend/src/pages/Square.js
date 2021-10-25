import React from 'react';
import { TextField, Button, Container, Dialog, DialogContent, DialogTitle, LinearProgress, List, ListItem, Typography } from "@material-ui/core";
import { api } from '../api/api';
import { CommentItem } from "./BookInfo";
import store from "../data/store";
import { getUidUser, updateUsers } from "../utils/utils";
import { setMessage } from '../data/action';
import { Redirect } from 'react-router-dom';

function SendDynamic(props) {
  const { onRefresh } = props;
  const [content, setContent] = React.useState("");
  return <div>
    <TextField multiline style={{ width: "100%" }} value={content} onChange={e => setContent(e.target.value)}></TextField>
    <Button variant="contained" onClick={async () => {
      await api.request('square/dynamic', "POST", { dynamic: content });
      onRefresh && onRefresh();
    }}>发送新动态</Button>
  </div>;
}

function ItemOperation(props) {
  const { item, onClose } = props;
  const [requested, setRequested] = React.useState(false);
  const [visit, setVisit] = React.useState(null);
  const self = store.getState().user;
  if (!item) return null;

  const user = getUidUser(item.uid);
  if (!user && !requested) {
    setRequested(true);
    api.request(`user/${item.uid}`, "GET").then(resp => {
      updateUsers(resp.data.user);
      setRequested(true);
    });
    return null;
  }

  if (visit) return <Redirect to={visit}></Redirect>;

  const listItems = <List>
    <ListItem button onClick={() => {
      setVisit(`/book_info?title=${item.book_title}`);
      // onClose && onClose();
    }}>
      访问详情页
    </ListItem>
    <ListItem button onClick={() => {
      store.dispatch(setMessage("点赞爆棚！感谢推荐（"));
      onClose && onClose();
    }}>
      点赞
    </ListItem>
    <ListItem button disabled={self.uid === item.uid} onClick={async () => {
      await api.request('square/relations', "POST", {
        to_uid: item.uid,
        is_friends: true
      });
      store.dispatch(setMessage("成功"));
      onClose && onClose();
    }}>
      加为好友
    </ListItem>
    <ListItem button onClick={() => {
      store.dispatch(setMessage("推荐好了（才怪"));
      onClose && onClose();
    }}>
      向他推荐书
    </ListItem>
    <ListItem button onClick={() => {
      setVisit(`/me?message_to=${item.uid}`);
    }}>
      私信
    </ListItem>
  </List>;
  if (item.action === "comments") {
    return <Dialog onClose={onClose} open={!!item}>
      <DialogTitle>{(user && (user.nick || user.username)) || item.uid} 在 {item.book_title} 发布的的评论</DialogTitle>
      <DialogContent>
        <Typography>{item.content}</Typography>
        {listItems}
      </DialogContent>
    </Dialog>;
  }
  return null;
}

export default function Square(props) {
  const { child } = props;
  const [square, setSquare] = React.useState(null);
  const [requesting, setRequesting] = React.useState(false);
  const [itemNow, setItemNow] = React.useState(null);

  const ignoreActions = {
    messages: 1,
    relations: 1,
    book_list: 1
  };
  if (!requesting) {
    setRequesting(true);
    api.request('square', "GET").then(resp => {
      if (!resp.data.all) return;
      setSquare(resp.data.all);
    });
    return <LinearProgress color="primary"></LinearProgress>;
  }
  return (<Container>
    {!child && <Typography variant="h4">
      交流广场
    </Typography>}
    <List>
      {square && square.map((item, v) => {
        if (ignoreActions[item.action]) return null;
        return <ListItem button key={item.created_at} onClick={() => setItemNow(item)}>{
          (() => {
            if (!item.action) return null;
            if (item.action === 'comments') {
              return <CommentItem comment={item}></CommentItem>;
            }
            return null;
          })()
        }</ListItem>;
      })}
    </List>
    {!child && <SendDynamic></SendDynamic>}
    <ItemOperation item={itemNow} onRefresh={() => { setRequesting(false); }} onClose={() => setItemNow(null)}></ItemOperation>
  </Container>);
};