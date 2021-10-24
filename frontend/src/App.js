import React from 'react';
import "@fontsource/roboto";
import clsx from 'clsx';
import Container from '@material-ui/core/Container';
import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SearchIcon from '@material-ui/icons/Search';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import GroupIcon from '@material-ui/icons/Group';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AlarmIcon from '@material-ui/icons/Alarm';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import StorageIcon from '@material-ui/icons/Storage';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import PhonelinkIcon from '@material-ui/icons/Phonelink';
import {
  HashRouter as Router,
  // BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Provider } from 'react-redux'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/zh-cn';
import store from './data/store';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, Snackbar } from '@material-ui/core';
import { setConfig, setErrorInfo, setMessage, setReserveTableData, setRoomStockData, setShopInfo } from "./data/action";

import { isIterator, isMobileDevice, sleep } from "./utils/utils";

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Library from "./pages/Library";
import BookInfo from "./pages/BookInfo";
import Square from "./pages/Square";
import About from './pages/About';
import Help from './pages/Help';
import Settings from "./pages/Settings";
import { api } from './api/api';
import ListItemLink from './components/ListItemLink';
import Search from './pages/Search';
// import record_tools from './utils/record_tools';
import tencentConfig from "./secrets/tencent_cloud.json";
import { signCallback } from "./utils/asr/Authentication";
import { Redirect } from 'react-router-dom';

import WebAudioSpeechRecognizer from './utils/asr/WebAudioSpeechRecognizer';
// import L2d from './components/L2d';
import './css/waifu.css';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    // overflowX: 'auto',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
  },
}));

let subscribers = {};

let last_data = {
  config: null,
  user: null,
  daemon: null
};

