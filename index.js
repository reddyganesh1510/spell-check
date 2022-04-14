var spc = require("spellchecker");
const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/spellcheck", (req, res) => {
  var { text } = req.body;
  var responseMsg = getSpellingSuggestions(text);
  console.log(responseMsg);
  res.send(responseMsg);
});
var server = app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});

function getSpellingSuggestions(str) {
  var misspellings = false,
    output = {},
    suggestion = [],
    corrections = {};
  output.original = str;

  var words = str.split(" ");
  var lastChar = getEnding(words[words.length - 1]);

  var word, noPunctuation, correctSpelling, hasMistakes, hasCorrections;
  for (var i = 0; i < words.length; i++) {
    word = words[i];
    noPunctuation = word.replace(/\W/g, "");

    if (getEnding(word)) {
      word = word.slice(0, -1);
    }

    if (spc.isMisspelled(word)) {
      hasMistakes = true;
      correctSpelling = spc.getCorrectionsForMisspelling(word);
      if (correctSpelling.length) {
        hasCorrections = true;
        corrections[word] = correctSpelling;
      } else {
        corrections[word] = null;
      }
    }
  }

  for (correction in corrections) {
    if (correction && corrections[correction]) {
      var regex = new RegExp(correction, "g");
      str = str.replace(regex, corrections[correction][0]);
    }
  }

  if (hasMistakes) {
    output.suggestion = hasCorrections ? str : null;
    output.corrections = corrections;
  } else {
    output.suggestion = false;
  }

  return output;
}

function getEnding(str) {
  var lastChar = str.slice(-1);
  if (!lastChar.match(/^[0-9a-z]+$/)) {
    return lastChar;
  } else {
    return false;
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
