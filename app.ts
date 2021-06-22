import createError from "http-errors";
import express from "express";

import { abuseCheck } from "@cityssm/express-abuse-points";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";

import session from "express-session";
import sqlite from "connect-sqlite3";

import * as configFns from "./helpers/configFns.js";
import * as stringFns from "@cityssm/expressjs-server-js/stringFns.js";
import * as dateTimeFns from "@cityssm/expressjs-server-js/dateTimeFns.js";
import * as docuShareFns from "./helpers/docuShareFns.js";

import * as permissionHandlers from "./handlers/permissions.js";
import routerLogin from "./routes/login.js";
import routerDashboard from "./routes/dashboard.js";
import routerNew from "./routes/new.js";
import routerView from "./routes/view.js";
import routerEdit from "./routes/edit.js";
import routerReports from "./routes/reports.js";
import routerAdmin from "./routes/admin.js";

import { getRecordTypes } from "./helpers/recordsDB/configCache.js";

import { generatePassword } from "@cityssm/simple-password-generator";
import type { User } from "./types/recordTypes";

import debug from "debug";
const debugApp = debug("corporate-records-manager:app");


export const tempAdmin: User = {
  userName: "~tempAdmin",
  canUpdate: false,
  isAdmin: true,
  password: generatePassword({
    pattern: "xxxxxXXXXXnnnnn",
    doShufflePattern: true
  })
};

if (configFns.getProperty("application.enableTempAdminUser")) {
  debugApp("WARNING: ~tempAdmin currently enabled.");
}


/*
 * INITIALIZE APP
 */


export const app = express();

if (!configFns.getProperty("reverseProxy.disableEtag")) {
  app.set("etag", false);
}

// View engine setup
app.set("views", "views");
app.set("view engine", "ejs");

app.use(abuseCheck({
  byXForwardedFor: configFns.getProperty("reverseProxy.blockViaXForwardedFor"),
  byIP: !configFns.getProperty("reverseProxy.blockViaXForwardedFor")
}));

if (!configFns.getProperty("reverseProxy.disableCompression")) {
  app.use(compression());
}

app.use((req, _res, next) => {
  debugApp(req.method + " " + req.url);
  next();
});

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(csurf({ cookie: true }));


/*
 * Rate Limiter
 */

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000
});

app.use(limiter);


/*
 * STATIC ROUTES
 */


const urlPrefix = configFns.getProperty("reverseProxy.urlPrefix");


app.use(urlPrefix, express.static("public"));

app.use(urlPrefix + "/lib/fontsource-barlow",
  express.static(path.join("node_modules", "@fontsource", "barlow")));

app.use(urlPrefix + "/lib/bulma-webapp-js",
  express.static(path.join("node_modules", "@cityssm", "bulma-webapp-js", "dist")));

app.use(urlPrefix + "/lib/date-diff",
  express.static(path.join("node_modules", "@cityssm", "date-diff", "es2015")));

app.use(urlPrefix + "/lib/fa5",
  express.static(path.join("node_modules", "@fortawesome", "fontawesome-free")));


/*
 * SESSION MANAGEMENT
 */


const SQLiteStore = sqlite(session);


const sessionCookieName = configFns.getProperty("session.cookieName");


// Initialize session
app.use(session({
  store: new SQLiteStore({
    dir: "data",
    db: "sessions.db"
  }),
  name: sessionCookieName,
  secret: configFns.getProperty("session.secret"),
  resave: true,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    maxAge: configFns.getProperty("session.maxAgeMillis"),
    sameSite: "strict"
  }
}));

// Clear cookie if no corresponding session
app.use((req, res, next) => {

  if (req.cookies[sessionCookieName] && !req.session.user) {
    res.clearCookie(sessionCookieName);
  }

  next();
});

// Redirect logged in users
const sessionChecker = (req: express.Request, res: express.Response, next: express.NextFunction) => {

  if (req.session.user && req.cookies[sessionCookieName]) {
    return next();
  }

  return res.redirect(urlPrefix + "/login");
};


/*
 * ROUTES
 */


// Make config objects available to the templates
app.use(async function(req, res, next) {
  res.locals.configFns = configFns;
  res.locals.dateTimeFns = dateTimeFns;
  res.locals.stringFns = stringFns;
  res.locals.user = req.session.user;
  res.locals.csrfToken = req.csrfToken();
  res.locals.urlPrefix = configFns.getProperty("reverseProxy.urlPrefix");
  res.locals.recordTypes = await getRecordTypes();
  res.locals.headTitle = "";
  next();
});


app.get(urlPrefix + "/", sessionChecker, (_req, res) => {
  res.redirect(urlPrefix + "/dashboard");
});

app.use(urlPrefix + "/dashboard", sessionChecker, routerDashboard);

app.use(urlPrefix + "/view", sessionChecker, routerView);

app.use(urlPrefix + "/new", sessionChecker, permissionHandlers.canUpdate, routerNew);

app.use(urlPrefix + "/edit", sessionChecker, permissionHandlers.canUpdate, routerEdit);

app.use(urlPrefix + "/reports", sessionChecker, routerReports);

app.use(urlPrefix + "/admin", sessionChecker, permissionHandlers.isAdmin, routerAdmin);

app.use(urlPrefix + "/login", routerLogin);

app.get(urlPrefix + "/logout", (req, res) => {

  if (req.session.user && req.cookies[sessionCookieName]) {

    req.session.destroy(null);
    req.session = null;
    res.clearCookie(sessionCookieName);

  }

  res.redirect(urlPrefix + "/login");
});


// Catch 404 and forward to error handler
app.use(function(_req, _res, next) {
  next(createError(404));
});


// Error handler
app.use(function(err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) {

  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render("error");
});


if (configFns.getProperty("integrations.docuShare.isEnabled")) {
  docuShareFns.doSetup();
}

export default app;
