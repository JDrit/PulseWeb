'use strict';

angular.module('pulse.search', ['ngRoute', 'pulse.config', 'ui.bootstrap.tpls'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'search/search.html',
    controller: 'SearchController'
  });
}])

.controller('SearchController', ['$scope', '$http', '$sce', 'config', function($scope, $http, $sce, config) {
    $scope.results = [];
    $scope.boldWords = "";
    $scope.numFound = -1;
    $scope.start = 0;
    $scope.limit = 20;
    $scope.images = {};

    $scope.boldText = function (text) {
        var htmlText;
        var regex = RegExp($scope.boldWords, 'gi')
        var replacement = '<strong>$&</strong>';
        htmlText = $sce.trustAsHtml(text.replace(regex, replacement));
        return htmlText;
    };

    $scope.getTitle = function(result) {
        if (result['metaData']['title'] != null) {
            return result['metaData']['title'];
        } else {
            return result['location'];
        }
    }

    $scope.pageRange = function(start, end) {
        var arr = [];
        if (start >= 3) {
            arr.push(start - 3);
        }
        if (start >= 2) {
            arr.push(start - 2);
        }
        if (start >= 1) {
            arr.push(start - 1);
        }
        while (start < end) {
            arr.push(start);
            if (arr.length >= 10) {
                $scope.extendedPage = true;
                return arr;
            }
            start +=  1;
        }
        $scope.extendedPage = false;
        return arr;
    }

    $scope.getRaw = function(result) {
        return config.apiServer + "api/get_data?moduleName=" + result['moduleName'] +
            "&moduleId=" + result['moduleId'] + "&timestamp=" + Date.parse(result['timestamp'])
    }

    $scope.isUndefined = function (thing) {
        return (typeof thing === "undefined");
    };

    $scope.sourceChange = function(source) {
        $scope.source = source;
        $scope.submit();
    }

    $scope.sourceReset = function() {
        $scope.source = "tag -= image";
        $scope.submit();
    }

    $scope.updateSearch = function(offset) {
        $scope.start = offset;
        $scope.submit();
    }

    $scope.nextPage = function() {
        $scope.start += $scope.limit;
        $scope.submit();
    }

    $scope.lastPage = function() {
        $scope.start -= $scope.limit;
        $scope.submit();
    }

    $scope.getImages = function(albumId) {
        if (albumId in $scope.images) {
            return $scope.images[albumId];
        } else {
            var images = [];
            $http.get(config.apiServer + "api/search?limit=8&search=moduleName=images%20tags=image%20tags=" + albumId).then(function(response) {
                var results = response.data['results'];
                if (results.length > 0) {
                    var urls = [];
                    for (var i = 0 ; i < results.length ; i++) {
                        urls.push(config.apiServer + "api/get_data?moduleName=images&moduleId=" + results[i]['moduleId'] + "&timestamp=" + Date.parse(results[i]['timestamp']));
                    }
                    $scope.images[albumId] = urls;
                }
            });
        }
    }

    $scope.submit = function() {
        var search = $scope.form.search;
        if ($scope.source != null) {
            console.log(search.indexOf('='));
            if (search.indexOf('=') != -1 || search.indexOf('~') != -1) {
                search = $scope.source + " " + search;
            } else {
                search = $scope.source + ", " + search;
            }
        }
        $scope.boldWords = "(" + search.replace(/ /g, "|") + ")";
        console.log("searching with " + search);
        $http.get(config.apiServer + "api/search?limit=" + $scope.limit +
            "&offset=" + $scope.start + "&search=" + search).then(
            function(response) {
                $scope.results = response.data.results;
                $scope.numFound = response.data.numFound;
                $scope.start = response.data.start;
                $scope.limit = response.data.limit;
            },
            function(error) {
                console.log(error);
            }
        );
    };
}]);

