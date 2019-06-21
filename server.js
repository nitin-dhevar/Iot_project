const express = require('express');
port = process.env.PORT || 3000 ;
const bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var server = require('http').Server(app);
require('./Nitin/main')(app, router);



app.use('/', router);
server.listen(port);