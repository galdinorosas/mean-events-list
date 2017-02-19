var api = require('../utilities/api.js');
var filter = require('../utilities/data-filter.js');
var async = require('async');
var appData = {
    userFollowedArtists: [],
    artistEventsInfo: []
}

/**
 * Filters through all events based on searched location.
 */
var filterEventsPerLocation = function(req, res) {
    var requestedLat = parseFloat(req.query.lat);
    var requestedLong = parseFloat(req.query.long);
    var locArtistEventsInfo = filter.eventsPerLocation(requestedLat, requestedLong, appData.artistEventsInfo);
    var dateAndLocSortedResults = filter.sortByDate(locArtistEventsInfo);
    res.status(200).json({ located: dateAndLocSortedResults });

    console.log('user followed artists', appData.userFollowedArtists.length);
    console.log('artist events info', appData.artistEventsInfo.length);
}

/**
 * Use Spotify and Songkick API to collect event information.
 */
var getArtistEventsData = function(req, res) {
    var artistEventResults = [];
    var favoriteArtists = api.getFavoriteArtists('me/following', {
        type: 'artist'
    }, req.query.token.token);
    favoriteArtists.on('end', function(data) {
        req.session.followObj = data;
        appData.userFollowedArtists = data.artists.items;
        if (appData.userFollowedArtists.length === 0) {
            return res.status(200).json({ events: [] });
        } else {
            async.each(appData.userFollowedArtists, function(item, callback) {
                api.getArtistCalendars(item.name, function(err, results) {
                    if (err) {} else {
                        artistEventResults.push(results);
                        callback();
                    }
                });
            }, function(err) {
                console.log('user followed artists', appData.userFollowedArtists.length);
    console.log('artist events info', appData.artistEventsInfo.length);
                appData.artistEventsInfo = filter.cleanUpEvents(artistEventResults, appData.userFollowedArtists);
                return res.status(200).json({ events: filter.initArtistList(artistEventResults, appData.userFollowedArtists) });
            })
        }
    });
    favoriteArtists.on('error', function(data) {
        console.log('user follow search error event', data);
    });
}

var logoutUser = function(req,res){
    req.session.followObj = [];
    req.logout();
    // Delete all cookies : next step
    res.redirect('/');
}

module.exports = {
    filterEventsPerLocation : filterEventsPerLocation,
    getArtistEventsData : getArtistEventsData,
    logoutUser : logoutUser
}
