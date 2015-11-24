var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/commit"] = requestHandlers.commit;
handle["/ans"] = requestHandlers.ans;
handle["/result"] = requestHandlers.result;


server.start(router.route, handle);