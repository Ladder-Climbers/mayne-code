import React from "react"
import Container from '@material-ui/core/Container';
import { Button, MenuItem, FormControl, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, Select, ListSubheader, Switch, Dialog, DialogTitle, DialogContent, Typography, DialogActions } from "@material-ui/core";
import store from "../data/store";
import { setConfig, setErrorInfo, setMessage } from "../data/action";
import { funDownload } from "../utils/utils";
import ListInfo from "../components/ListInfo";

function Settings(props) {
  const [themeName, setThemeName] = React.useState(store.getState().config.data.theme_name);
  const refConfigFileInput = React.useRef();
  const [resetSettingsOpen, setResetSettingsOpen] = React.useState(false);
  const [deleteDataOpen, setDeleteDataOpen] = React.useState(false);
  const [openDaemon, setOpenDaemon] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);

  const resetSettings = function () {
    let c = store.getState().config;
    c.data = c.data_default;
    c.save();
    c.load();
    store.dispatch(setConfig(c));
  }

  const user = store.getState().user;

  return (<Container maxWidth="md">
    <List>
      <ListSubheader>用户账号</ListSubheader>
      <ListItem>
        <ListItemText primary="用户名"></ListItemText>
        <ListItemSecondaryAction>
          {user.username}
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button onClick={() => { setOpenUser(true); }}>
        <ListItemText primary="详细信息"></ListItemText>
      </ListItem>
      <ListItem button>
        <ListItemText primary="修改信息"></ListItemText>
      </ListItem>
      <ListSubheader>外观</ListSubheader>
      <ListItem>
        <ListItemText primary="主题设置"></ListItemText>
        <ListItemSecondaryAction>
          <FormControl>
            {/* <InputLabel></InputLabel> */}
            <Select value={themeName} onChange={e => {
              setThemeName(e.target.value);
              let c = store.getState().config;
              c.data.theme_name = e.target.value;
              c.theme = c.theme_avaliable[c.data.theme_name];
              c.save();
              store.dispatch(setConfig(c));
              setTimeout(() => { window.location.reload(); }, 200);
            }}>
              {store.getState().config.data.theme_avaliable.map((v, k) => <MenuItem key={k} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText primary="设置数据同步"></ListItemText>
        <ListItemSecondaryAction>
          <Switch defaultChecked={store.getState().config.data.settings_async} onChange={e => {
            let c = store.getState().config;
            c.data.settings_async = e.target.checked;
            c.save();
            store.dispatch(setConfig(c));
          }}></Switch>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button onClick={() => setResetSettingsOpen(true)}>
        <ListItemText primary="回到默认设置"></ListItemText>
      </ListItem>
      <ListItem button onClick={() => setDeleteDataOpen(true)}>
        <ListItemText primary="删除所有数据"></ListItemText>
      </ListItem>
    </List>
    <ListInfo data={store.getState().user} open={openUser} keyNames={{
      username: '用户名', nick: '昵称', phone: '用户手机号', profile: '详细信息', state: '用户状态', created_at: '创建于', updated_at: '更新于'
    }} title="用户信息" onClose={() => { setOpenUser(false); }}></ListInfo>
    <Dialog open={resetSettingsOpen} onClose={() => setResetSettingsOpen(false)}>
      <DialogTitle>
        回到默认设置
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">此操作将会清除所有设置数据，确认操作？</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setResetSettingsOpen(false)}>取消</Button>
        <Button onClick={() => {
          resetSettings();
          window.location.reload();
        }}>确定</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={deleteDataOpen} onClose={() => setDeleteDataOpen(false)}>
      <DialogTitle>
        删除所有数据
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">此操作将会清除软件数据，确认操作？</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteDataOpen(false)}>取消</Button>
        <Button onClick={() => {
          resetSettings();
          window.location.reload();
        }}>确定</Button>
      </DialogActions>
    </Dialog>
  </Container>)
}

export default Settings;