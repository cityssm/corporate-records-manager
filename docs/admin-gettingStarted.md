[Home](https://cityssm.github.io/corporate-records-manager/)
·
[Documentation](./)

# Admin - Getting Started

Managing corporate records is oftentimes a one or two person job.
While this application can run on a high end server, that is by no means a requirement.

## Prerequisites

-   A server capable of running Node.js 14 or better.
-   Microsoft SQL Server 2016 or better.
    Can be on the same server, or on the same network.
-   Active Directory for authentication.

### Optional

-   DocuShare document management system for storing related files.
-   ad-web-auth instance to proxy Active Directory authentication (in some environments).

## Step 1: Install Node.js 14 or better and npm

[Node.js](https://nodejs.org) is a JavaScript runtime environment.
The Corporate Records Manager is built to run on Node.js.

[npm](https://www.npmjs.com/) is a package manager that contains all the prerequisites
for the Corporate Records Manager application.

Node.js can run on Windows, Mac, and Linux.
Installers on the [Node.js website](https://nodejs.org) include npm.
Node.js and npm are also available in most package managers.

    > sudo apt install nodejs
    > sudo apt install npm

## Step 2: Install git

_Alternatively, [releases are available on GitHub](https://github.com/cityssm/corporate-records-manager/releases).  Git is not required when using releases._

[Git](https://git-scm.com/) is the version control system that manages the
code for the Corporate Records Manager.

Git can run on Windows, Mac, and Linux.
You can install it using an install on the [Git website](https://git-scm.com/),
or from most package managers.

    > sudo apt install git

## Step 3: Clone the `corporate-records-manager` repository using git

Open a command line, and navigate to the folder where the application will reside.

    > git clone https://github.com/cityssm/corporate-records-manager

## Step 4: Install the dependencies

    > cd corporate-records-manager
    > npm install

## Step 5: Create a `config.js` file

It is recommended to copy the `configSample.js` file to get started.

    > cp data/configSample.js data/config.js

See the [Setup and Configuration documentation](admin-setup.md) for help customizing
your configuration.

## Step 6: Start the application

**Start Using npm**

    > npm start

**Start Using node**

    > node ./bin/www

**Start as a Windows Service**

The included `windowsService-install.bat` script simplifies
the process of keeping the application running in a Windows environment
by creating a service that can start with the hosting server.

    > npm link node-windows
    > windowsService-install
