//jshint esversion:6 experimental
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const app = express();
 mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true ,useUnifiedTopology: true});
 const userSchema = new mongoose.Schema({
   email : String,
   password : String
 });
console.log(process.env.API_KEY);

 userSchema.plugin(encrypt,{secret : process.env.SECRET, encryptedFields:["password"]});
 const User = mongoose.model ("User", userSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));



app.get("/",function(req,res){
  res.render("home");
});


app.get("/login",function(req,res){
  res.render("login");
});
app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });
newUser.save(function(err){
  if(err){
    console.log(err);
  }
  else{
    res.render("secrets");
  }
});

})
app.post("/login",function(req,res){
  const username =req.body.username;
  const password = req.body.password;

User.findOne({email : username}, function(err,foundUsername){
  if(foundUsername){
    if(foundUsername.password===password){
      res.render("secrets");
    }
    else{
      res.render("Invalid password");
    }
  }
  else{
    res.send("Usename not registered");
  }
})

});



//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
