// PACKAGES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressMustache = require('mustache-express');
const session = require('express-session');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");
// This is stuff to import from our own code



// BOILER PLATE

// for express
app.use(express.static('public'));

// for mustache
app.engine('mustache', expressMustache());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// for express-validator
app.use(expressValidator());


// for express-session
app.use(
  session({
    secret: 'TotallyAwesomeSuperCoolTopSecretPasswordandHandshake',
    resave: false, // doesn't save without changes
    saveUninitialized: true // creates a session
  })
);

app.use(function(req, res, next) {
  if(!req.session.selectRandomWord){
    req.session.selectRandomWord = Math.floor(Math.random() * words.length);
    req.session.activeWord = words[req.session.selectRandomWord];
    req.session.correctLetters = words[req.session.selectRandomWord].split("").map(function() {
      return req.session.correctLetters;
    });
    req.session.livesLeft = 8;
    req.session.wrongLetters = [];
  }
  // console.log(req.session);
  next();
});

app.get('/', function(req, res){
  if (req.session.guessedLetters.join("") === req.session.activeWord){
    res.redirect("/win");
  }else {
    res.render("/game");
    var guessedletters = req.session.guessedLetters;
    var wrongLetters = req.session.wrongLetters;
    var lives = req.sesion.livesLeft;
    }
});






//LISTEN
app.listen(3000, function() {
  console.log('Application started.  Listening on port 3000');
});
