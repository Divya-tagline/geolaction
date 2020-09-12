var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  //Find all documents in the location collection:
  dbo.collection("loca").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.json(result);
    db.close();
  });
});

});

router.post('/', function(req, res, next) {
  //res.send('respond with a resource');
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = req.body;
    dbo.collection("loca").insertOne(myobj, function(err, ress) {
      if (err) throw err;
      dbo.collection("loca").createIndex( { "loc" : "2dsphere" } )
      console.log("1 data inserted");
      res.send("1 data inserted");
      db.close();
    });
  });
});

router.post('/index', function(req, res, next) {
  //res.send('respond with a resource');
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    //var myobj = req.body;
    db.collection("loca").createIndex( { "loc" : "2dsphere" } )
    db.close();
  });
});

/***/

router.post('/find', function(req, res, next) {
  //res.send('respond with a resource');
 
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("loca").createIndex( { "loc" : "2dsphere" } )
    //var myobj = req.body;
    dbo.collection("loca").find(
      {
         "loc": {
           $near: {
             $geometry: {
                type: "Point" ,
                coordinates: [ 25.087626 , 55.151134 ]
             },
           }
         }
      }).each(function(err, doc) {
        console.log(doc);
      });
      /*toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
        db.close();
      });*/
   // db.close();
  });
});

module.exports = router;
