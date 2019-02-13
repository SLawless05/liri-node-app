require("dotenv").config();

//const keys = require("./keys.js");

const axios = require("axios");
const Spotify = require("node-spotify-api");
const fs = require("fs");

var spotify = new Spotify({
    id: "50bf9a8006594d1f86e59f61296c5f93",
    secret: "da1ac986e62f431ea66c9fca26ae7d3d"
});

//get input
var input = process.argv;
//splice it
input.splice(0, 2);

function liriRun(userInput) {

    var trimmedInput = userInput.slice(1);
    var inputString = trimmedInput.join("+");

    //switch cases
    switch (userInput[0]) {
        case "concert-this":
            bandsRun(inputString);
            break;
        case "spotify-this-song":
            spotifyRun(inputString);
            break;
        case "movie-this":
            omdbRun(inputString);
            break;
        case "do-what-it-says":
            doRun();
            break;
    }

}

//Movie API
function omdbRun(movieName) {

    var omdbQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(omdbQueryUrl).then(
        function (response) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log("Title: " + response.data.Title);
            console.log("Year the movie came out: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country prodcued in: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$");

            fs.appendFile("log.txt", JSON.stringify(response.data, null, 2), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("--log updated--");
            });
        }
    );

}

//Bands API
function bandsRun(bandName) {

    var bandQueryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";

    axios.get(bandQueryUrl).then(
        function (response) {
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city + " " + response.data[0].venue.region + " " + response.data[0].venue.country);
            console.log("Date: " + response.data[0].datetime);
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$");

            fs.appendFile("log.txt", JSON.stringify(response.data[0], null, 2), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("--log updated--");
            });
        }
    );

}

//Spoitify API
function spotifyRun(songName) {

    if (songName === null) {
        songName = "the+sign";
    }

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name)
        if (data.tracks.items[0].preview_url === null) {
            console.log("Link: " + data.tracks.items[0].album.artists[0].external_urls.spotify)
        }
        else {
            console.log("Preview: " + data.tracks.items[0].preview_url);
        }
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$");

        fs.appendFile("log.txt", JSON.stringify(data.tracks.items[0], null, 2), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("--log updated--");
        });
    });
}

// DO THIS 
function doRun() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) { return console.log(error); }
        var args = data.split(", ");

        liriRun(args);
    });

}

liriRun(input);