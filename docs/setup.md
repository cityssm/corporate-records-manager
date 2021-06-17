[Home](../)
&middot;
[Documentation](./)

# Setup and Configuration

Application configuration is done by an application administrator.
Settings are located in two main places.

-   The data/config.js file.
-   The database tables.

## config.js

The config.js file contains server details, authentication details, database details, and some application customizations.
It is recommended to use `data/config-sample.js` as a starting point,
or better yet, `data/config-sample.ts` for TypeScript assistance.

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

### config.adWebAuthConfig = {};

### config.integrations.docuShare = {};

## Database Tables

At the time of this writing, there are no administrative views
for maintaining the configuration tables.
Once set up, ongoing maintenance is minimal.
It is recommended to use a tool like SQL Server Management Studio to make changes.

### CR.Users

### CR.RecordTypes

| Field Name      | Data Type      | Description                                                | Example                            |
| --------------- | -------------- | ---------------------------------------------------------- | ---------------------------------- |
| `recordTypeKey` | `varchar(20)`  | The behind-the-scenes key.                                 | `"bylaw"`                          |
| `recordType`    | `varchar(100)` | The human readable name.                                   | `"By-Law"`                         |
| `minlength`     | `tinyint`      | The minimum length of record numbers.                      | `6`                                |
| `maxlength`     | `tinyint`      | The maximum length of record numbers.                      | `8`                                |
| `pattern`       | varchar(50)    | The regular expression to validate record numbers.         | `"^(\d\d){1,2}-\d\d\d$"`           |
| `patternHelp`   | varchar(100)   | The human readable version of the pattern to assist users. | `"Year, dash, three-digit index."` |

### CR.StatusTypes

Note that only those record types with corresponding status types
will have status options available.
