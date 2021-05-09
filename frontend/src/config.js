import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { orange, grey, blueGrey, deepOrange, brown } from '@material-ui/core/colors';

class Config {
  ITEM_NAME = "mayne_config";
  constructor() {
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.theme_avaliable = {
      "默认主题": createMuiTheme({
        palette: {
          primary: {
            main: brown[500],
          },
          secondary: {
            main: deepOrange[500],
          },
        },
      }),
      '黑暗模式': createMuiTheme({
        palette: {
          type: "dark",
          primary: {
            main: blueGrey[500],
          },
          secondary: {
            main: grey[500],
          },
        },
      }),
    }
    // 在构造函数执行的时候加载保存的数据
    this.data_default = {
      debug: false,
      version_frontend: 0.1,
      // 显示主题
      // theme_name: "黑暗模式",
      theme_name: "默认主题",
      theme_avaliable: [
        '默认主题',
        '黑暗模式'
      ],
      auth: "",
      // 用户信息
      user: {
        uid: '',
      },
      // 设置同步
      settings_async: true,
    };
    this.data = this.data_default;
    this.theme = this.theme_avaliable["默认主题"];
    this.load();
  }

  load() {
    console.log("Config: loading config...");
    if (this.data.debug) {
      console.log("Config: load default config.");
      this.save();
    }
    try {
      this.data = JSON.parse(localStorage.getItem(this.ITEM_NAME));
      if (!this.data) throw new Error("Null data");
      console.log("Got data:", this.data);
      if (!this.data.version_frontend || this.data.version_frontend < this.data_default.version_frontend) {
        // 版本升级，增量更新
        console.log(`Config: update ${this.data.version_frontend} -> ${this.data_default.version_frontend}`);
        this.data.version_frontend = this.data_default.version_frontend;
        for (let k in this.data_default) {
          if (!this.data[k]) {
            console.log(`    Config: add value ${k}`);
            this.data[k] = this.data_default[k];
          }
        }
        this.save();
      }
    } catch (e) {
      console.warn(`Can not find ${this.ITEM_NAME} in localStorage, use default config.`);
      this.data = this.data_default;
      this.save();
    }
    this.theme = this.theme_avaliable[this.data.theme_name];
    if (!this.theme) this.theme = this.theme_avaliable["default"];
  }

  save() {
    console.log("Config: saving config...");
    const s = JSON.stringify(this.data);
    localStorage.setItem(this.ITEM_NAME, s);
    return s;
  }
};

export default Config;