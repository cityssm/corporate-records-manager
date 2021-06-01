import * as path from "path";
import * as ds from "@cityssm/docushare";
import * as configFns from "./configFns.js";
export const doSetup = () => {
    ds.setupJava({
        dsapiPath: path.join("..", "..", "..", "java", "dsapi.jar")
    });
    ds.setupServer(configFns.getProperty("integrations.docuShare.server"));
    ds.setupSession(configFns.getProperty("integrations.docuShare.session"));
};
export const getCollectionHandle = (collectionID) => {
    return "Collection-" + collectionID.toString();
};
export const getCollectionURL = (collectionID) => {
    return configFns.getProperty("integrations.docuShare.rootURL") + "/dsweb/View/" +
        getCollectionHandle(collectionID);
};
export const getIDFromHandle = (handle) => {
    return handle.split("-")[1];
};
