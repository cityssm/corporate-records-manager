import * as configFns from "./configFns.js";
import * as adWebAuth from "@cityssm/ad-web-auth-connector";


const adWebAuthConfig = configFns.getProperty("adWebAuthConfig");
const userDomain = configFns.getProperty("application.userDomain");


adWebAuth.setConfig(adWebAuthConfig);


export const authenticate = async (userName: string, password: string): Promise<boolean> => {
  return await adWebAuth.authenticate(userDomain + "\\" + userName, password);
};
