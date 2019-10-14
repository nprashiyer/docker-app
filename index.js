//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');


var mongo_host = (process.env.MONGO_SERVICE_HOST || 'mongo' );
var mongo_port = (process.env.MONGO_SERVICE_PORT || 27017 );
var url = 'mongodb://'+mongo_host+':'+mongo_port+'/order';

#connect to mongodb container named mongodb
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const orderSchema = new mongoose.Schema ({
  platform: String,
  name: String,
  location: String,
  os: String
});

const Order = new mongoose.model("Order", orderSchema, "orders");

app.get("/", function(req,res){
  res.render("home");
});

app.get("/userguide", function(req,res){
  res.render("userguide");
});

app.get("/myservers", function(req,res){
  Order.find({}, function(err, foundOrders){
    if(err) {
      console.log(err);
    } else if (foundOrders) {
      res.render("myservers", {orderList: foundOrders});
        }
  });
});

app.post("/", function(req,res){
  const vmname = req.body.vmname;
  const platform = req.body.platform;
  const loc = req.body.vmlocation;
  const os =  req.body.vmos;
  const size = req.body.usage + req.body.vmsize;


    const newOrder = new Order({
    platform: platform,
    name: vmname.toUpperCase(),
    location: loc.toUpperCase(),
    os: os.toUpperCase()
    });

    newOrder.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("submit",{vmname: vmname.toUpperCase()});
    }
  });

});

app.listen(process.env.PORT||8080, function() {
  console.log("Server started on port 8080.");
});
