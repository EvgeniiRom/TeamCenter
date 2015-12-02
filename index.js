var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["css"] = requestHandlers.css;
handle["js"] = requestHandlers.js;
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
handle["/checkPass"] = requestHandlers.checkPass;
handle["/signUp"] = requestHandlers.signUp;
handle["/exit"] = requestHandlers.exit;


server.start(router.route, handle);