# Eventhos integration test

This library propose is to test the database, api and web of zero-code. This project is based on the [selenium-nodejs-starter](https://github.com/usil/selenium-nodejs-starter) library.

## What is eventhos?

Eventhos is an open source platform that applies event-driven architecture principles to allow the user to orchestrate their system integrations using a simple user interface instead of complicated publisher and subscriber source codes in applications. You only need webhooks and rest APIs to integrate all your systems.

Full details in the [wiki](https://github.com/usil/eventhos/wiki)

## How it works?

Basically you have to identify the producers (webhooks) and consumers (apis). Then using th UI you can make a contract between the incoming event produced by a webhook (source system) to the rest api in in the target system. So with this you will have a real time integration between the producer and consumer systems without the complexity of kafka or similars.

![image](https://github.com/usil/eventhos/assets/3322836/2fafd3ab-5ad0-4cd8-a413-78caa15069a2)

Here a sample of contract between producers and consumers

https://github.com/usil/eventhos/assets/3322836/ae8cc37a-b2d5-4a65-ad1f-d853271ed2aa

More uses cases and deep explanation [here](https://github.com/usil/eventhos/wiki/Real-Use-Cases) and [here](https://github.com/usil/eventhos-web/wiki/SendEvent)

## Features

- Register all systems (producers and  consumers)
- Create contracts between your systems
- Oauth2 Security
- Manual retry  on error
- Event Dashboard to see the received events and all the details (request/response)
- Reply-To option
- Json binding to match between the webhook json and target api json
- Vanilla javascript to binding to match between the webhook json and target api json
- Mail on error with the details
- User Management

More details [here](https://github.com/usil/eventhos/wiki/Features)

## Dependencies

Here a minimalist High Level Diagram

![](https://www.planttext.com/api/plantuml/png/LOv13e0W30JlVGNXpXSCFp556Y11CBJgzyM3YhVjP9fTou9DzZL3eqMmX4oA3f9OUSOjAMIb-rrkO3hGm58RXiywoVsj3ZHu57J8f9u0eszQ2b7CD5R1MFiAxxkbullC2m00)

To know more about each dependency check their git repositories.

- [eventhos-api](https://github.com/usil/eventhos-api)
- [eventhos-web](https://github.com/usil/eventhos-web)

## Requirements

- nodejs > 16
- eventhos platform and mock api. Follow this https://github.com/usil/eventhos#usage:-integration-test

## Variables

| Variable              | file                | description                                                                  | default value                                                    |
| :-------------------- | :------------------ | :--------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| BROWSER               |                     | browser to be used by selenium                                               | chrome                                                           |
| EVENTHOS_WEB_BASE_URL | testOptions.json    | The url of the zeo-code web                                                  | http://localhost:2112                                            |
| EVENTHOS_API_BASE_URL | testOptions.json    | The url of the zeo-code api                                                  | http://localhost:2111                                            |
| ADMIN_PASSWORD        | testOptions.json    | The admin user password, by default should be set as an environment variable |                                                                  |
| DISPLAY               | testOptions.json    | required for screen process on linux                                         | 0                                                                |
| arguments             | browserOptions.json | Browser options                                                              | `"--log-level=1", "--no-sandbox", "--headless", "--disable-gpu"` |

## Steps for Linux (all in one machine)

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

Result:
![result](https://i.ibb.co/1QHykGN/test-Result.jpg)

To run it with a browser in background, add `"--headless"` in **browserOptions.json**

## Run specific tests

When we have failed tests, sometimes is required to run only that files instead all the tests. To do that export this variable before the run:

```
export FILTERED_FILES="changeActionSecurityType.test.js createUser.test.js"
```

## Test Rsult

Check the result [here](.eventhos-integration-tests-custom-result.md)

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
