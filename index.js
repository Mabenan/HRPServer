var fs = require("fs");

if(process.env.TOLOG === "ON"){
  var dir = __dirname + '/log',
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  var access = fs.createWriteStream(dir + '/node.access.log', { flags: 'a' })
      , error = fs.createWriteStream(dir + '/node.error.log', { flags: 'a' });

// redirect stdout / stderr
proc.stdout.pipe(access);
proc.stderr.pipe(error);
}

var express = require("express");
var ParseServer = require("parse-server").ParseServer;
var app = express();
var config = {};
try {
  config = require("./config.json");
} catch (err) {
  console.log("no config found use default");
}

process.env.DEBUG = "*";

function startServer(err) {
  var api = new ParseServer({
    appName: process.env.appName || config.appName || "HRP",
    databaseURI:
      process.env.databaseURI ||
      config.databaseURI ||
      "mongodb://localhost:27017/hrp",
    appId: process.env.appId || config.appId || "ABCDEFG",
    masterKey: process.env.masterKey || config.masterKey || "ABCDEFG",
    serverURL:
      process.env.serverURL || config.serverURL || "http://localhost:1337/hrp",
    publicServerURL:
      process.env.publicServerURL ||
      config.publicServerURL ||
      "http://127.0.0.1:1337/hrp",
  });

  app.use(process.env.route || config.route || "/hrp", api);

  app.listen(process.env.port || config.port || "1337");
}
if (process.env.TEST === "ON") {
  var dbRunner = require("mongodb-runner");
  var ParseDashboard = require("parse-dashboard");
  var dashboard = new ParseDashboard({
    apps: [
      {
        serverURL:
          process.env.serverURL ||
          config.serverURL ||
          "http://localhost:1337/hrp",
        appId: process.env.appId || config.appId || "ABCDEFG",
        masterKey: process.env.masterKey || config.masterKey || "ABCDEFG",
        appName: process.env.appName || config.appName || "HRP",
      },
    ],
    users: [{
      user: process.env.root || config.root || "admin",
      pass: process.env.pass || config.pass || "pass"
    }],
  });
  app.use("/dashboard", dashboard);
  dbRunner.stop({}, function stopFinished() {
    dbRunner.start({ version: "4.2.13-rc1" }, startServer);
  });
} else {
  startServer();
}
