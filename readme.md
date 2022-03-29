# Eventhos integration test

This library propose is to test the database, api and web of eventhos. This project is based on the [selenium-nodejs-starter](https://github.com/usil/selenium-nodejs-starter) library.

## Requirements

- nodejs > 14

## Usage

### Running it

Use `npm test`.

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

### Browser variables

You will have a `browserOptions.json` file in the root of this project. Where you can add or remove the options of the browser that selenium executes. Most of those variables should not be touched unless you know what you are doing. The `--headless` option can be removed to not run in it a non headless mode.

### Setting the test variables

You will have a `testOptions.json` file in the root of this project, you can modify the `webUrl` variable.

```json
{
  {
  "files": [],
  "virtualUserMultiplier": 1,
  "customColumns": ["Feature"],
  "virtualUserSuites": [
    {
      "skip": false,
      "identifier": "first-test",
      "files": [],
      "variables": {
        "webUrl": "http://localhost:2110",
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
export ADMIN_PASSWORD=chrome
```

- Windows:

```cmd
set ADMIN_PASSWORD=chrome
```

- .env file:

```text
ADMIN_PASSWORD=chrome
```

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
