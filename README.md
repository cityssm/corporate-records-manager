# Corporate Records Manager

[![Codacy grade](https://img.shields.io/codacy/grade/3b81bddcdcf34245a147234a57d60d33)](https://app.codacy.com/gh/cityssm/corporate-records-manager/dashboard)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/cityssm/corporate-records-manager)](https://codeclimate.com/github/cityssm/corporate-records-manager)
[![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/cityssm/corporate-records-manager)](https://app.snyk.io/org/cityssm/project/72b9e0fb-c5b2-4a6c-baa9-f9714c6c5109)

A system for tracking various corporate records administered by the Clerks Department.

**Under development.  Expected to launch July 2021.**

![Edit By-Law Screenshot](docs/screenshot.png)

## Features

-   Tracks corporate records like by-laws and agreements, but flexible enough to track much more.
-   CSV export options.
-   [Xerox DocuShare](https://www.xerox.com/en-us/services/enterprise-content-management) integrations.

## Requirements

-   Node 14 or better.
-   Microsoft SQL Server 2005 or better (for data storage).
-   Active Directory (for authentication).

## Installation

-   Install [NodeJS](https://nodejs.org/) 14 or better.
-   Download the [latest release](https://github.com/cityssm/corporate-records-manager/releases), or clone the repository to a folder of your choice.
-   Use the [`sql/createTables.sql`](sql/createTables.sql) script to create the database.
-   Run `npm install` to grab the dependencies.
-   Create a `data/config.js` file.  Use [`data/config-sample.js`](data/config-sample.js) as a guide.
-   Run `npm start`.

Windows service install scripts are available as well.

## Getting Started

[Documentation](docs/readme.md)
