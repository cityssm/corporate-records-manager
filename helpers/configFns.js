import { config } from "../data/config.js";
Object.freeze(config);
const configFallbackValues = new Map();
configFallbackValues.set("application.httpPort", 58009);
configFallbackValues.set("application.applicationName", "Corporate Records Manager");
configFallbackValues.set("application.enableTempAdminUser", false);
configFallbackValues.set("reverseProxy.disableCompression", false);
configFallbackValues.set("reverseProxy.disableEtag", false);
configFallbackValues.set("reverseProxy.blockViaXForwardedFor", false);
configFallbackValues.set("reverseProxy.urlPrefix", "");
configFallbackValues.set("session.cookieName", "corporate-records-manager-user-sid");
configFallbackValues.set("session.secret", "cityssm/corporate-records-manager");
configFallbackValues.set("session.maxAgeMillis", 4 * 60 * 60 * 1000);
configFallbackValues.set("session.doKeepAlive", false);
configFallbackValues.set("integrations.docuShare.isEnabled", false);
configFallbackValues.set("integrations.docuShare.collectionHandles", []);
export function getProperty(propertyName) {
    const propertyNameSplit = propertyName.split(".");
    let currentObject = config;
    for (const propertyNamePiece of propertyNameSplit) {
        currentObject = currentObject[propertyNamePiece];
        if (!currentObject) {
            return configFallbackValues.get(propertyName);
        }
    }
    return currentObject;
}
