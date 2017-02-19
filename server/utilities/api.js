var events = require('events'),
    unirest = require('unirest');

/**
 * Represents API call to Spotify which will return a object of the users following artists.
 * @constructor
 * @param {string} endpoint - Spotify user following artists endpoint.
 * @param {object} args - Spotify required arguments object.
 */
var getFavoriteArtists = function(endpoint, args, apiToken) {
    var emitter = new events.EventEmitter();
    var accToken = "Bearer " + apiToken;
    unirest.get('https://api.spotify.com/v1/' + endpoint)
        .headers({ 'Authorization': accToken })
        .qs(args)
        .end(function(response) {
            if (response.ok) {
                emitter.emit('end', response.body);
            } else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
};

/**
 * Represents asynchronous API execution of getting specific artist calendar events.
 * @constructor
 * @param {string} artistName - The desired artist name.
 * @param {function} cb - The callback function which will fire off when the end event is executed.
 */
var getArtistCalendars = function(artistName, cb) {
    unirest.get('http://api.songkick.com/api/3.0/events.json')
        .qs({
            artist_name: artistName,
            apikey: process.env.SONGKICK_API_KEY
        })
        .end(function(response) {
            if (response.ok) {
                response.body.artistName = artistName;
                cb(null, response.body);
            } else {
                cb(err);
            }
        });
};

module.exports = {
    getFavoriteArtists : getFavoriteArtists,
    getArtistCalendars : getArtistCalendars
}