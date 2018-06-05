var express = require("express");
var hbs = require("hbs");
var app = new express();
var fs = require("fs");
var http = require("http");
var formidable = require("formidable");
var util = require("util");
var Bodyparser = require("body-parser");
var urlEncodeParser = Bodyparser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "hbs");
app.use(express.static('views'));
app.get("/", function(request, response) {
    response.render("index.hbs");
});

app.post("/review", urlEncodeParser, function(request, response) {
    console.log(request.body);
    console.log("showed")
    var idToWrite = request.body.id;
    var reviewToWrite = request.body.text;
    var reviewString = idToWrite + " : " + reviewToWrite;
    console.log(idToWrite + " " + reviewToWrite);
    fs.appendFile("review.log", reviewString + "\n",function(){});
    var url = "mongodb://localhost:27017/reviews";
    MongoClient.connect(url, function(err, client) {
        if(err) {
            return console.log(err);
        }
        const db = client.db("reviews");
        client.db("reviews");
        console.log("Created");
        let rew = {id: idToWrite, text: reviewToWrite};
        const collection = db.collection("reviews");
        collection.insertOne(rew, function(err, result) {
            if(err) {
                return console.log(err);
            }
            console.log(result.ops);
            client.close();
        });
        client.close();
    });
});

app.post("/loadplaces", urlEncodeParser, function(request, response) {
    console.log("loadplaces reached");
    var url = "mongodb://localhost:27017/places";
    MongoClient.connect(url, function(err, client) {
        if(err) {
            return console.log(err);
        }
        const db = client.db("places");
        client.db("places");
        console.log("req body:")
        console.log(request.body) //??
        const collection = db.collection("places")
        var res = db.collection("places").findOne()
        if(res) {
            console.log(request.body)
            console.log("is already in db")
        }
        else {
            db.collection("places").insertOne(request.body, function(err, result) {
                if(err) {
                    console.log(err);
                }
                client.close();
            })
        }
       /* console.log("Result:" + res)
        if (res) {
            }
        else{
                db.collection("places").insertOne(request.body, function(err, result) {
                    if(err) {
                        console.log(err);
                    }
                    client.close();
                })
            }
            client.close();
        })*/
    })
    response.send("Fine")
})

app.get("/getCategory", function(req, res) {
    console.log("in many search")
    var url = "mongodb://localhost:27017/places"
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("places")
        client.db("places")
        const collection = db.collection("places")
        var res = db.collection("places").find({types: req})
        console.log("sending to webpage")
        console.log(res)
        client.close()
    })
    res.send(res);
})

app.get("/getReview", function(req, res) {
    console.log("in review get")
    var url = "mongodb://localhost:27017/reviews"
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("reviews")
        client.db("reviews")
        const collection = db.collection("reviews")
        var res = db.collection("reviews").find({id : req})
        console.log("found that in get review")
      //console.log(res)
        client.close()
    })
    res.send(res.text)
})

app.post("/CheckVisited", urlEncodeParser, function(req, res) {
    console.log("in visited check get")
    var url = "mongodb://localhost:27017/visited"
    var r = ""
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("visited")
        client.db("visited")
        const collection = db.collection("visited")
        console.log("Get-func")
        console.log(req.body.id)
        db.collection("visited").findOne({'_id':req.body.id}, function(err, cursor){
            console.log(cursor)
            if(cursor) {
                r = "Y"
                console.log("visited from server")
            }
            else {
                r = "No"
            console.log("not visited from server")
            client.close()
            }
            console.log(r)
            res.send({ans:r})
        });   
    })   
})

app.post("/visited", urlEncodeParser, function(req, res) {
    console.log("marking as visited at server")
    var url = "mongodb://localhost:27017/visited"
    console.log("got by server to mark as visited" )
    console.log(req)
    console.log("req body")
    console.log(req.body)
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("visited")
        client.db("visited")
        const collection = db.collection("visited")
        db.collection("visited").insertOne({_id:req.body.id}, function(err, result) {
            if(err) {
                console.log(err);
            }
            client.close();
        })
        console.log(req.body.id + "now marked at server")
        client.close()
    })
    res.send("Fine")
})  

app.post("/notVisited", function(req, res) {
    console.log("in visited delete func")
    var url = "mongodb://localhost:27017/visited"
    var r
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("visited")
        client.db("visited")
        const collection = db.collection("visited")
        db.collection("visited").deleteOne({"id" : req})
        console.log("deleted visited note (from server)")
        client.close()
    })
    res.send(req + "Deleted")
})

app.listen(3000)