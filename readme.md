# Eventhos integration test

This library propose is to test the database, api and web of zero-code. This project is based on the [selenium-nodejs-starter](https://github.com/usil/selenium-nodejs-starter) library.

## What is eventhos?

Eventhos is an open source platform that applies event-driven architecture principles to allow the user to orchestrate their system integrations using a simple user interface instead of complicated publisher and subscriber source codes in applications. You only need webhooks and rest APIs to integrate all your systems.

Full details in the [wiki](https://github.com/usil/eventhos/wiki)

## Requirements

- All the eventhos artifacts, smtp and mocks. Follow [this](https://github.com/usil/eventhos?tab=readme-ov-file#get-last-stable-version) to start all the artifacts

## Variables

| Variable              | file                | description                                                                  | default value                                                    |
| :-------------------- | :------------------ | :--------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| BROWSER               |                     | browser to be used by selenium                                               | chrome                                                           |
| EVENTHOS_WEB_BASE_URL | testOptions.json    | The url of the zeo-code web                                                  | http://localhost:2112                                            |
| EVENTHOS_API_BASE_URL | testOptions.json    | The url of the zeo-code api                                                  | http://localhost:2111                                            |
| ADMIN_PASSWORD        | testOptions.json    | The admin user password, by default should be set as an environment variable |                                                                  |
| DISPLAY               | testOptions.json    | required for screen process on linux                                         | 0                                                                |
| arguments             | browserOptions.json | Browser options                                                              | `"--log-level=1", "--no-sandbox", "--headless", "--disable-gpu"` |

## Steps for Linux

```cmd
export ADMIN_PASSWORD=$(docker exec -it eventhos-api cat /tmp/credentials.txt | sed -n 4p | xargs)
export BROWSER=chrome
export SERVER_IP=$(hostname -I | awk '{print $1}')
export EVENTHOS_WEB_BASE_URL=http://$SERVER_IP:2110
export EVENTHOS_API_BASE_URL=http://localhost:2109
export MOCK_SERVER_URL=http://$SERVER_IP:9000
export SKIP_SUCCESS_TEST_IN_REPORT=true
npm uninstall chromedriver
npm install chromedriver --detect_chromedriver_version
npm install
npm run test
```

Check the result [here](./eventhos-integration-tests-custom-result.md)

To run it with a browser in background, add `"--headless"` in **browserOptions.json**

## Run specific tests

When we have failed tests, sometimes is required to run only that files instead all the tests. To do that export this variable before the run:

```
export FILTERED_FILES="changeActionSecurityType.test.js createUser.test.js"
```

## Backlog

- Check profile
- User locked
- Special chars in client secret
- search users
- date on log
- apply mask on req, resp on log
- if deleteRole.test.js deleteRole.test2.js are in the same faile, they fails
- silent axios error log

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
    <td>
      <img src="https://avatars.githubusercontent.com/u/66818290?s=400&u=d2f95a7497efd7fa830cf96fc2dc01120f27f3c5&v=4" width="100px;"/>
      <br />
      <label><a href="https://github.com/iSkyNavy">Diego Ramos</a></label>
      <br />
    </td>
  </tbody>
</table>
