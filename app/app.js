'use strict';


// Declare app level module which depends on views, and components
angular.module('pulse', [
  'ngRoute',
  'pulse.search',
  'pulse.config',
  'ui.bootstrap'
]).
config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
}]);
