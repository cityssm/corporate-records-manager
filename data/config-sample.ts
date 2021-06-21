import type * as configTypes from "../types/configTypes";


export const config: configTypes.Config = {

  application: {
    applicationName: "Corporate Records Manager",
    userDomain: "x"
  },

  session: {
    maxAgeMillis: 60 * 60 * 1000
  },

  // ad-web-auth details
  // https://github.com/cityssm/ad-web-auth
  adWebAuthConfig: {
    url: "http://127.0.0.1:46464",
    method: "headers",
    userNameField: "AD-UserName",
    passwordField: "AD-Password"
  },

  /*
   * The credentials below help with testing.
   * In a live system, SA should never be used as you rapplication user.
   * The application user needs read and write access only.
   */
  mssqlConfig: {
    user: "SA",
    password: "Password12!",
    server: "localhost",
    database: "corporateRecords",
    options: {
      encrypt: false
    }
  }
};


export default config;
