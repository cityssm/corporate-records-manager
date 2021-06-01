import type * as sqlTypes from "mssql";
import type { ADWebAuthConfig } from "@cityssm/ad-web-auth-connector/types";
import type * as docuShareConfig from "@cityssm/docushare/types";
export interface Config {
    application?: {
        httpPort?: number;
        userDomain?: string;
    };
    reverseProxy?: {
        disableCompression: boolean;
        disableEtag: boolean;
        blockViaXForwardedFor: boolean;
        urlPrefix: string;
    };
    session?: {
        cookieName?: string;
        secret?: string;
        maxAgeMillis?: number;
        doKeepAlive?: boolean;
    };
    mssqlConfig: sqlTypes.config;
    adWebAuthConfig: ADWebAuthConfig;
    integrations?: {
        docuShare?: {
            isEnabled: boolean;
            rootURL?: string;
            handles?: {
                corporateRecordsCollectionHandle: string;
                recordTypes?: {
                    [recordTypeKey: string]: string;
                };
            };
            server?: docuShareConfig.ServerConfig;
            session?: docuShareConfig.SessionConfig;
        };
    };
}
