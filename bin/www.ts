import { app } from "../app.js";

import http from "http";
import https from "https";

import * as configFns from "../helpers/configFns.js";

import { fork } from "child_process";

import debug from "debug";
const debugWWW = debug("corporate-records-manager:www");


const onError = (error: Error) => {

  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      debugWWW("Requires elevated privileges");

      // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
      process.exit(1);
    // break;

    case "EADDRINUSE":
      debugWWW("Port is already in use.");
      // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
      process.exit(1);
    // break;

    default:
      throw error;
  }
};

const onListening = (server: http.Server | https.Server) => {

  const addr = server.address();

  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port.toString();

  debugWWW("Listening on " + bind);
};


/**
 * Initialize HTTP
 */


const httpPort = configFns.getProperty("application.httpPort");

if (httpPort) {

  const httpServer = http.createServer(app);

  httpServer.listen(httpPort);

  httpServer.on("error", onError);
  httpServer.on("listening", function() {
    onListening(httpServer);
  });

  debugWWW("HTTP listening on " + httpPort.toString());
}


/**
 * Initialize background task
 */

if (configFns.getProperty("integrations.docuShare.isEnabled")) {
  fork("./tasks/docuShareLinkFinder.js");
}
