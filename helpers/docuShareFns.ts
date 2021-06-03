import { fileURLToPath } from "url";
import path from "path";

import * as ds from "@cityssm/docushare";

import * as configFns from "./configFns.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const doSetup = () => {

  ds.setupJava({
    dsapiPath: path.join(__dirname, "..", "java", "dsapi.jar")
  });

  ds.setupServer(configFns.getProperty("integrations.docuShare.server"));

  ds.setupSession(configFns.getProperty("integrations.docuShare.session"));
};


export const getIDFromHandle = (handle: string) => {
  return handle.split("-")[1];
};


export const getURL = (handle: string) => {

  return configFns.getProperty("integrations.docuShare.rootURL") +
    "/dsweb/View/" +
    handle;
};
