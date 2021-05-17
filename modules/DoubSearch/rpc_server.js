const jayson = require('jayson');
let doub = require("./douban");

// 创建 RPC Server
const server = new jayson.server({
  search: (args, callback) => {
    try {
      doub.search(args[0], args[1]).then(result => callback(null, result));
    } catch (e) {
      console.log(`[rpc_server     ][douban         ][ERROR  ] ${e}`)
      callback(null, null);
    }
  }
});

const port = 9092;
console.log(`[rpc_server     ][douban         ][INFO   ] Starting RPC server on ${port}`);
server.http().listen(port);