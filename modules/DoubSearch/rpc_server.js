const jayson = require('jayson');
let doub = require("./douban");

// 创建 RPC Server
const server = new jayson.server({
  search: async (args, callback) => {
    const result = await doub.search(args[0], args[1]);
    // console.log('result', result);
    callback(null, result);
  }
});

const port = 9092;
console.log(`[rpc_server     ][main           ][INFO   ] Starting RPC server on ${port}`);
server.http().listen(port);