store.subscribe(async () => {
  let state = store.getState();
  // console.log('redux update to', state);
  // 保存 config
  if (state.config.data) {
    if (JSON.stringify(state.config.data) != JSON.stringify(last_data.config)) {
      console.log('Config will change:', state.config.data);
      state.config.save();
      if (store.getState().user && store.getState().config.data.settings_async) {
        await api.request('sync', 'POST', { config: state.config.data });
      }
    } else {
      // console.log('Not change:', state.config.data);
    }
    last_data.config = state.config.data;
  }
  for (let subFunc in subscribers) {
    subscribers[subFunc](state);
  }
});

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const titleDefault = "Mayne的大图书馆";
  const [errorDialogInfo, setErrorDialogInfo] = React.useState(false);
  const [myMessage, setMyMessage] = React.useState(null);
  const [title, setTitle] = React.useState(titleDefault);
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [recorder, setRecorder] = React.useState(null);
  const [terminalId, setTerminalId] = React.useState("");
  const [visit, setVisit] = React.useState(null);
  // 拉大到800会打开，拉小到600关闭
  const triggerWidthOpen = 800;
  const triggerWidthClose = 600;
  // onMount & onUpdate
  React.useEffect(() => {
    const onWindowResize = () => {
      let width = window.innerWidth;
      // console.log(width);
      if (!open && width >= triggerWidthOpen) setOpen(true);
      if (open && width <= triggerWidthClose) setOpen(false);
    };
    window.addEventListener("load", onWindowResize);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener("load", onWindowResize);
      window.removeEventListener("resize", onWindowResize);
    };
  });

  const recParams = {
    signCallback: signCallback, // 鉴权函数
    // 用户参数
    secretid: tencentConfig.secretid,
    appid: tencentConfig.appid,
    // 实时识别接口参数
    engine_model_type: '16k_zh', // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
    // 以下为非必填参数，可跟据业务自行修改
    voice_format: 1,
    hotword_id: '08003a00000000000000000000000000',
    needvad: 1,
    filter_dirty: 1,
    filter_modal: 2,
    filter_punc: 0,
    convert_num_mode: 1,
    word_info: 2
  }

  if (recorder === null) {
    const rec = new WebAudioSpeechRecognizer(recParams);
    rec.OnRecognitionStart = (res) => {
      console.log('开始识别', res);
    };
    // 一句话开始
    rec.OnSentenceBegin = (res) => {
      console.log('一句话开始', res);
      window.startMessage(`你说: ……`, 10);
    };
    // 识别变化时
    rec.OnRecognitionResultChange = (res) => {
      // console.log('识别变化时', res.voice_text_str, res);
      window.updateMessage(`你说: ${res.voice_text_str}`);
    };
    // 一句话结束
    rec.OnSentenceEnd = (res) => {
      const text = res.voice_text_str;
      console.log('一句话结束', res.voice_text_str, res);
      window.hideMessage();
      if (text.length === 0) {
        window.startMessage(`能……再说一遍嘛？`, 10);
        return;
      }
      const tid = localStorage.getItem("mayne_tbp_terminal") || terminalId;
      api.request('ai/tbp', "POST", { terminal_id: tid, text: text }).then(resp => {
        const t = resp.data.tbp;
        if ((t && !t.ResponseMessage.GroupList) || !t) {
          window.startMessage(`能……再说一遍嘛？`, 10);
        } else {
          let textAll = '';
          for (const r of t.ResponseMessage.GroupList)
            textAll += r.Content;
          window.startMessage(`你说: ${text}\n\n${textAll}`, 10);
          api.request('ai/tts', "GET", { text: textAll }).then(resp2 => {
            if (!resp2.data.tts) return;
            const tts = resp2.data.tts;
            console.log(tts);
            const audio = new Audio();
            audio.src = "data:audio/wav;base64," + tts.Audio;
            audio.play();
          });
          if (t.DialogStatus === "COMPLETE") {
            let target = null;
            for (const slot of t.SlotInfoList) {
              if (slot.SlotName === "BookTitle") {
                // setVisit(`/search?key=${slot.SlotValue}&src=smart_search`);
                target = slot.SlotValue;
                break;
                // window.location.href = `/#/search?key=${slot.SlotValue}&src=local_database`;

              }
            }
            if (target) {
              setTimeout(() => {
                window.location.href = `/#/search?key=${target}&src=local_database`;
              }, 2000);
            }
          }
        }
      });
      // window.showMessage(`你说: ${res.voice_text_str}\n\n嗯……你再说一遍？`, 4000, 30);
    };
    // 识别结束
    rec.OnRecognitionComplete = (res) => {
      console.log('识别结束', res);
    };
    // 识别错误
    rec.OnError = (res) => {
      console.log('识别失败', res)
    };
    setRecorder(rec);
    api.request('ai/tbp', "GET").then(resp => {
      console.log('GET ai/tbp', resp);
      setRecorder(rec);
      setTerminalId(resp.data.terminal_id);
      localStorage.setItem("mayne_tbp_terminal", resp.data.terminal_id);
      rec.start();
    });
  }

  // 注册一个当遇到错误的时候调用的钩子吧，用来显示错误信息
  subscribers['Error'] = function (state) {
    if (state.errorInfo) {
      console.log('Error Hook: ', state.errorInfo);
      setErrorDialogInfo(state.errorInfo);
      // 清空错误信息
      store.dispatch(setErrorInfo(null));
    }
  };
  // 注册一个消息钩子
  subscribers['Message'] = function (state) {
    if (state.message) {
      console.log('message: ', state.message);
      setMyMessage(state.message);
      store.dispatch(setMessage(null));
    }
  };
  subscribers['User'] = function (state) {
    if (state.user) {
      if (JSON.stringify(state.user) != JSON.stringify(last_data.user)) {
        forceUpdate();
      }
      last_data.user = state.user;
    }
  };
  subscribers['Daemon'] = function (state) {
    if (state.daemon) {
      if (JSON.stringify(state.daemon) != JSON.stringify(last_data.daemon)) {
        forceUpdate();
      }
      last_data.daemon = state.daemon;
    }
  };

  let routerContent = <Router>
    <CssBaseline />
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => { setOpen(true); }}
          edge="start"
          className={clsx(classes.menuButton, {
            [classes.hide]: open,
          })}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap className={classes.title}>
          {title}
        </Typography>
        <IconButton
          color="inherit"
          aria-label="login"
          onClick={() => { }}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={() => { setOpen(false); }}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      <Divider />
      <List onClick={() => {
        if (window.innerWidth < 600) {
          setOpen(false);
        }
      }}>
        <ListItemLink to="/" primary="启动页" icon={<DashboardIcon />} />
        <ListItemLink to="/search" primary="找书" icon={<SearchIcon />} />
        <ListItemLink to="/library" primary="馆藏" icon={<LibraryBooksIcon />} />
        <ListItemLink to="/square" primary="广场" icon={<DynamicFeedIcon />} />
        <ListItemLink to="/settings" primary="设置" icon={<SettingsIcon />} />
        <ListItemLink to="/help" primary="帮助" icon={<LiveHelpIcon />} />
        <ListItemLink to="/about" primary="关于" icon={<GroupIcon />} />
      </List>
    </Drawer>
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path={"/"} exact={true}>
          <Dashboard></Dashboard>
        </Route>
        <Route path={"/library"} exact={true}>
          <Library></Library>
        </Route>
        <Route path={"/search"} exact={true}>
          <Search></Search>
        </Route>
        <Route path={"/settings"} exact={false}>
          <Settings />
        </Route>
        <Route path={"/square"} exact={true}>
          <Square></Square>
        </Route>
        <Route path={"/help"} exact={true}>
          <Help></Help>
        </Route>
        <Route path={"/about"} exact={true}>
          <About></About>
        </Route>
        <Route path={"/book_info"} exact={true}>
          <BookInfo></BookInfo>
        </Route>
      </Switch>
    </main>
  </Router>;

  if (!store.getState().user) {
    if (store.getState().config.data.api_token.access_token) {
      routerContent = <Typography variant="body1">正在登录...</Typography>
    } else {
      routerContent = <Login></Login>
    }
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={store.getState().config.theme}>
        {routerContent}
        <Dialog open={errorDialogInfo ? true : false} onClose={() => { setErrorDialogInfo(null); }}>
          <DialogTitle>遇到错误</DialogTitle>
          <DialogContent>
            <Typography variant="body1">错误信息</Typography>
            <Box component="div">
              <Box component="div">
                {() => {
                  if (isIterator(errorDialogInfo) && typeof (errorDialogInfo) !== 'string') {
                    return <List>
                      {errorDialogInfo.map((d, i) => <ListItem key={i}>
                        <code>{JSON.stringify(d) === '{}' ? d.toString() : JSON.stringify(d)}</code>
                      </ListItem>)}
                    </List>;
                  } else {
                    return <code>{JSON.stringify(errorDialogInfo) === '{}' ? errorDialogInfo.toString() : JSON.stringify(errorDialogInfo)}</code>;
                  }
                }}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => { window.location.reload() }}>刷新</Button>
            <Button color="primary" onClick={() => { setErrorDialogInfo(null); }}>取消</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={myMessage !== null}
          autoHideDuration={6000}
          message={myMessage}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => setMyMessage(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        {/* <button onClick={async () => {
          console.log("terminal_id", terminalId);
          const resp = await api.request('ai/tbp', "POST", { terminal_id: terminalId, text: "帮我找一本书" });
          console.log(resp);
        }}>测试</button> */}
      </ThemeProvider>
      {/* <audio></audio> */}
    </div>);
}

export default App;
