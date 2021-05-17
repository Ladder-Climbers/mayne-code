let doub = require("./douban");
console.log('doub', doub);

// let res = doub.decrypt("a");
// console.log('res', res);

(async () => {
  let res = await doub.search("三体");
  console.log('res', res);
})();