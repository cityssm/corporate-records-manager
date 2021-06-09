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
import { getRecordTypes } from "./helpers/recordsDB/configCache.js";
import debug from "debug";
const debugApp = debug("corporate-records-manager:app");
export const app = express();
if (!configFns.getProperty("reverseProxy.disableEtag")) {
    app.set("etag", false);
}
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
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000
});
app.use(limiter);
const urlPrefix = configFns.getProperty("reverseProxy.urlPrefix");
app.use(urlPrefix, express.static("public"));
app.use(urlPrefix + "/lib/fontsource-barlow", express.static(path.join("node_modules", "@fontsource", "barlow")));
app.use(urlPrefix + "/lib/bulma-webapp-js", express.static(path.join("node_modules", "@cityssm", "bulma-webapp-js", "dist")));
app.use(urlPrefix + "/lib/date-diff", express.static(path.join("node_modules", "@cityssm", "date-diff", "es2015")));
app.use(urlPrefix + "/lib/fa5", express.static(path.join("node_modules", "@fortawesome", "fontawesome-free")));
const SQLiteStore = sqlite(session);
const sessionCookieName = configFns.getProperty("session.cookieName");
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
app.use((req, res, next) => {
    if (req.cookies[sessionCookieName] && !req.session.user) {
        res.clearCookie(sessionCookieName);
    }
    next();
});
const sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies[sessionCookieName]) {
        return next();
    }
    return res.redirect(urlPrefix + "/login");
};
app.use(async function (req, res, next) {
    res.locals.configFns = configFns;
    res.locals.dateTimeFns = dateTimeFns;
    res.locals.stringFns = stringFns;
    res.locals.user = req.session.user;
    res.locals.csrfToken = req.csrfToken();
    res.locals.urlPrefix = configFns.getProperty("reverseProxy.urlPrefix");
    res.locals.recordTypes = await getRecordTypes();
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
app.use(urlPrefix + "/login", routerLogin);
app.get(urlPrefix + "/logout", (req, res) => {
    if (req.session.user && req.cookies[sessionCookieName]) {
        req.session.destroy(null);
        req.session = null;
        res.clearCookie(sessionCookieName);
    }
    res.redirect(urlPrefix + "/login");
});
app.use(function (_req, _res, next) {
    next(createError(404));
});
app.use(function (err, req, res, _next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});
if (configFns.getProperty("integrations.docuShare.isEnabled")) {
    docuShareFns.doSetup();
}
export default app;
