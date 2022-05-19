# Eventhos integration test

This library propose is to test the database, api and web of eventhos. This project is based on the [selenium-nodejs-starter](https://github.com/usil/selenium-nodejs-starter) library.

# Requirements

- nodejs > 14
- eventhos-api and eventhos-web

# Variables

| Variable  | file | description | default value |
| :-- | :-- | :-- | :-- |
| webUrl        | testOptions.json | The url of the eventhos web| `http://localhost:2110` |
| apiUrl        | testOptions.json |  The url of the eventhos api | `http://localhost:2109` |
| adminPassword | testOptions.json |  The admin user password, by default should be set as an environment variable  | `${ADMIN_PASSWORD}`     |
| pcIP          | testOptions.json |  The ip of the mock server (subscripts) | `${MOCK_SERVER_DOMAIN}`              |
| serverPort    | testOptions.json |  The port where the test server should run, by default should be set as an environment variable | `${TEST_SERVER_PORT}`   |
| arguments    | browserOptions.json | Browser options | `"--log-level=1", "--no-sandbox", "--headless", "--disable-gpu"`   |

# Steps to run the tests

- [Run the eventhos system](#running-the-eventhos-system).
- [Config the webdriver to use](#config-the-webdriver-to-use)
- [Set the test parameters](#variables-table)
- [Set the browser parameters](#json-example)
- [Run the integration test](#run-the-integration-test)

## Start the eventhos artifacts

You can either use docker using the [eventhos repository](https://github.com/usil/eventhos) or run each component of eventhos system (database, api and web) separately on your own.

## Configure the webdriver to use

To use another browser, check the wiki.

```cmd
export BROWSER=chrome
```

- Windows:

```cmd
set BROWSER=chrome
```

## Set the password

In the /app/credentials.txt file at the root of the `eventhos-api` project or if docker is used:

```cmd
docker exec -it eventhos-api echo cat /app/credentials.txt
docker exec -it zero-code-api cat /app/credentials.txt
```

- Linux:

```cmd
export ADMIN_PASSWORD=<yourPassword>
```

- Windows:

```cmd
set ADMIN_PASSWORD=<yourPassword>
```

## Set the mock server

- Linux:

```cmd
export MOCK_SERVER_DOMAIN=<yourMOCK_SERVER_DOMAIN>
export TEST_SERVER_PORT=<testServerPort>
```

- Windows:

```cmd
set MOCK_SERVER_DOMAIN=<yourMOCK_SERVER_DOMAIN>
set TEST_SERVER_PORT=<testServerPort>
```

## Run the integration test

First run `npm install` and then `npm run test`.

![result](https://i.ibb.co/1QHykGN/test-Result.jpg)

To run it with a browser in background, add `"--headless"` in **browserOptions.json**

## Contributors

<table>
  <tbody>
    <td>
      <img src="https://i.ibb.co/88Tp6n5/Recurso-7.png" width="100px;"/>
      <br />
      <label><a href="https://github.com/TacEtarip">Luis Huertas</a></label>
      <br />
    </td>
    <td>
      <img src="https://avatars0.githubusercontent.com/u/3322836?s=460&v=4" width="100px;"/>
      <br />
      <label><a href="http://jrichardsz.github.io/">JRichardsz</a></label>
      <br />
    </td>
  </tbody>
</table>
