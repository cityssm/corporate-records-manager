import { app } from "../app.js";
import http from "http";
import * as configFns from "../helpers/configFns.js";
import { fork } from "child_process";
import debug from "debug";
const debugWWW = debug("corporate-records-manager:www");
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    switch (error.code) {
        case "EACCES":
            debugWWW("Requires elevated privileges");
            process.exit(1);
        case "EADDRINUSE":
            debugWWW("Port is already in use.");
            process.exit(1);
        default:
            throw error;
    }
};
const onListening = (server) => {
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port.toString();
    debugWWW("Listening on " + bind);
};
const httpPort = configFns.getProperty("application.httpPort");
if (httpPort) {
    const httpServer = http.createServer(app);
    httpServer.listen(httpPort);
    httpServer.on("error", onError);
    httpServer.on("listening", function () {
        onListening(httpServer);
    });
    debugWWW("HTTP listening on " + httpPort.toString());
}
if (configFns.getProperty("integrations.docuShare.isEnabled")) {
    fork("./tasks/docuShareLinkFinder.js");
}
