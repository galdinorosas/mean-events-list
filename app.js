var express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    unirest = require('unirest'),
    session = require('express-session'),
    passport = require('passport'),
    env = require('dotenv').config(),
    SpotifyStrategy = require('./lib/passport-spotify/index').Strategy,
    api = require('./server/utilities/api.js'),
    filter = require('./server/utilities/data-filter.js'),
    token,
    controllers = require('./server/controllers/events.js'),
    routes = require('./server/routes/routes.js');



passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_APP_KEY,
        clientSecret: process.env.SPOTIFY_APP_SECRET,
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

app.use('/', routes);

app.get('/token', function(req,res){
    return res.status(200).json({ token: token });
});

app.listen(8080, function() {
    console.log('Please navigate to http://localhost:8080');
});
