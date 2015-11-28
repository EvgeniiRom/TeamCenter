var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.login;
handle["css"] = requestHandlers.css;
handle["png"] = requestHandlers.png;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/commit"] = requestHandlers.commit;
handle["/ans"] = requestHandlers.ans;
handle["/result"] = requestHandlers.result;
handle["/addQuestion"] = requestHandlers.addQuestion;
handle["/delQuestion"] = requestHandlers.delQuestion;
handle["/uploadQuestions"] = requestHandlers.uploadQuestions;
handle["/login"] = requestHandlers.login;


server.start(router.route, handle);