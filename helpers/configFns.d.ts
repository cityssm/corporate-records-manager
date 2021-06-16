import type * as sqlTypes from "mssql";
import type * as configTypes from "../types/configTypes";
import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";
import type * as docuShareConfig from "@cityssm/docushare/types";
export declare function getProperty(propertyName: "application.httpPort"): number;
export declare function getProperty(propertyName: "application.userDomain"): string;
export declare function getProperty(propertyName: "application.applicationName"): string;
export declare function getProperty(propertyName: "reverseProxy.disableCompression"): boolean;
export declare function getProperty(propertyName: "reverseProxy.disableEtag"): boolean;
export declare function getProperty(propertyName: "reverseProxy.blockViaXForwardedFor"): boolean;
export declare function getProperty(propertyName: "reverseProxy.urlPrefix"): "";
export declare function getProperty(propertyName: "session.cookieName"): string;
export declare function getProperty(propertyName: "session.doKeepAlive"): boolean;
export declare function getProperty(propertyName: "session.maxAgeMillis"): number;
export declare function getProperty(propertyName: "session.secret"): string;
export declare function getProperty(propertyName: "mssqlConfig"): sqlTypes.config;
export declare function getProperty(propertyName: "adWebAuthConfig"): ADWebAuthConfig;
export declare function getProperty(propertyName: "integrations.docuShare.isEnabled"): boolean;
export declare function getProperty(propertyName: "integrations.docuShare.rootURL"): string;
export declare function getProperty(propertyName: "integrations.docuShare.server"): docuShareConfig.ServerConfig;
export declare function getProperty(propertyName: "integrations.docuShare.session"): docuShareConfig.SessionConfig;
export declare function getProperty(propertyName: "integrations.docuShare.collectionHandles"): configTypes.DocuShareCollectionHandle[];
