var express = require("express");
var ParseServer = require("parse-server").ParseServer;
var app = express();

function startServer(err) {
  var config;
  try {
    config = require(__dirname + "/config.json");
  } catch (error) {
    console.log("Config not found in " + __dirname + "/config.json");
  }
  var api = new ParseServer({
    appName: process.env.PARSE_APPNAME || config.PARSE_APPNAME || "HRP",
    databaseURI:
      process.env.PARSE_DATABASEURI || config.PARSE_DATABASEURI || "mongodb://localhost:27017/hrp",
    appId: process.env.PARSE_APPID || config.PARSE_APPID || "ABCDEFG",
    masterKey: process.env.PARSE_MASTERKEY || config.PARSE_MASTERKEY || "ABCDEFG",
    serverURL: process.env.PARSE_SERVERURL || config.PARSE_SERVERURL || "http://localhost:1337/hrp",
    publicServerURL:
      process.env.PARSE_PUBLICSERVERURL || config.PARSE_PUBLICSERVERURL || "http://127.0.0.1:1337/hrp",
    allowHeaders: ["X-Parse-Installation-Id"]
  });
  app.use(process.env.ROUTE || config.ROUTE || "/hrp", api);

    app.listen(process.env.PORT || config.PORT || "1337");
}
startServer();
