angular.module('myApp').controller('homeCtrl', ['$scope','$window', function($scope, $window) {
    $scope.go = function(path) {
        $window.location.href = path;
    };
}]);
