var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var unirest = require('unirest'),
    events = require('events'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    env = require('dotenv').config(),
    SpotifyStrategy = require('./lib/passport-spotify/index').Strategy,
    async = require('async');

var api = require('./modules/api.js');
var filter = require('./modules/data-filter.js');
var appKey = process.env.SPOTIFY_APP_KEY;
var appSecret = process.env.SPOTIFY_APP_SECRET;
var token;
var appData = {
    userFollowedArtists : [],
    artistEventsInfo : []
}

/**
 * Filters through all events based on searched location.
 */
var filterEventsPerLocation = function(req,res){
    var requestedLat = parseFloat(req.query.lat);
    var requestedLong = parseFloat(req.query.long);
    var locArtistEventsInfo = filter.eventsPerLocation(requestedLat, requestedLong, appData.artistEventsInfo);
    var dateAndLocSortedResults = filter.sortByDate(locArtistEventsInfo);
    res.status(200).json({ located: dateAndLocSortedResults });
}

/**
 * Use Spotify and Songkick API to collect event information.
 */
var getArtistEventsData = function(req,res){
    var artistEventResults = [];
    var favoriteArtists = api.getFavoriteArtists('me/following', {
        type: 'artist'
    }, token);
    favoriteArtists.on('end', function(data) {
        req.session.followObj = data;
        appData.userFollowedArtists = data.artists.items;
        if (appData.userFollowedArtists.length === 0) {
            return res.status(200).json({ events: [] });
        } else {
            async.each(appData.userFollowedArtists, function(item, callback){
                api.getArtistCalendars(item.name, function(err, results) {
                    if (err) {
                    } else {
                        artistEventResults.push(results);
                        callback();
                    }
                });
            }, function(err){
                appData.artistEventsInfo = filter.cleanUpEvents(artistEventResults, appData.userFollowedArtists);
                return res.status(200).json({ events: filter.initArtistList(artistEventResults, appData.userFollowedArtists) });
            })
        }
    });
    favoriteArtists.on('error', function(data) {
        console.log('user follow search error event',data);
    });
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SpotifyStrategy({
        clientID: appKey,
        clientSecret: appSecret,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL

    },
    function(accessToken, refreshToken, profile, done) {
        token = accessToken;
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

/**
 * GET : auth-spotify
 * Authenticate with spotify using passportJS.
 */
app.get('/auth/spotify',
    passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private', 'user-follow-read'] /*,  showDialog: true */ }),
    function(req, res) {
        // The request will be redirected to spotify for authentication, so this
        // function will not be called.
    });

/**
 * GET : auth-spotify-callback
 * PassportJS Spotify authentication 
 */
app.get('/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/dashboard.html');
    });

/**
 * for the userFollowedArtists endpoint, favorite artist events list is created.
 */
app.get('/userFollowedArtists', getArtistEventsData);

/**
 * artistLocationSearch endpoint is called whenever a user does a geolocation search for events.
 */
app.get('/artistLocationSearch', filterEventsPerLocation);

app.listen(8080, function() {
    console.log('Please navigate to http://localhost:8080');
});

/**
 * The logout endpoint will log the user out of the session and redirect to the landing page.
 */
app.get('/logout', function(req, res) {
    req.logout();
    req.session.followObj = [];
    res.redirect('/');
});
