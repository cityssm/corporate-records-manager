import type * as sqlTypes from "mssql";
import type * as configTypes from "../types/configTypes";
import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";
import type * as docuShareConfig from "@cityssm/docushare/types";


/*
 * LOAD CONFIGURATION
 */


// eslint-disable-next-line node/no-unpublished-import
import { config } from "../data/config.js";

Object.freeze(config);


/*
 * SET UP FALLBACK VALUES
 */

const configFallbackValues = new Map<string, unknown>();

configFallbackValues.set("application.httpPort", 58_009);
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


export function getProperty(propertyName: "application.httpPort"): number;
export function getProperty(propertyName: "application.userDomain"): string;
export function getProperty(propertyName: "application.applicationName"): string;
export function getProperty(propertyName: "application.enableTempAdminUser"): boolean;

export function getProperty(propertyName: "reverseProxy.disableCompression"): boolean;
export function getProperty(propertyName: "reverseProxy.disableEtag"): boolean;
export function getProperty(propertyName: "reverseProxy.blockViaXForwardedFor"): boolean;
export function getProperty(propertyName: "reverseProxy.urlPrefix"): "";

export function getProperty(propertyName: "session.cookieName"): string;
export function getProperty(propertyName: "session.doKeepAlive"): boolean;
export function getProperty(propertyName: "session.maxAgeMillis"): number;
export function getProperty(propertyName: "session.secret"): string;

export function getProperty(propertyName: "mssqlConfig"): sqlTypes.config;
export function getProperty(propertyName: "adWebAuthConfig"): ADWebAuthConfig;

export function getProperty(propertyName: "integrations.docuShare.isEnabled"): boolean;
export function getProperty(propertyName: "integrations.docuShare.rootURL"): string;
export function getProperty(propertyName: "integrations.docuShare.server"): docuShareConfig.ServerConfig;
export function getProperty(propertyName: "integrations.docuShare.session"): docuShareConfig.SessionConfig;
export function getProperty(propertyName: "integrations.docuShare.collectionHandles"): configTypes.DocuShareCollectionHandle[];


export function getProperty(propertyName: string): unknown {

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
