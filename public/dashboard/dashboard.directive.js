angular.module('dashboardApp')
    .directive('eventCard', function() {
        return {
            restrict: 'EA',
            templateUrl: './dashboard/event-card.html',
            scope: {
                event: '='
            },
            css: './stylesheets/dashboard/event-card.css',
            link: function(scope, element, attrs){
                element.bind('click', function(){
                    console.log('directive scope',scope);
                    window.open(scope.event.url,'_blank');
                });
            }
        };
    });
