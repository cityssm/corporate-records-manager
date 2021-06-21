import type * as configTypes from "../types/configTypes";


export const config: configTypes.Config = {

  application: {
    applicationName: "Corporate Records Manager",
    userDomain: "",
    enableTempAdminUser: true
  },

  session: {
    maxAgeMillis: 60 * 60 * 1000
  },

  // ad-web-auth details
  // Not used
  adWebAuthConfig: {
    url: "http://127.0.0.1:46464",
    method: "headers",
    userNameField: "AD-UserName",
    passwordField: "AD-Password"
  },

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
