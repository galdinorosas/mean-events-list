angular.module('dashboardApp')
    .controller('dashboardCtrl', ['$scope', 'api', function($scope, api) {
        api.getArtistData(function(res) {
            console.log('ctrl res:', res);
            $scope.events = res.data.events;
        });

        $scope.place = null;
        var inputFrom = document.getElementById('googlePlaces');
        var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
        google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
            var place = autocompleteFrom.getPlace();
            console.log('place', place);
            $scope.lat = place.geometry.location.lat();
            $scope.long = place.geometry.location.lng();
            api.locatedEvents($scope.lat, $scope.long, function(res) {
                $scope.events = res.data.located;
            });
        });


    }]);
