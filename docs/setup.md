[Home](https://cityssm.github.io/corporate-records-manager/)
·
[Documentation](./)

# Setup and Configuration

Application configuration is done by an application administrator.
Settings are located in two main places.

-   The data/config.js file.
-   The database tables.

## config.js

The config.js file contains server details, authentication details, database details, and some application customizations.
It is recommended to use `data/configSample.js` as a starting point,
or better yet, `data/configSample.ts` for TypeScript assistance.

### config.application = {};

| Property          | Description                                          | Default                       |
| ----------------- | ---------------------------------------------------- | ----------------------------- |
| `httpPort`        | The port the server will run on.                     | `58009`                       |
| `applicationName` | The name of the application.                         | `"Corporate Records Manager"` |
| `userDomain`      | The Active Directory domain for user authentication. | `""`                          |

### config.reverseProxy = {};

The settings below help when running the application behind
a reverse proxy like IIS.

| Property                | Description                                                        | Default |
| ----------------------- | ------------------------------------------------------------------ | ------- |
| `disableCompression`    |                                                                    | `false` |
| `disableEtag`           |                                                                    | `false` |
| `blockViaXForwardedFor` |                                                                    | `false` |
| `urlPrefix`             | Prefixes all application URLs to make them appear inside a folder. | `""`    |

### config.session = {};

| Property       | Description                                                                            | Default                                |
| -------------- | -------------------------------------------------------------------------------------- | -------------------------------------- |
| `cookieName`   |                                                                                        | `"corporate-records-manager-user-sid"` |
| `secret`       |                                                                                        | `"cityssm/corporate-records-manager"`  |
| `maxAgeMillis` | How long sessions last in milliseconds.                                                | `14400000` (4 hours)                   |
| `doKeepAlive`  | Whether or not clients periodically ping the web server to keep their sessions active. | `false`                                |

### config.mssqlConfig = {};

See the [configuration options](https://www.npmjs.com/package/mssql#configuration-1) for the `node-mssql` package.

### config.adWebAuthConfig = {};

### config.integrations.docuShare = {};

DocuShare integrations are powered by
[the node-docushare project](https://github.com/cityssm/node-docushare).

| Property            | Description                                                                                     | Example                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `isEnabled`         | Disabled by default.                                                                            | `true`                                                                                          |
| `rootURL`           |                                                                                                 | `"http://xerox.local/docushare"`                                                                |
| `collectionHandles` | An array of handles, their common names, and the recordTypeKeys they are contain documents for. | `[{title: "2000 - 2010 By-Laws", handle: "Collection-101", recordTypeKey: ["bylaw"]}, ..., {}]` |
| `server`            | Server configuration for node-docushare.                                                        | `{serverName: "192.168.1.2"}`                                                                   |
| `session`           | User configuration for node-docushare.                                                          | `{userName: "apiUser", password: "p@ssw0rd"}`                                                   |

## Database Tables

To update the configuration tables graphically,
see the [Administration documentation](admin.md).

Alternatively, you can manually update the configuration tables.
using a tool like [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms).

### CR.Users

Authenication is done by Active Directory.
**No passwords are stored in the database.**

In order for a user to have access to the application,
they must have their user name in the CR.Users table,
and be marked as active.

| Field Name   | Data Type                 | Description                                                                      | Example      |
| ------------ | ------------------------- | -------------------------------------------------------------------------------- | ------------ |
| `userName`   | `varchar(30) primary key` | The user name (without domain).                                                  | `"j.doe"`    |
| `fullName`   | `nvarchar(200)`           | The user's full name.                                                            | `"Jane Doe"` |
| `isActive`   | `bit`                     | Whether or not the user has permission to log in.                                | `1`          |
| `canViewAll` | `bit`                     | Whether or not the user can see records they are not explicitly associated with. | `1`          |
| `canUpdate`  | `bit`                     | Whether or not the user can update records.                                      | `1`          |
| `isAdmin`    | `bit`                     | Whether or not the user can maintain configuration tables.                       | `0`          |

### CR.RecordTypes

| Field Name      | Data Type                 | Description                                                  | Example                            |
| --------------- | ------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| `recordTypeKey` | `varchar(20) primary key` | The behind-the-scenes key.                                   | `"bylaw"`                          |
| `recordType`    | `varchar(100)`            | The human readable record type.                              | `"By-Law"`                         |
| `minlength`     | `tinyint`                 | The minimum length of record numbers.                        | `6`                                |
| `maxlength`     | `tinyint`                 | The maximum length of record numbers.                        | `8`                                |
| `pattern`       | `varchar(50)`             | The regular expression to validate record numbers.           | `"^(\d\d){1,2}-\d\d\d$"`           |
| `patternHelp`   | `varchar(100)`            | The human readable version of the pattern to assist users.   | `"Year, dash, three-digit index."` |
| `isActive`      | bit                       | Whether the record type is available for new records or not. | `1`                                |

### CR.RecordUserTypes

| Field Name          | Data Type                 | Description                                                       | Example               |
| ------------------- | ------------------------- | ----------------------------------------------------------------- | --------------------- |
| `recordUserTypeKey` | `varchar(30) primary key` | The behind-the-scenes key.                                        | `authority-delegated` |
| `recordUserType`    | `varchar(100)`            | The human readable record user type.                              | `Delegated Authority` |
| `isActive`          | bit                       | Whether the record user type is available for new records or not. | `1`                   |

### CR.StatusTypes

Note that only those record types with corresponding status types
will have status options available.

| Field Name      | Data Type                 | Description                                                           | Example            |
| --------------- | ------------------------- | --------------------------------------------------------------------- | ------------------ |
| `statusTypeKey` | `varchar(30) primary key` | The behind-the-scenes key.                                            | `"bylaw-repealed"` |
| `recordTypeKey` | `varchar(20)`             | The record type the status corresponds to.                            | `"bylaw"`          |
| `statusType`    | `varchar(100)`            | The human readable status.                                            | `"Repealed"`       |
| `orderNumber`   | `tinyint`                 | Used to sort status types within lists, followed by the `statusType`. | `1`                |
| `isActive`      | `bit`                     | Whether the status type is available for new records or not.          | `1`                |
