var express = require('express');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.use(express.static('public'));

//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
//nodejs is the name of my database.
var url = 'mongodb://localhost:27017/nodejs';

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/test', function(req, res){
    var test = ["Hello", "World","Whero"];
    console.log(test);
    res.json(test);
});


app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "user.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.get('/listMongoUsers', function (req, res, next) {
    
    // Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        
        var collection = db.collection('users');

        collection.find({}).toArray(function(err, data){
            if(err)
            {
                console.log("error here!!");
                console.log(err);
            }
            else{
                console.log("it works !!");
                console.log(data);
                 res.send(data);  
            }
        });

        //Close connection
        db.close();
    }
    });
    // send HTML file populated with quotes here
})


app.get('/main.html', function (req, res) {
   res.sendFile( __dirname + "/" + "main.html" );
})

app.get('/users.html', function (req, res) {
   res.sendFile( __dirname + "/" + "users.html" );
})

app.get('/process_get', function (req, res) {

   // Prepare output in JSON format
   response = {
       first_name:req.query.first_name,
       last_name:req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.post('/process_post', urlencodedParser, function (req, res) {

   // Prepare output in JSON format
   response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
   };
   console.log(response);

    MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);

        db.collection('users').insert(response, function(err, result){
            if(err){
                console.log(err);
            }
            else{
                console.log("sucessful insert");
                res.send();
                res.sendFile( __dirname + "/" + "main.html" );
            }
        });

        //Close connection
        db.close();
    }
    });


})

var port = 8080;

var server = app.listen(port, function(){
    console.log("running our app server...");
})