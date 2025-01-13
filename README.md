# Data2Evidence Documentation

[![DockerCompose AzureTest CD](https://github.com/data2evidence/d2e/actions/workflows/az-dc-cd.yml/badge.svg)](https://github.com/data2evidence/d2e/actions/workflows/az-dc-cd.yml) &nbsp;&nbsp; [![Docker Build & Push](https://github.com/data2evidence/d2e/actions/workflows/docker-push.yml/badge.svg)](https://github.com/data2evidence/d2e/actions/wosrkflows/docker-push.yml) &nbsp;&nbsp; [![Docker compose Build & Up](https://github.com/data2evidence/d2e/actions/workflows/docker-compose-up.yml/badge.svg)](https://github.com/data2evidence/d2e/actions/workflows/docker-compose-up.yml)

The following documentation outlines the basic setup of Data2Evidence for users who want to use the software.

# Getting Started

## Pre-requisites

- Install pre-requisite softwares for running D2E. Refer to the installation guide [here](./docs/1-setup/README.md).
- Install the d2e cli client by run the command in your terminal:

```bash
npm install -g https://github.com/data2evidence/d2e/releases/download/latest/data2evidence-cli.tgz
```

- note: run the above command with `sudo` if permission denied e.g. where `node` was not installed with the recommended `nvm`

## Environment Variables and Credentials Setup

- Create directory to store d2e configuration files and go to it. Please note that subsequent commands need to be executed in the directory:

```bash
mkdir d2e
cd d2e
```

- Populate `.env.user` file with environment variables as follows:

```bash
GH_USERNAME=<GH_USERNAME>
GH_TOKEN=<GH_TOKEN>
```

- Key:

  - GitHub Username & PAT Token are required to fetch packages & images from docker registry `ghcr.io`
  - Fully Qualified Domain Name is required only if a Virtual Machine Server

    - Otherwise, defaults to `localhost:41100`, if running on local workstation

- References

  - See: [here](./docs/1-setup/README.md) for howto generate the above environment variables
  - See: [here](./docs/1-setup/environment-variables.md) for a description of _all_ environment variables

- Invoke the following command to generate random environment-variables secrets

```bash
source .env.user
GH_USERNAME=$GH_USERNAME GH_TOKEN=$GH_TOKEN d2e init
```

> [!NOTE]
> The Github access token is only used to pull docker images and npm packages from Github. We recommend to create a dedicated Github access token only with read:packages rights. (see [here](./docs/1-setup/README.md) how to create it)

- Login to docker registry to retrieve resources to run D2E.

```bash
d2e login
```

- Initialize D2E:

```bash
d2e setup
```

## Application Setup

Naviage to the folder where d2e repo is downloaded. Run the folllowing:

- Run the command to get the neccessary docker images and run D2E:

```bash
d2e startdemo
```

**Note:**

- If you are starting the application for first time and/or if docker volume resources have been completely removed, re-run the **Environment Variables and Credentials Setup** section
- If you have setup the application before, run steps in section **Application Setup** as required.

## Authentication Portal

- Input the URL https://localhost:41100/portal into a Chrome web browser. A ["**Proceed to localhost**"](docs/images/chrome/chrome-proceed-to-localhost.png) display is expected.
- Select **Advanced** > **Proceed to localhost (unsafe)**
- You will see the [**D2E login screen**](./docs/images/portal/LoginPage.png)

## Accessing Admin Portal

The Admin Portal allows authorized personnel to login and perform the management of users, datasets and job plugins.

- Login as Admin with following credentials:

  - username - `admin`
  - password - `Updatepassword12345`

- Click on **Account** on the top right > **Switch to admin portal**

> **The expected display is:** > ![AdminPortal](./docs/images/portal/AdminPortal.png)

Additional info:

- [Performing password change](./docs/2-load/1-initial-admin.md)
- [Performing user management](./docs/2-load/2-users-roles.md)

> [!TIP]
> For quick access to the Admin Portal, input URL https://localhost:41100/portal/systemadmin/user-overview in the search bar.

## Configure D2E with an own dataset

Please find information how to add dataset and configure D2E [here](./docs/2-load/README.md)

## Configure D2E with an own dataset

Please find information how to add your own dataset and configure D2E [here](./docs/2-load/README.md)

## Configure D2E using the demo dataset

> [!NOTE]
> You need to start Data2Evidence with `d2e startdemo` in order to use the demo dataset

Open the D2E Portal and go to the Admin Portal. In the Admin portal click on **Setup** and than **Demo Setup**:

1. Click on **Run** Button in **1. Setup demo database**
2. Restart the services by executing `d2e stopdemo` and `d2e startdemo`
3. Click on **Run** Button in **3. Setup demo dataset**

Now you can go to the researcher portal use Data2Evidence with the demo dataset.

## Researcher Portal

### Cohort Creation

- Navigate to [Researcher Portal](https://localhost:41100/portal/researcher) and select **Cohort** tab.
- Refer to the [documentation here](./docs/3-configure/8-cohort.md) for more details.

## Stopping Application

1. Stop all containers: `d2e stop`
2. Perform clean-up: `d2e clean`
   - **WARNING**: This step removes all containers and volumes. You would need to re-run the [Environment Variables and Credentials](#environment-variables-and-credentials-setup) section for a fresh startup.
- Stop all containers: `d2e stop` or `d2e stopdemo` if `d2e startdemo` was used
- Perform clean-up: `d2e clean` or `d2e cleandemo`
> [!WARNING]
> `d2e clean` removes all containers and volumes. You would need to re-run the [Environment Variables and Credentials](#environment-variables-and-credentials-setup) section for a fresh startup. 
