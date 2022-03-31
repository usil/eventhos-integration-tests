# Eventhos integration test

This library propose is to test the database, api and web of eventhos. This project is based on the [selenium-nodejs-starter](https://github.com/usil/selenium-nodejs-starter) library.

## Requirements

- nodejs > 14

## Steps to run the tests

- [Run the eventhos system](#running-the-eventhos-system).
- [Set the webdriver to use](#supported-browsers)
- [Set the test parameters](#variables-table)
- [Set the browser parameters](#json-example)
- [Run the integration test](#run-the-integration-test)

## Running the eventhos system

You can either use docker using the [eventhos repository](https://github.com/usil/eventhos) or run each component of eventhos system (database, api and web) separately on your own.

## Supported Browsers

The test library only supports chrome and firebox.

### Geckodriver (firefox)

This library uses the `geckodriver` package, by default it will use the latest geckodriver. Use `npm install geckodriver --GECKODRIVER_VERSION=<specific-version>` if you want to install an specific version. For more info take a look at [geckodriver](https://www.npmjs.com/package/geckodriver/)

### Chromedriver

This library uses the `chromedriver` package, by default it will use the latest chromedriver. Use `npm install chromedriver --detect_chromedriver_version` if you want to detect and install the version of chrome that you have. For more info take a look at [chromedriver](https://www.npmjs.com/package/). Set an environment variable `BROWSER` to `chrome`.

- Linux:

```cmd
export BROWSER=chrome
```

- Windows:

```cmd
set BROWSER=chrome
```

- .env file:

```text
BROWSER=chrome
```

## Configurations: testOptions.json

You will have a `testOptions.json` file in the root of this project, you should only change the variables inside `virtualUserSuites`. You can also limit the files to test in the `files` arrays setting the name of the tests files that you want to test.

### Variables table

| Variable      | description                                                                                    | default value           |
| :------------ | :--------------------------------------------------------------------------------------------- | :---------------------- |
| webUrl        | The url to the eventhos web                                                                    | `http://localhost:2110` |
| apiUrl        | The url to the eventhos api                                                                    | `http://localhost:2109` |
| adminPassword | The admin user password, by default should be set as an environment variable                   | `${ADMIN_PASSWORD}`     |
| pcIP          | The ip of your pc, by default should be set as an environment variable                         | `${PC_IP}`              |
| serverPort    | The port where the test server should run, by default should be set as an environment variable | `${TEST_SERVER_PORT}`   |

```json
{
  {
  "files": [],
  "virtualUserMultiplier": 1,
  "customColumns": ["Type", "Name"],
  "virtualUserSuites": [
    {
      "skip": false,
      "identifier": "integration-test",
      "files": [],
      "variables": {
        "webUrl": "http://localhost:2110",
        "apiUrl": "http://localhost:2109",
        "pcIP": "${PC_IP}",
        "serverPort": "${TEST_SERVER_PORT}",
        "adminPassword": "${ADMIN_PASSWORD}"
      }
    }
  ]
}
}
```

### Getting the password

#### No docker

In the credentials.txt file at the root of the `eventhos-api` project.

#### With docker

In a command line:

First access to eventhos-api in docker.

```cmd
  docker exec -it eventhos-web bash
```

To read the credentials files

```cmd
  cat credentials.txt
```

Then you will get your credentials

```txt
Credentials for the admin user in it.

          Username: admin

          Password: secret
          Credentials for the admin client.

          client_id: clientId

          client_secret: secret
```

### Setting the password

- Linux:

```cmd
export ADMIN_PASSWORD=<yourPassword>
```

- Windows:

```cmd
set ADMIN_PASSWORD=<yourPassword>
```

- .env file:

```text
ADMIN_PASSWORD=<yourPassword>
```

### Setting your PC IP variable

- Linux:

```cmd
export PC_IP=<yourPC_IP>
```

- Windows:

```cmd
set PC_IP=<yourPC_IP>
```

- .env file:

```text
PC_IP=<yourPC_IP>
```

### Setting the test server port

- Linux:

```cmd
export TEST_SERVER_PORT=<testServerPort>
```

- Windows:

```cmd
set TEST_SERVER_PORT=<testServerPort>
```

- .env file:

```text
TEST_SERVER_PORT=<testServerPort>
```

## Configurations: browserOptions.json

You will have a `browserOptions.json` file in the root of this project. Where you can add or remove the options of the browser that selenium executes. Most of those variables should not be touched unless you know what you are doing. The `--headless` option can be removed to not run in it a non headless mode.

### Json example

```json
{
  "arguments": ["--log-level=1", "--headless", "--no-sandbox", "--disable-gpu"]
}
```

## Run the integration test

First run `npm install` and then `npm test`.

![result](https://i.ibb.co/1QHykGN/test-Result.jpg)

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
