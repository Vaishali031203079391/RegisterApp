const express = require('express')
const path = require('path')
const debug = require("debug")("node-angular");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require('cors');

// DB config files
require('./db/mongoose')

// Routers
const userRouter = require('./routers/user')

// Config
const app = express()
app.use(cors());
const port = process.env.PORT


// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });


// Middlewares
app.use(express.json())
app.use(userRouter)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('', (req, res) => {
  res.json({
    msg: 'Welcome'
  })
  //res.sendFile(path.join(__dirname, "../public", "index.html"));
});
const server = http.createServer(app);

// Setup server
server.listen(port, () => {
  console.log('Server is up on port ' + port)
});
