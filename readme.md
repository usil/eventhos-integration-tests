# Eventhos integration test

This library propose is to test the database, api and web of zero-code. This project is based on the [selenium-nodejs-starter](https://github.com/usil/selenium-nodejs-starter) library.

## Requirements

- nodejs > 14
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
npm uninstall chromedriver
npm install chromedriver --detect_chromedriver_version
npm install
npm run test
```

Result:
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
