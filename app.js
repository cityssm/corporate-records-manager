import createError from "http-errors";
import express from "express";
import { abuseCheck } from "@cityssm/express-abuse-points";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import session from "express-session";
import FileStore from "session-file-store";
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
import debug from "debug";
const debugApp = debug("corporate-records-manager:app");
export const tempAdmin = {
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
app.use((request, _response, next) => {
    debugApp(request.method + " " + request.url);
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
const sessionCookieName = configFns.getProperty("session.cookieName");
const FileStoreSession = FileStore(session);
app.use(session({
    store: new FileStoreSession({
        path: "./data/sessions",
        logFn: debug("corporate-records-manager:session")
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
app.use((request, response, next) => {
    if (request.cookies[sessionCookieName] && !request.session.user) {
        response.clearCookie(sessionCookieName);
    }
    next();
});
const sessionChecker = (request, response, next) => {
    if (request.session.user && request.cookies[sessionCookieName]) {
        return next();
    }
    return response.redirect(urlPrefix + "/login");
};
app.use(async (request, response, next) => {
    response.locals.configFns = configFns;
    response.locals.dateTimeFns = dateTimeFns;
    response.locals.stringFns = stringFns;
    response.locals.user = request.session.user;
    response.locals.csrfToken = request.csrfToken();
    response.locals.urlPrefix = configFns.getProperty("reverseProxy.urlPrefix");
    response.locals.recordTypes = await getRecordTypes();
    response.locals.headTitle = "";
    next();
});
app.get(urlPrefix + "/", sessionChecker, (_request, response) => {
    response.redirect(urlPrefix + "/dashboard");
});
app.use(urlPrefix + "/dashboard", sessionChecker, routerDashboard);
app.use(urlPrefix + "/view", sessionChecker, routerView);
app.use(urlPrefix + "/new", sessionChecker, permissionHandlers.canUpdate, routerNew);
app.use(urlPrefix + "/edit", sessionChecker, permissionHandlers.canUpdate, routerEdit);
app.use(urlPrefix + "/reports", sessionChecker, routerReports);
app.use(urlPrefix + "/admin", sessionChecker, permissionHandlers.isAdmin, routerAdmin);
app.use(urlPrefix + "/login", routerLogin);
app.get(urlPrefix + "/logout", (request, response) => {
    if (request.session.user && request.cookies[sessionCookieName]) {
        request.session.destroy(null);
        request.session = undefined;
        response.clearCookie(sessionCookieName);
    }
    response.redirect(urlPrefix + "/login");
});
app.use((_request, _response, next) => {
    next(createError(404));
});
app.use((error, request, response) => {
    response.locals.message = error.message;
    response.locals.error = request.app.get("env") === "development" ? error : {};
    response.status(error.status || 500);
    response.render("error");
});
if (configFns.getProperty("integrations.docuShare.isEnabled")) {
    docuShareFns.doSetup();
}
export default app;
