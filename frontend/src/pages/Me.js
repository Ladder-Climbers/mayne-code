import React from "react";
import store from "../data/store";
import { Container, Typography, List, ListItem, Dialog, DialogTitle, DialogContent, TextField, Button, LinearProgress, Divider } from "@material-ui/core";
import { getUidUser, parseHashedQuery, updateUsers } from "../utils/utils";
import { api } from "../api/api";
import { setMessage } from "../data/action";

function UserBaseInfo(props) {
  const { user } = props;
  if (!user) return null;
  return <div>
    <Typography variant="h4">{user.nick || user.username}</Typography>
    <Typography variant="body2">用户名: {user.username}</Typography>
  </div>;
}

function SendMessage(props) {
  const { to, onClose } = props;
  const user = getUidUser(to);
  const [content, setContent] = React.useState("");
  const [requested, setRequested] = React.useState(false);
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  if (!to) return null;
  if (!user && !requested) {
    setRequested(true);
    api.request(`user/${to}`, "GET").then(resp => {
      updateUsers(resp.data.user);
      forceUpdate();
    });
  }
  return <Dialog open={!!to} onClose={onClose}>
    <DialogTitle>向 {(user && user.username) || to} 发送私信</DialogTitle>
    <DialogContent>
      <UserBaseInfo user={user}></UserBaseInfo>
      <TextField multiline fullWidth value={content} onChange={e => setContent(e.target.value)}></TextField>
      <br /><br />
      <Button fullWidth variant="contained" color="primary" onClick={async () => {
        await api.request('square/messages', "POST", { to_uid: to, content });
        store.dispatch(setMessage("发送成功！"));
        onClose && onClose();
      }}>发送</Button>
    </DialogContent>
  </Dialog>;
}

function MyBookLists(props) {
  const [requested, setRequested] = React.useState(false);
  const [bookLists, setBookLists] = React.useState(null);
  if (!requested) {
    setRequested(true);
    api.request('square/book_list', "GET").then(resp => {
      setBookLists(resp.data.book_lists);
    });
  }
  if (!bookLists) return <LinearProgress></LinearProgress>;
  return <List>
    {bookLists.map((bookList, v) => <ListItem button>
      <Typography variant="body1">{bookList.list_name}: </Typography>
      <Typography variant="body2">{bookList.book_title}</Typography>
    </ListItem>)}
  </List>;
}

export default function Me(props) {
  const user = store.getState().user;
  const [receivedMessages, setReceivedMessages] = React.useState(null);
  const [sentMessages, setSentMessages] = React.useState(null);
  const [requestedMyMessages, setRequestedMyMessages] = React.useState(false);
  const query = parseHashedQuery();
  // console.log('query', query);
  const [toUid, setToUid] = React.useState(query.message_to);
  if (!requestedMyMessages) {
    setRequestedMyMessages(true);
    api.request('square/messages', "GET").then(resp => {
      setReceivedMessages(resp.data.messages.received);
      setSentMessages(resp.data.messages.sent);
    });
  }
  const messagesList = receivedMessages && sentMessages && <List>
    <ListItem>
      <Typography variant="body2" color="textSecondary">发送的消息:</Typography>
    </ListItem>
    <Divider />
    {sentMessages.map((message, v) => <ListItem button key={message.created_at}>
      <Typography variant="h5">{(getUidUser(message.to_uid) && getUidUser(message.to_uid).username) || message.to_uid}: </Typography>
      <Typography variant="body1">{message.content}</Typography>
    </ListItem>)}
    <ListItem>
      <Typography variant="body2" color="textSecondary">接收到的消息:</Typography>
    </ListItem>
    <Divider />
    {receivedMessages.map((message, v) => <ListItem button key={message.created_at}>
      <Typography variant="h5">{(getUidUser(message.uid) && getUidUser(message.uid).username) || message.uid}: </Typography>
      <Typography variant="body1">{message.content}</Typography>
    </ListItem>)}
  </List>;
  return <>
    {requestedMyMessages && !sentMessages ? <LinearProgress></LinearProgress> : null}
    <List>
      <ListItem>
        <UserBaseInfo user={user}></UserBaseInfo>
      </ListItem>
      <ListItem>
        <Typography variant="body2" color="textSecondary">我的书单</Typography>
      </ListItem>
      <Divider></Divider>
    </List>
    <MyBookLists></MyBookLists>
    {messagesList}
    <SendMessage to={toUid} onClose={() => {
      setRequestedMyMessages(false);
      setToUid(null);
    }}></SendMessage>
  </>;
}