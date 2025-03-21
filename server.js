const express = require('express');
const app = express();
const port = process.env.PORT || 5050;
const http = require('http');
const server = http.createServer(app);

const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const compression = require('compression');
const connectDB = require('./config/database'); // Updated to use the new connectDB function

// Connect to the database
connectDB();

require('./api/models/user');
require('./api/models/category');
require('./api/models/photoSession');
require('./api/models/section');

app.use(
  compression({
    threshold: 0,
  })
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(busboy());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  next();
});

app.use(require('prerender-node').set('prerenderToken', 'zWSNEIMuvaTzzPcwBSFL'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/v1', require('./api/routes/api'));
app.use('/public/uploads', express.static(`${__dirname}/public/uploads/`));
server.listen(port);

app.use((req, res) => {
  res.status(404).send({
    error: req.originalUrl + ' not found',
    status: 404,
  });
});

console.log('RESTful API server started on: ' + port);
