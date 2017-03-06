angular.module('myApp', ['ui.bootstrap', 'ngRoute', 'ngAnimate','angularCSS'])
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: 'views/login-view.html',
            controller: 'homeCtrl',
            css: 'stylesheets/login.css'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }])
    .controller('homeCtrl', ['$scope', '$http', '$rootScope', '$location', '$window', function($scope, $http, $rootScope, $location, $window) {
        console.log('homectrl');
        $scope.go = function(path) {
            $window.location.href = path;
        };

        $scope.clear = function() {
            $scope.name = '';
            $scope.age = null;
        };
        $scope.addToMongo = function() {
            $http({
                method: 'POST',
                url: '/people',
                data: {
                    name: $scope.name,
                    age: $scope.age
                }
            }).then(function success(response) {
                    window.post = response;
                    console.log('My name is ' + response.data.name + ', I am ' + response.data.age);
                },
                function error(err) {
                    console.log('error: ' + err);
                });

            $scope.clear();
        };

        $scope.readFromMongo = function() {
            $http({
                method: 'GET',
                url: '/read',
                params: {
                    name: $scope.name,
                    age: $scope.age
                }
            }).then(function success(response) {
                    window.get = response;
                    console.log('My name is ' + response.data.name + ', I am ' + response.data.age);
                },
                function error(err) {
                    console.log('error: ' + err);
                });
            $scope.clear();
        };

        $scope.deleteFromMongo = function() {
            $http.delete('/delete').then(function success(response) {
                    console.log(response);
                },
                function error(err) {
                    console.log('error: ' + err);
                });
            $scope.clear();
        };

    }]);
