import { Router } from "express";
import * as authFns from "../helpers/authFns.js";
import * as configFns from "../helpers/configFns.js";
import { getUser } from "../helpers/securityDB/getUser.js";
import debug from "debug";
const debugLogin = debug("building-permit-system:routes:login");
const redirectURL = configFns.getProperty("reverseProxy.urlPrefix") + "/dashboard";
export const router = Router();
router.route("/")
    .get((req, res) => {
    const sessionCookieName = configFns.getProperty("session.cookieName");
    if (req.session.user && req.cookies[sessionCookieName]) {
        res.redirect(redirectURL);
    }
    else {
        res.render("login", {
            userName: "",
            message: ""
        });
    }
})
    .post(async (req, res) => {
    const userName = req.body.userName.toLowerCase();
    const passwordPlain = req.body.password;
    try {
        const isAuthenticated = await authFns.authenticate(userName, passwordPlain);
        if (isAuthenticated) {
            const user = await getUser(userName);
            if (!user) {
                return res.render("login", {
                    userName,
                    message: "Access Denied"
                });
            }
            else {
                req.session.user = user;
                return res.redirect(redirectURL);
            }
        }
        return res.render("login", {
            userName,
            message: "Login Failed"
        });
    }
    catch (e) {
        debugLogin(e);
        return res.render("login", {
            userName,
            message: "Login Failed"
        });
    }
});
export default router;
