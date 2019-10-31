const express = require('express');
const helmet = require('helmet');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(helmet());

server.use(express.json());

server.use(logger);

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});




//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const url = req.url;
  const timestamp = new Date();

  console.log(`INFO: (${method} : ${url} : ${timestamp})`);

  next();

}

module.exports = server;
