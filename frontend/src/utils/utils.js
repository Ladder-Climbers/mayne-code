import moment from 'moment';
import 'moment/locale/zh-cn'

export function isMobileDevice() {
  const sUserAgent = navigator.userAgent;
  return (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1);
}

/** 
* param 将要转为URL参数字符串的对象 
* key URL参数字符串的前缀 
* encode true/false 是否进行URL编码,默认为true 
*  
* return URL参数字符串 
*/
export function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

export function urlEncode2(obj) {
  try {
    return JSON.stringify(obj).replace(/:/g, "=").replace(/"/g, '').replace(/,/g, '&').match(/\{([^)]*)\}/)[1];
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function parseTimePoint(time) {
  return moment(time).format('LLLL');
}

export function parseTimePeriod(time) {
  return moment.duration(time).humanize();
}

export function getTextFieldValue(el) {
  return el.current.childNodes[el.current.childElementCount - 1].childNodes[0].value;
}

export function sleep(time_ms) {
  return new Promise(accept => {
    setTimeout(accept, time_ms);
  });
}

// 设置到本周的星期几
Date.prototype.setDay = function (day) {
  let day_ = this.getDay();
  if (day_ === day) return this;
  this.setTime(this.getTime() + 1000 * 60 * 60 * 24 * (day - day_));
  return this;
};

// 获取 YYYY-MM-DD 格式
Date.prototype.toDateString = function () {
  return this.toISOString().slice(0, 10);
};

// export function cutString(str, length=10)

export function isIterator(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

// 下载文件方法
export function funDownload(content, filename) {
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};


export function deepCopy(data) {
  if (isIterator(data) && typeof(data) !== "string") {
    let d = [];
    for (let i = 0; i < data.length; i++) {
      d.push(data[i]);
    }
    return d;
  } else if (typeof (data) === "object") {
    let d = {};
    for (const k in data) {
      d[k] = deepCopy(data[k]);
    }
    return d;
  } else {
    return data;
  }
}

export function objectUpdate(origin, update) {
  let now = deepCopy(origin);
  for (const k in update) {
    now[k] = update[k];
  }
  return now; 
}