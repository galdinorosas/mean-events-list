angular.module('dashboardApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate', 'google.places'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: 'views/dashboard-view.html',
            controller: 'dashboardCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }]).factory('api', ['$http', function($http) {
        var api = {};
        api.getArtistData = function(cb) {
            $http({
                method: 'GET',
                url: '/token'
            }).then(function success(response) {
                    console.log('token:', response);

                    $http({
                        method: 'GET',
                        url: '/artistEvents',
                        params: {
                            token: response.data.token
                        }
                    }).then(function success(response) {
                            console.log('artistEvents response', response);
                            cb(response);
                        },
                        function error(err) {
                            console.log('error: ' + err);
                        });
                },
                function error(err) {
                    console.log('error: ' + err);
                });
        };

        api.locatedEvents = function(lat, long, cb) {
            $http({
                method: 'GET',
                url: '/eventSearch',
                params: {
                    lat: lat,
                    long: long
                }
            }).then(function success(response) {
                console.log('located res:', response);
                cb(response);
            }, function error(err) {
                console.log('located err:', err);
            });
        }

        return api;

    }]).directive('eventCard', function() {
        return {
            restrict: 'EA',
            templateUrl: 'views/event-card.html',
            scope: {
                events: '='
            }
        }
    })
    .controller('dashboardCtrl', ['$scope', 'api', function($scope, api) {
        console.log('dashboardctrl');

        api.getArtistData(function(res) {
            console.log('ctrl res:', res);
            $scope.events = res.data.events;
        });

        $scope.place = null;
        var inputFrom = document.getElementById('googlePlaces');
        var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
        google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
            var place = autocompleteFrom.getPlace();
            $scope.lat = place.geometry.location.lat();
            $scope.long = place.geometry.location.lng();

            console.log('place',place);
            api.locatedEvents($scope.lat,$scope.long,function(res){
                console.log('located results:', res);
                $scope.events = res.data.located;
            })
            $scope.$apply();
        });


    }]);
