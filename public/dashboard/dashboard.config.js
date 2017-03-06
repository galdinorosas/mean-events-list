angular.module('dashboardApp')
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.when('/', {
            templateUrl: './dashboard/dashboard-view.html',
            controller: 'dashboardCtrl',
            css: './stylesheets/dashboard/dashboard.css'
        });

        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }]);
