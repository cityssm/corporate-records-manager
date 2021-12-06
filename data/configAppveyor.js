export const config = {
    application: {
        applicationName: "Corporate Records Manager",
        userDomain: "",
        enableTempAdminUser: true
    },
    session: {
        maxAgeMillis: 60 * 60 * 1000
    },
    authentication: {
        source: "Active Directory",
        activeDirectoryConfig: {
            url: "ldap://adServer.local",
            baseDN: "dc=example,dc=com",
            username: "activeDirectory@example.com",
            password: "p@ssword"
        }
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
