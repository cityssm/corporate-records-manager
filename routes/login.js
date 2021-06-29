import { Router } from "express";
import { tempAdmin } from "../app.js";
import * as authFns from "../helpers/authFns.js";
import * as configFns from "../helpers/configFns.js";
import { getUser } from "../helpers/recordsDB/getUser.js";
import debug from "debug";
const debugLogin = debug("corporate-records-manager:routes:login");
const redirectURL = configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard";
export const router = Router();
router.route("/")
    .get((request, response) => {
    const sessionCookieName = configFns.getProperty("session.cookieName");
    if (request.session.user && request.cookies[sessionCookieName]) {
        response.redirect(redirectURL);
    }
    else {
        response.render("login", {
            userName: "",
            message: ""
        });
    }
})
    .post(async (request, response) => {
    let userName = request.body.userName;
    const passwordPlain = request.body.password;
    if (configFns.getProperty("application.enableTempAdminUser") && userName === tempAdmin.userName) {
        if (passwordPlain === tempAdmin.password) {
            request.session.user = {
                userName: tempAdmin.userName,
                canUpdate: tempAdmin.canUpdate,
                isAdmin: tempAdmin.isAdmin
            };
            response.redirect(redirectURL);
        }
        else {
            response.render("login", {
                userName,
                message: "Access Denied"
            });
        }
        return;
    }
    try {
        userName = userName.toLowerCase();
        const isAuthenticated = await authFns.authenticate(userName, passwordPlain);
        if (isAuthenticated) {
            const user = await getUser(userName);
            if (!user) {
                response.render("login", {
                    userName,
                    message: "Access Denied"
                });
            }
            else {
                request.session.user = user;
                response.redirect(redirectURL);
            }
        }
        else {
            response.render("login", {
                userName,
                message: "Login Failed"
            });
        }
    }
    catch (error) {
        debugLogin(error);
        response.render("login", {
            userName,
            message: "Login Failed"
        });
    }
});
export default router;
