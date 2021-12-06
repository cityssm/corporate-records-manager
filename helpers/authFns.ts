import * as configFns from "./configFns.js";

import ActiveDirectory from "activedirectory2";
import * as adWebAuth from "@cityssm/ad-web-auth-connector";


const userDomain = configFns.getProperty("application.userDomain");

const authenticationSource = configFns.getProperty("authentication.source");
let authenticationFunction: (userName: string, password: string) => Promise<boolean>;

const adWebAuthConfig = configFns.getProperty("authentication.adWebAuthConfig");
const activeDirectoryConfig = configFns.getProperty("authentication.activeDirectoryConfig");


const authenticateViaADWebAuth = async (userName: string, password: string): Promise<boolean> => {
  return await adWebAuth.authenticate(userDomain + "\\" + userName, password);
};


const authenticateViaActiveDirectory = async (userName: string, password: string): Promise<boolean> => {

  return new Promise((resolve) => {

    try {
      const ad = new ActiveDirectory(activeDirectoryConfig);

      ad.authenticate(userDomain + "\\" + userName, password, async (error, auth) => {

        if (error) {
          resolve(false);
        }

        resolve(auth);
      });

    } catch {
      resolve(false);
    }
  });
};


/*
 * Setup
 */

switch (authenticationSource) {
  case "ad-web-auth":
    adWebAuth.setConfig(adWebAuthConfig);
    authenticationFunction = authenticateViaADWebAuth;
    break;

  case "Active Directory":
    authenticationFunction = authenticateViaActiveDirectory;
    break;
}


export const authenticate = async (userName: string, password: string): Promise<boolean> => {

  if (!userName || userName === "" || !password || password === "") {
    return false;
  }

  return await authenticationFunction(userName, password);
};
