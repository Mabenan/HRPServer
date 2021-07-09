"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseServer = require("parse-server");
const express = require("express");
const fs = require("fs");
const https = require("https");
const http = require("http");
var app = express();
class ServerConfig {
}
function startServer() {
    var config = new ServerConfig();
    try {
        if (fs.existsSync(__dirname + "/config.json")) {
            config = require(__dirname + "/config.json");
        }
    }
    catch (error) {
        console.log("Config not found in " + __dirname + "/config.json");
    }
    var api = new ParseServer.ParseServer({
        appName: process.env.PARSE_APPNAME || config.PARSE_APPNAME || "HRP",
        databaseURI: process.env.PARSE_DATABASEURI ||
            config.PARSE_DATABASEURI ||
            "mongodb://mongo:27017/hrpdev",
        appId: process.env.PARSE_APPID || config.PARSE_APPID || "ABCDEFG",
        masterKey: process.env.PARSE_MASTERKEY || config.PARSE_MASTERKEY || "ABCDEFG",
        serverURL: process.env.PARSE_SERVERURL ||
            config.PARSE_SERVERURL ||
            "http://localhost:13371",
        publicServerURL: process.env.PARSE_PUBLICSERVERURL ||
            config.PARSE_PUBLICSERVERURL ||
            "http://127.0.0.1:1337/",
        allowHeaders: ["X-Parse-Installation-Id", "X-Parse-Application-Id"],
        cloud: __dirname + "/cloud/main",
        allowClientClassCreation: false,
    });
    app.use(process.env.ROUTE || config.ROUTE || "/", api);
    try {
        var privateKey = fs.readFileSync(__dirname + "/sslcert/server.key", "utf8");
        var certificate = fs.readFileSync(__dirname + "/sslcert/server.crt", "utf8");
        var credentials = { key: privateKey, cert: certificate };
        var httpsServer = https.createServer(credentials, app);
        httpsServer.listen(process.env.PORT || config.PORT || "1337");
        ParseServer.ParseServer.createLiveQueryServer(httpsServer);
        console.log("https started");
    }
    catch (error) { }
    var httpServer = http.createServer(function (req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        app(req, res);
    });
    httpServer.listen(process.env.LOCALPORT || config.LOCALPORT || "13371");
    ParseServer.ParseServer.createLiveQueryServer(httpServer);
}
startServer();
//# sourceMappingURL=index.js.map