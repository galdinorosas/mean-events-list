/**
 * Represents the distance (in miles) between 2 geolocations (longitude and latitude).
 */
function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist;
}

/**
 * Represents a date format change.
 */
var dateReform = function(date) {
    var dateArray = date.split('-');
    var newDate = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
    return newDate;
};

/**
 * Represents finding index of array which contains a specific object property value.
 */
var findWithAttr = function(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}

/**
 * returns filtered array of events based on searched location.
 */
var eventsPerLocation = function(lat, lng, arr) {
    return arr.filter(function(el){
        var eventDistance = distance(lat, lng, el.latitude, el.longitude);
        if (eventDistance < 75) {
            return el;
        }
    })
};


/**
 * Sort array of events by date.
 */
function sortByDate(arr){
    var sortedArr = arr.sort(function(a, b) {
        var aa = a.date.split('/'),
            bb = b.date.split('/');
        aa = [aa[2], aa[0], aa[1]],
        bb = [bb[2], bb[0], bb[1]];
        var cc = parseInt(aa.join(''));
        var dd = parseInt(bb.join(''));
        return cc < dd ? -1 : (cc > dd ? 1 : 0);
    })
    return sortedArr;
};

/**
 * Display 10 sorted events when first landing on dashboard page.
 */
var initArtistList = function(allEventList, artists) {
    var firstTenArtistsArray = [];
    var filteredList = [];
    filteredList = cleanUpEvents(allEventList,artists);
    filteredList = sortByDate(filteredList);
    for (var i = 0; i < 10; i++) {
        var piece = filteredList[i];
        firstTenArtistsArray.push({ name: piece.name, event: piece.event, location: piece.location, date: piece.date, url: piece.url, longitude: piece.longitude, latitude: piece.latitude, image: piece.image, venue: piece.venue});
    }
    return firstTenArtistsArray;
};

/**
 * Clean up event data.
 */
var cleanUpEvents = function(allEvents, artists) {
    var eventsOfInterest = [];
    allEvents.forEach(function(el,i,arr){
        var name = el.artistName;
        var imageIndex = findWithAttr(artists, "name", name);
        var imageURL = artists[imageIndex].images[0].url;
        var sect = el.resultsPage.results.event;
        var longitude,
            latitude,
            eventName = "",
            location = "",
            eventDate = "",
            url = "",
            venue = "";
        if (el.resultsPage.totalEntries === 0) {
            eventName = "N/A";
            location = "N/A";
            eventDate = "N/A";
            url = "N/A";
            venue = "N/A";
        } else {
            sect.forEach(function(el, i, arr){
                venue = el.venue.displayName;
                eventName = el.displayName;
                location = el.location.city;
                longitude = el.location.lng;
                latitude = el.location.lat;
                eventDate = dateReform(el.start.date);
                url = el.uri;
                eventsOfInterest.push({ name: name, event: eventName, location: location, longitude: longitude, latitude: latitude, date: eventDate, url: url, venue: venue, image: imageURL });
            })
        }
    });
    return eventsOfInterest;
};

module.exports = {
    distance : distance,
    dateReform : dateReform,
    findWithAttr : findWithAttr,
    eventsPerLocation : eventsPerLocation,
    sortByDate : sortByDate,
    initArtistList : initArtistList,
    cleanUpEvents : cleanUpEvents
}