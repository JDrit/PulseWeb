'use strict';

angular.module('pulse.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'search/search.html',
    controller: 'SearchController'
  });
}])

.controller('SearchController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    console.log("search controller");
    $scope.results = [];

    $scope.boldText = function (text) {
        var htmlText;
        var regex = RegExp('freshmen', 'gi')
        var replacement = '<strong>$&</strong>';
        htmlText = $sce.trustAsHtml(text.replace(regex, replacement));
        return htmlText;
    };


    $scope.submit = function() {
        var search = $scope.form.search;
        console.log("submitting search for: " + search);
        $http.get("http://127.0.0.1:8080/api/search?search=" + search).then(
            function(response) {
                console.log(response);
                $scope.results = response.data;
            },
            function(error) {
                console.log(error);
            }
        );
    };
}]);
