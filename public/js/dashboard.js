$(document).ready(function() {


    $('.gatheringInfo').css('display', 'block');

    /**
     * Jquery ajax call to the /userfollowedArtist endpoint to my server. This ajax call is fired immediately when
     * when the DOM is ready for scipting, which is when the server is going to get the entire list of the events of
     * the users followed artists.
     */

    $.get("/token", function() {})
        .done(function(token) {
            $.get("/artistEvents", {
                    token: token
                })
                .done(function(data) {
                    var result = data;
                    viewResults(result);
                    console.log('results:', result);
                })
                .fail(function() {
                    alert("error");
                });
        })
        .fail(function() {
            alert("error");
        });

    /**
     * This function will fire off within the userFollowedArtist endpoint success function.
     * @param {object} results - This is the artist event information object sent from the server.
     */
    var viewResults = function(results) {

        console.log('inside the viewResults function', results);
        $('.gatheringInfo').css('display', 'none');

        // If/else statement to check the total number of events. If the total number of events is zero,
        // then a message regarding the situation will appear. If the total number of events is anything other than
        // zero then the events will be appended to the events list.
        if (results.events.length === 0) {
            $('.zeroFollowedArtist').css("display", "block");
        } else {

            for (var i = 0; i < results.events.length; i++) {

                var piece = results.events[i];
                var venue = piece.venue;
                var name = piece.name;
                var event = piece.event;
                var location = piece.location;
                var date = piece.date;
                var url = piece.url;
                var image = piece.image;

                $('.eventList').append('<div class="media well well-lg" > <div class="media-right pull-right"> <a href="#"> <img class="media-object" src="' + image + '" alt="artistImage"> </a> </div> <div class="media-body"> <h3 class="media-heading">' + event + '</h4> <span class="eventDate">' + date + '</span> <span class="followedArtist">' + name + ' @ </span> <span class="eventVenue">' + venue + '</span> <span class="eventLocation">' + location + '</span> <a href="' + url + '" class="btn btn-info eventInfo" target="_blank">Event Information</a> </div> </div>');

            }
        }
    };


});



/**
 * This function calls the /artistLocationSearch endpoint and receives an object of events per location. The
 * location is based on the lat and long parameters.
 * @param {number} lat - latitude coordinates.
 * @param {number} long - longitude coordinates.
 */
var locationEventSearch = function(lat, long) {
    $.ajax({
        url: "/eventSearch",
        type: "get",
        data: { lat: lat, long: long },
        success: function(response) {
            console.log('response', response);
            $('.zeroLocatedArtists').css('display', 'none');
            $('.zeroFollowedArtist').css('display', 'none');
            $('.eventList').empty();

            if (response.located.length === 0) {

                $('.zeroLocatedArtists').css('display', 'block');

            } else {

                for (var n = 0; n < response.located.length; n++) {
                    var date = response.located[n].date;
                    var event = response.located[n].event;
                    var image = response.located[n].image;
                    var name = response.located[n].name;
                    var venue = response.located[n].venue;
                    var location = response.located[n].location;
                    var url = response.located[n].url;


                    console.log(response.located[0]);

                    $('.eventList').append('<div class="media well well-lg" > <div class="media-right pull-right"> <a href="#"> <img class="media-object" src="' + image + '" alt="artistImage"> </a> </div> <div class="media-body"> <h3 class="media-heading">' + event + '</h4> <span class="eventDate">' + date + '</span> <span class="followedArtist">' + name + ' @ </span> <span class="eventVenue">' + venue + '</span> <span class="eventLocation">' + location + '</span> <a href="' + url + '" class="btn btn-info eventInfo" target="_blank">Event Information</a> </div> </div>');

                }
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });

};

/**
 * This is the google maps autocomplete function which is called from the html google script tag. This function
 * needs to be outside of the document.ready function because the html script tag is called before the DOM is
 * completely ready for scripting.
 */
function locationAutocomplete() {
    var input = /** @type {!HTMLInputElement} */
        (document.getElementById('pac-input'));
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {

        var place = autocomplete.getPlace();
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        locationEventSearch(lat, lng);

        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
    });
}
