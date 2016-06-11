"use strict";

let http = require('http'),
    express = require('express'),
    path = require('path'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'))
});

let server = app.listen(port, function(){
  console.log('Server is now listening on port: ' + port);
})