const express = require('express');
const cors = require('cors');
const path = require('path');
const error = require('../api/middlewares/error');

const { serverUrl } = require('../config/vars');
/**
 * Express instance
 * @public
 */

const app = express();

// app.set('view engine', 'ejs');

// parse body params and attache them to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.use(
  cors({
    origin: [serverUrl],
    optionsSuccessStatus: 200,
  }),
);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../../dashboard/build')));

app.use('/static', express.static('public'));

// mount api v1 routes
const routes = require('../api/routes');

app.use('/', routes);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
