import type * as sqlTypes from "mssql";
import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";
import type * as docuShareConfig from "@cityssm/docushare/types";
export interface Config {
    application?: {
        httpPort?: number;
        userDomain?: string;
        applicationName?: string;
        enableTempAdminUser?: boolean;
    };
    reverseProxy?: {
        disableCompression?: boolean;
        disableEtag?: boolean;
        blockViaXForwardedFor?: boolean;
        urlPrefix?: string;
    };
    session?: {
        cookieName?: string;
        secret?: string;
        maxAgeMillis?: number;
        doKeepAlive?: boolean;
    };
    mssqlConfig: sqlTypes.config;
    authentication: {
        source: "ad-web-auth" | "Active Directory";
        adWebAuthConfig?: ADWebAuthConfig;
        activeDirectoryConfig?: ActiveDirectoryConfig;
    };
    integrations?: {
        docuShare?: {
            isEnabled: boolean;
            rootURL?: string;
            collectionHandles?: DocuShareCollectionHandle[];
            server?: docuShareConfig.ServerConfig;
            session?: docuShareConfig.SessionConfig;
        };
    };
}
export interface DocuShareCollectionHandle {
    title: string;
    handle: string;
    recordTypeKeys?: string[];
}
export interface ReportDefinition {
    sql: () => string;
    paramNames?: string[];
    columns?: string[];
}
export interface ActiveDirectoryConfig {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}
