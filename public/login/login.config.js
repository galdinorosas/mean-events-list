angular.module('myApp')
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: './login/login-view.html',
            controller: 'homeCtrl',
            css: './stylesheets/login/login.css'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }]);