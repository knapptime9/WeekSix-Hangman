// PACKAGES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressMustache = require('mustache-express');
const session = require('express-session');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use(express.static('public'));

app.engine('mustache', expressMustache());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

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
    activeWord = req.session.activeWord;
    splitWord = activeWord.split("");
    req.session.splitWord = splitWord;
    req.session.length = activeWord.length;
    // req.session.correctLetters = activeWord.split([' ']);
    req.session.livesLeft = 8;
    req.session.guessedLetters = [];
    req.session.blanks = [];
    req.session.gameOver = false;
    req.session.win = false;
    for (var i = 0; i < req.session.length; i++) {
      req.session.blanks.push('_ ');
    }

  }

  console.log(req.session.livesLeft);
  console.log(req.session.guessedLetters);
  console.log(activeWord);
  console.log(splitWord);
  console.log(req.session.activeWord);
  console.log(req.session.length);
  console.log(req.session.blanks);
  console.log(req.session);
  next();
});

app.get('/', function (req, res, next){
    if (!req.session.blanks.includes("_ ")){
        res.redirect("win");
    }
    else if (req.session.livesLeft === 0) {
      res.redirect("lose");
    }
    else {
        res.render('game', {
          wordGuess: req.session.blanks,
          guessedLetters: req.session.guessedLetters,
          livesLeft: req.session.livesLeft
          // gameOver: req.session.gameOver,
          // win: req.session.win
        });
    }
});
app.get('/win', function(req, res) {
  res.render('win', {
    wordGuess: req.session.blanks,
    guessedLetters: req.session.guessedLetters,
    livesLeft: req.session.livesLeft
  });
});

app.get('/lose', function(req, res) {
  res.render('lose', {
    wordGuess: req.session.blanks,
    guessedLetters: req.session.guessedLetters,
    livesLeft: req.session.livesLeft
  });
});

app.get('/guess', function(req, res){
  var guess = req.body.letter;
  res.render('game', {
    wordGuess: req.session.blanks,
    guessedLetters: req.session.guessedLetters,
    livesLeft: req.session.livesLeft
    // win: req.session.win
  });
});

app.post("/guess", function(req, res){
  var guess = req.body.letter;
  if (!req.session.splitWord.includes(guess)) {
    req.session.livesLeft = req.session.livesLeft - 1;
  }
  else {
    for (var i = 0; i < req.session.length; i++){
      if (guess === req.session.splitWord[i]) {
        req.session.blanks.splice(i, 1, guess).join(" ");
      }
  }
  }
  req.session.guessedLetters.push(guess);
  res.redirect('/');
});

app.post('/reset', function(req, res){
  req.session.selectRandomWord = null;
  res.redirect("/");
});





//LISTEN
app.listen(3000, function() {
  console.log('Application started.  Listening on port 3000');
});
