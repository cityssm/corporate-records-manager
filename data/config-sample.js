export const config = {
    application: {
        applicationName: "Corporate Records Manager",
        userDomain: "x"
    },
    session: {
        maxAgeMillis: 60 * 60 * 1000
    },
    adWebAuthConfig: {
        url: "http://127.0.0.1:46464",
        method: "headers",
        userNameField: "AD-UserName",
        passwordField: "AD-Password"
    },
    mssqlConfig: {
        user: "user",
        password: "p@ssw0rd",
        server: "127.0.0.1",
        database: "corporateRecords",
        options: {
            encrypt: false,
            enableArithAbort: true,
            useUTC: false
        }
    }
};
export default config;
