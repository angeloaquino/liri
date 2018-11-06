require("dotenv").config();
var keys = require('./key.js');
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var nodeArgs = process.argv;
var input = "";
lineBreak = "\n**************************S*E*A*R*C*H**R*E*S*U*L*T*S**************************";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    input = input + "+" + nodeArgs[i];
  }
  else {
    input += nodeArgs[i];
  }
}

function appendLog(data) {
  fs.appendFile("log.txt", (lineBreak + data), function(err) {
      if (err) {
          return console.log(err);
      }
      // console.log("log.txt was updated!");
  });
}
//bands in town 
//if process.argv[2] is equal to concert-this then run the request for bands in town
//This will search the Bands in Town Artist Events API ("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp") for an artist and render the following information about each event to the terminal:


// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY
if (process.argv[2] == 'concert-this') {

  var queryUrl = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
  // console.log(queryUrl);
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var data = JSON.parse(body)[0];
      var output = " \nArtist: " + input.toUpperCase() + ", Venue: " + data.venue.name + ", Location: " + data.venue.city + ", Date of Event: " + moment(data.datetime).format("MM/DD/YYYY ");
      console.log(output);
      appendLog(output);
    }
  });
}
//OMDB MOVIE
// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie

if (process.argv[2] == 'movie-this') {
  // console.log(input);
  //if input is false
  if (process.argv[3] === undefined) {
    input = "Mr. Nobody";
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";
  console.log(queryUrl);
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode === 200) {

      var data = JSON.parse(body);
      var output = "\nTitle: " + data.Title + ", Release Year: " + data.Released + ", IMDB Rating: " + data.imdbRating + ", Rotten Tomatoes: " + data.Ratings[1].Value + "\nCountry: " + data.Country + ", Language: " + data.Language + "\nPlot: " + data.Plot + "\nActors: " + data.Actors;
  console.log(output);
  appendLog(output);
    }
  });
}

if (process.argv[2] === 'spotify-this-song') {
  if (process.argv[3] === undefined) {
    input = "The Sign by Ace of Base";
  }
  spotify.search({ type: 'track', query: input }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    else {
      var output = "\nArtist: " + data.tracks.items[0].album.artists[0].name + ", Song name: " + data.tracks.items[0].name + "\nExternal url: " + data.tracks.items[0].album.external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name;
      console.log(output);
      appendLog(output);
    }

  });
}

// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Edit the text in random.txt to test out the feature for movie-this and concert-this.

if (process.argv[2] === 'do-what-it-says') {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log('Error occurred: ' + err);
    }
    else {
      var dataArray = data.split(",");
      spotify.search({ type: 'track', query: dataArray[1] }, function (err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        else {
          var output = "\nArtist: " + data.tracks.items[0].album.artists[0].name + ", Song name: " + data.tracks.items[0].name + "\nExternal url: " + data.tracks.items[0].album.external_urls.spotify + "\nAlbum: " + data.tracks.items[0].album.name;
          console.log(output);
          appendLog(output);
        }

      });
    }
  });
}



