//jshint esversion: 6

require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

let User;

const uri = "mongodb://localhost:27017/userDB";
connection = mongoose.connect(uri, {
  useNewUrlParser: true
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connection succesfull.");
    const userSchema = new mongoose.Schema ({
      email: String,
      password: String
    });

    User = new mongoose.model("User", userSchema);
    app.listen(3000, function() {
      console.log("Server started on port 3000.");
    });
  }
});


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      res.send("<h1>Error Salting</h1><h2>" + err + "</h2>");
    } else {
      newUser = new User ({
        email: req.body.username,
        password: hash
      });
      newUser.save( (err) => {
        if (err) {
          res.send(err);
        } else {
          res.render("secrets");
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, bcryptRes) => {
          if (err || !bcryptRes) {
            res.send("<h1>Error Logging</h1><h2>");
          } else {
            res.render("secrets");
          }
        });
      }
    }
  });



});
