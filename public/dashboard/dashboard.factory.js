angular.module('dashboardApp')
    .factory('api', ['$http', function($http) {
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
                cb(response);
            }, function error(err) {
                console.log('located err:', err);
            });
        };

        return api;

    }]);
