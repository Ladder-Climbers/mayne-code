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
import ForumIcon from '@material-ui/icons/Forum';
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

import MuiSwitch from '@material-ui/core/Switch';
import Me from './pages/Me';

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
  // ?????? config
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

let recStarted = false;
let tbpStarted = false;

const setupRecorder = (rec, onSentenceEnd) => {
  rec.OnRecognitionStart = (res) => {
    console.log('????????????', res);
  };
  // ???????????????
  rec.OnSentenceBegin = (res) => {
    console.log('???????????????', res);
    recStarted = true;
    window.startMessage(`??????: ??????`, 10);
  };
  // ???????????????
  rec.OnRecognitionResultChange = (res) => {
    if (!recStarted) {
      return;
    }
    // console.log('???????????????', res.voice_text_str, res);
    window.updateMessage(`??????: ${res.voice_text_str}`);
  };
  // ???????????????
  rec.OnSentenceEnd = (res) => {
    if (recStarted === false) {
      console.warn("recStarted", res);
      return;
    }
    recStarted = false;
    onSentenceEnd(res);
  };
  // ????????????
  rec.OnRecognitionComplete = (res) => {
    console.log('????????????', res);
  };
  // ????????????
  rec.OnError = (res) => {
    console.log('????????????', res)
    // rec.start();
  };
}

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const titleDefault = "Mayne???????????????";
  const [errorDialogInfo, setErrorDialogInfo] = React.useState(false);
  const [myMessage, setMyMessage] = React.useState(null);
  const [title, setTitle] = React.useState(titleDefault);
  const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
  // const [recorder, setRecorder] = React.useState(null);
  const [terminalId, setTerminalId] = React.useState("");
  const [visit, setVisit] = React.useState(null);
  // ?????????800?????????????????????600??????
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

  const assistantStart = store.getState().config.data.api_token.access_token ?
    (store.getState().config.data.voice_assistant ? false : null) : null;
  window.started = assistantStart;
  const assistantEnable = assistantStart === false;
  // console.log('window.started', window.started);

  if (assistantEnable) {
    const recParams = {
      signCallback: signCallback, // ????????????
      // ????????????
      secretid: tencentConfig.secretid,
      appid: tencentConfig.appid,
      // ????????????????????????
      engine_model_type: '16k_zh', // ????????????WebRecorder??????16k???????????????????????? engineModelType ????????????16k??????????????? '16k_zh'
      // ??????????????????????????????????????????????????????
      voice_format: 1,
      hotword_id: '08003a00000000000000000000000000',
      needvad: 1,
      filter_dirty: 1,
      filter_modal: 2,
      filter_punc: 0,
      convert_num_mode: 1,
      word_info: 2
    }

    // const globalRec = window.rec;

    if (!window.rec) {
      const rec = new WebAudioSpeechRecognizer(recParams);
      window.rec = rec;
      const onSentenseEnd = (res) => {
        const text = res.voice_text_str;
        console.log('???????????????', res.voice_text_str, res);
        window.hideMessage();
        if (text.length === 0) {
          window.startMessage(`???????????????????????????`, 10);
          return;
        }
        if (tbpStarted) return;
        tbpStarted = true;
        // rec.speechRecognizer.stop();
        // rec.stop();
        // delete window.rec;
        // window.rec = null;
        if (!window.blocked) {
          window.blocked = true;
          const tid = localStorage.getItem("mayne_tbp_terminal") || terminalId;
          api.request('ai/tbp', "POST", { terminal_id: tid, text: text }).then(resp => {
            const t = resp.data.tbp;
            if ((t && !t.ResponseMessage.GroupList) || !t) {
              window.startMessage(`???????????????????????????`, 10);
            } else {
              let textAll = '';
              for (const r of t.ResponseMessage.GroupList)
                textAll += r.Content;
              api.request('ai/tts', "GET", { text: textAll }).then(resp2 => {
                tbpStarted = false;
                window.startMessage(`??????: ${text}\n\n${textAll}`, 10);
                if (!resp2.data.tts) {
                  return;
                }
                const tts = resp2.data.tts;
                console.log(tts);
                const audio = new Audio();
                audio.autoplay = "autoplay";
                audio.src = "data:audio/wav;base64," + tts.Audio;
                // rec.recorder.stop();
                // rec.speechRecognizer.stop();
                audio.oncanplaythrough = async () => {
                  audio.play();
                  // Length = (Size - 44) * 8 / (Rate * 1000 * Precision * Channerls)
                  // len(s) = (size - 44) * 8 / (16 * 1000 * 32 * 2)
                  const time_ms = ((window.atob(tts.Audio).length) * 4 - 44) * 8 / (16 * 1000 * 32 * 2) * 1000 + 1000;
                  console.log('sleep for', time_ms, 'ms');
                  await sleep(time_ms);
                  window.blocked = false;
                  // rec.recorder.start();
                  // rec.speechRecognizer.start();
                  // if (!window.rec) {
                  //   const rec2 = new WebAudioSpeechRecognizer(recParams);
                  //   window.rec = rec2;
                  //   setupRecorder(rec2, onSentenseEnd);
                  //   rec2.start();
                  // }
                  // setRecorder(rec2);

                  // rec.start();
                };
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
        }

      };
      setupRecorder(rec, onSentenseEnd);
      // setRecorder(rec);
      api.request('ai/tbp', "GET").then(resp => {
        console.log('GET ai/tbp', resp);
        // setRecorder(rec);
        setTerminalId(resp.data.terminal_id);
        localStorage.setItem("mayne_tbp_terminal", resp.data.terminal_id);
        rec.start();
      });
    }
  }

  // ?????????????????????????????????????????????????????????????????????????????????
  subscribers['Error'] = function (state) {
    if (state.errorInfo) {
      console.log('Error Hook: ', state.errorInfo);
      setErrorDialogInfo(state.errorInfo);
      // ??????????????????
      store.dispatch(setErrorInfo(null));
    }
  };
  // ????????????????????????
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
        console.log('Got user', state.user);
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
        {/* <IconButton
          color="inherit"
          aria-label="login"
          onClick={() => { }}
        >
          <AccountCircleIcon />
        </IconButton> */}
        <Typography variant="body2">????????????</Typography>
        <MuiSwitch
          checked={store.getState().config.data.voice_assistant}
          onChange={e => {
            let c = store.getState().config;
            console.log(e);
            c.data.voice_assistant = e.target.checked;
            c.save();
            window.location.reload();
          }}></MuiSwitch>
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
        <ListItemLink to="/" primary="?????????" icon={<DashboardIcon />} />
        <ListItemLink to="/search" primary="??????" icon={<SearchIcon />} />
        <ListItemLink to="/library" primary="??????" icon={<LibraryBooksIcon />} />
        <ListItemLink to="/square" primary="??????" icon={<DynamicFeedIcon />} />
        <ListItemLink to="/me" primary="??????" icon={<ForumIcon />} />
        <ListItemLink to="/settings" primary="??????" icon={<SettingsIcon />} />
        <ListItemLink to="/help" primary="??????" icon={<LiveHelpIcon />} />
        <ListItemLink to="/about" primary="??????" icon={<GroupIcon />} />
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
        <Route path={"/me"} exact={true}>
          <Me></Me>
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
      routerContent = <Typography variant="body1">????????????...</Typography>
    } else {
      routerContent = <Login></Login>
    }
  }

  return (
    <div className={classes.root}>
      <ThemeProvider theme={store.getState().config.theme}>
        {routerContent}
        <Dialog open={errorDialogInfo ? true : false} onClose={() => { setErrorDialogInfo(null); }}>
          <DialogTitle>????????????</DialogTitle>
          <DialogContent>
            <Typography variant="body1">????????????</Typography>
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
            <Button color="primary" onClick={() => { window.location.reload() }}>??????</Button>
            <Button color="primary" onClick={() => { setErrorDialogInfo(null); }}>??????</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          onClose={() => setMyMessage(null)}
          open={myMessage !== null}
          autoHideDuration={4000}
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
          const resp = await api.request('ai/tbp', "POST", { terminal_id: terminalId, text: "??????????????????" });
          console.log(resp);
        }}>??????</button> */}
      </ThemeProvider>
      {/* <audio></audio> */}
    </div>);
}

export default App;
