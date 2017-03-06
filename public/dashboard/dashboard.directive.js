angular.module('dashboardApp')
    .directive('eventCard', function() {
        return {
            restrict: 'EA',
            templateUrl: './dashboard/event-card.html',
            scope: {
                events: '='
            },
            css: './stylesheets/dashboard/event-card.css'
        };
    });
