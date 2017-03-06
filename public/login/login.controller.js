angular.module('myApp').controller('homeCtrl', ['$scope', function($scope) {
    $scope.go = function(path) {
        $window.location.href = path;
    };
}]);
