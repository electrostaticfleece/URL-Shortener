"use strict";

let http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    encode = require('./url_encode.js'),
    pg = require('pg'),
    url = require('url'),
    app = express(),
    port = process.env.PORT || 3000,
    connectionString = process.env.DATABASE_URL;


// Rollback function to manage errors;
let rollback = function(client, done) {
  client.query('ROLLBACK', function(err) {
    return done(err);
  });
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'))
});


app.post('/api/baby', function(req, res){

  let longUrl = req.body.url,
      base = req.headers.host,
      shortUrl;
      
  if(!/^(http)/.test(longUrl)){
          longUrl = 'http://' + longUrl;
  }

  pg.connect(connectionString, function(err, client, done){

    //Handle connection error
    if(err){
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }
    //Select ID from database if it matches the same URL
    let query = client.query("SELECT id FROM urls WHERE long_url=$1", [longUrl], function(err, result){

      if(err){ 
        return rollback(client, done); 
      }
        
      //If a match is found set the value to shortUrl
      if(result.rows.length){
        shortUrl = base + '/' + encode.encode(result.rows[0].id);
      } else {

          //If a match is not found insert the url into the database
          client.query("INSERT INTO urls (id, long_url, created_at) VALUES (nextval('babifyid'), $1, CURRENT_DATE)", [longUrl], function(err, result){
            if(err){
              return rollback(client, done); 
            }

            //Once the query has been inserted into the database, get and return the last id as a short URL;
            client.query("SELECT id FROM urls ORDER BY id DESC LIMIT 1", function(err, result){
              if(err){
                return rollback(client, done); 
              }
              shortUrl = base + '/' + encode.encode(result.rows[0].id);
              return res.send({'shortURL': shortUrl})
            });

          });

        }

    });

    //Once the query has finished executing return the shortUrl if a match was made and call done.
    query.on('end', function(){
      done();
      console.log('The short URL is ' + shortUrl);
      if(shortUrl){
        return res.send({'shortURL': shortUrl});
      }
    });

  });

});



app.get('/:encoded_id', function(req, res){

  let id = encode.decode(req.params.encoded_id),
      client = new pg.Client(connectionString);

  client.connect(function(err){

    if(err){
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    client.query("SELECT long_url FROM urls WHERE id=$1", [id], function(err, result){
      if(err){
        console.log(err);
        return res.status(500).json({ success: false, data: err});
      }

      if(result.rows.length){
        res.redirect(result.rows[0].long_url);
      } else {
        res.redirect(req.headers.host);
      }
      client.end();

    });

  });

});


let server = app.listen(port, function(){
  console.log('Server is now listening on port: ' + port);
})
