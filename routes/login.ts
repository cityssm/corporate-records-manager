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
  .get((req, res) => {

    const sessionCookieName = configFns.getProperty("session.cookieName");

    if (req.session.user && req.cookies[sessionCookieName]) {
      res.redirect(redirectURL);

    } else {
      res.render("login", {
        userName: "",
        message: ""
      });
    }
  })
  .post(async (req, res) => {

    let userName: string = req.body.userName;
    const passwordPlain: string = req.body.password;

    if (configFns.getProperty("application.enableTempAdminUser") && userName === tempAdmin.userName) {

      if (passwordPlain === tempAdmin.password) {

        req.session.user = {
          userName: tempAdmin.userName,
          canUpdate: tempAdmin.canUpdate,
          isAdmin: tempAdmin.isAdmin
        };

        return res.redirect(redirectURL);

      } else {
        return res.render("login", {
          userName,
          message: "Access Denied"
        });
      }
    }

    try {

      userName = userName.toLowerCase();

      const isAuthenticated = await authFns.authenticate(userName, passwordPlain);

      if (isAuthenticated) {

        const user = await getUser(userName);

        if (!user) {
          return res.render("login", {
            userName,
            message: "Access Denied"
          });

        } else {

          req.session.user = user;

          return res.redirect(redirectURL);
        }
      }

      return res.render("login", {
        userName,
        message: "Login Failed"
      });

    } catch (e) {

      debugLogin(e);

      return res.render("login", {
        userName,
        message: "Login Failed"
      });
    }
  });


export default router;
