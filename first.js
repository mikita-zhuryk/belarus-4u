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
        console.log("found that")
        console.log(res)
        client.close()
    })
    res.send(res)
})

app.get("/visited", function(req, res) {
    console.log("in visited check get")
    var url = "mongodb://localhost:27017/visited"
    var r
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("visited")
        client.db("visited")
        const collection = db.collection("visited")
        var res = db.collection("visited").find({id : req})
        if(res) {
            r = "Y"
        }
        else {
            r = "No"
        }
        console.log("found that")
        console.log(r)
        client.close()
    })
    res.send(r)
})

app.post("/visited", function(req, res) {
    console.log("in visited check get")
    var url = "mongodb://localhost:27017/visited"
    var r
    MongoClient.connect(url, function(err, client) {
        if(err) {
            console.log(err)
        }
        const db = client.db("visited")
        client.db("visited")
        const collection = db.collection("visited")
        db.collection("visited").insertOne(req)
        client.close()
    })
    res.send("Fine")
})

app.listen(3000)