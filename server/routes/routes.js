var express = require('express');
var router = express.Router();
var controllers = require('../controllers/events.js');
var passport = require('passport');

/**
 * GET : auth-spotify
 * Authenticate with spotify using passportJS.
 */
router.get('/auth/spotify',
    passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private', 'user-follow-read'] /*,  showDialog: true */ }),
    function(req, res) {
        // The request will be redirected to spotify for authentication, so this
        // function will not be called.
    });

/**
 * GET : auth-spotify-callback
 * PassportJS Spotify authentication 
 */
router.get('/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/dashboard.html');
    });

/**
 * for the userFollowedArtists endpoint, favorite artist events list is created.
 */
router.get('/artistEvents', controllers.getArtistEventsData);

/**
 * artistLocationSearch endpoint is called whenever a user does a geolocation search for events.
 */
router.get('/eventSearch', controllers.filterEventsPerLocation);

/**
 * The logout endpoint will log the user out of the session and redirect to the landing page.
 */
router.get('/logout', controllers.logoutUser);

module.exports = router;