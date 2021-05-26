"use strict";

var express = require("express");
const connectDB = require("./connectDB"),
  dns = require("dns"),
  bodyParser = require("body-parser"),
  Models = require("./models");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.DB_URI);
connectDB();
app.use(cors());


/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// your first API endpoint...
app.get('/api/shorturl/:id', (req,res)=>{
  console.log(req.params.id)
  Models.URL.findOne({id:req.params.id},(err, url)=>{
    if(err){
      console.error(err)
    }
    res.redirect(url.url)
  })
})
app.post("/api/shorturl/new", function(req, res) {
  const regEx = /http(s)*:[/]{2}/gi;
  const regEx1 = /w{3}[.]\S+[.]\S+/gi;
  
  const str = req.body.url + "";
  
  if(regEx.test(str)&&regEx1.test(str)){
    let tempStr = str.match(regEx1)[0]
    console.log(tempStr)
    
    dns.lookup(tempStr.slice(4,), (err, address, family) => {
    if (address === undefined) {
      res.json({ error: "invalid URL" });
    }
    Models.Counter.findOne({name:'Counter'},(err, counter)=>{
      if(err){
        console.error(err)
      }
      Models.URL.create({url:str, id: counter.id}, (err)=>{
        if(err){
          console.error(err)
        }
        const tempId = counter.id
        counter.id = counter.id+1
        counter.save()
        res.json({url:tempStr,short_url:tempId})
      })
      
    })
    
  });
  }
  else{
    res.json({ error: "invalid URL" });
  }
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
