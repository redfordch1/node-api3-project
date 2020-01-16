const express = require("express");

const server = express();
const userRouter = require("./users/userRouter.js");
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use(express.json());
server.use(logger);
server.use("/api/users", userRouter);

//custom middleware
function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`This is the Logger!! ${method} to ${originalUrl}`);

  next();
}

module.exports = server;
