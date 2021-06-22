import * as assert from "assert";

import * as pool from "@cityssm/mssql-multi-pool";

import puppeteer from "puppeteer";

import * as http from "http";
import { tempAdmin, app } from "../app.js";

import * as configFns from "../helpers/configFns.js";

// import { fakeViewOnlySession } from "./_globals.js";


describe("corporate-records-manager", () => {

  let httpServer: http.Server;
  const portNumber = 54333;

  let serverStarted = false;

  before(() => {

    httpServer = http.createServer(app);

    httpServer.on("listening", () => {
      serverStarted = true;
    });

    httpServer.listen(portNumber);

    if (!configFns.getProperty("application.enableTempAdminUser")) {
      assert.fail("application.enableTempAdminUser must be set to true");
    }
  });

  after(async() => {
    try {
      httpServer.close();
    } catch (_e) {
      // ignore
    }

    await pool.releaseAll();
  });

  it("Ensure server starts on port " + portNumber.toString(), (done) => {
    assert.ok(serverStarted);
    done();
  });

  const appURL = "http://localhost:" + portNumber.toString() + configFns.getProperty("reverseProxy.urlPrefix");

  describe("transaction page tests", () => {

    const pageTests: {
      [pageName: string]: {
        goto: string;
        waitFor?: string;
      };
    } = {
      reports: {
        goto: "/reports"
      },
      admin: {
        goto: "/admin"
      }
    };

    for (const pageName of Object.keys(pageTests)) {

      it("should login, navigate to " + pageName + ", and log out", (done) => {

        const pageURLs = pageTests[pageName];

        (async () => {
          let success = false;

          const browser = await puppeteer.launch();
          const page = await browser.newPage();

          // Load the login page

          await page.goto(appURL);

          await page.focus("#login--userName");
          await page.type("#login--userName", tempAdmin.userName);

          await page.focus("#login--password");
          await page.type("#login--password", tempAdmin.password);

          const loginFormEle = await page.$("#form--login");
          await loginFormEle.evaluate((formEle: HTMLFormElement) => {
            formEle.submit();
          });

          await page.waitForNavigation();

          // Navigate to the page

          const res = await page.goto(appURL + pageURLs.goto);

          if (res.ok) {
            success = true;
          }

          if (pageURLs.waitFor) {
            await page.waitForTimeout(1000);
          }

          // Log out

          await page.goto(appURL + "/logout");

          await browser.close();

          if (success) {
            assert.ok(true);
          } else {
            assert.fail();
          }

        })()
          .finally(() => {
            done();
          });
      });
    }
  });
});
