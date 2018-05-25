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
        //var res = db.collection("places").findOne()
        for(var i = 0; i < request.body.places.length; i++) {
            var res = db.collection("places").findOne(request.body.places[i])
            console.log("result of search" + i)
            console.log(res);
            if(res) {
                db.collection("places").updateOne(request.body.places[i])
            }
            else {
                db.collection("places").insertOne(request.body.places[i], function(err, result) {
                    if(err) {
                        console.log(err);
                    }
                    client.close();
                })
            }
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

//app.get("/getReview", )
app.listen(3000)