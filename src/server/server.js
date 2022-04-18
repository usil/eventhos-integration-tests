const express = require("express");

const createServer = () => {
  let parsedReq = {};
  const calledTimes = [];
  let timesCalled = 0;

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.post("/token", (req, res) => {
    const { grant_type, client_id, client_secret } = req.body;

    if (!grant_type && !client_id && !client_secret) {
      return res.status(400).json({
        message: "Incorrect grant type",
      });
    }

    return res.json({
      content: {
        access_token: "token_021",
      },
    });
  });

  app.post("/integration", (req, res) => {
    timesCalled++;
    calledTimes.push(new Date().getTime());
    parsedReq = {
      query: { ...req.query },
      headers: { ...req.headers },
      body: { ...req.body },
      calledTimes,
      timesCalled,
    };
    return res.json({
      message: "Ok",
    });
  });

  app.get("/integration", (_req, res) => {
    return res.json({
      content: parsedReq,
    });
  });

  return app;
};

module.exports = createServer;
