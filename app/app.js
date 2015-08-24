'use strict';

// Declare app level module which depends on views, and components
angular.module('pulse', [
  'ngRoute',
  'pulse.search',
  'ui.bootstrap'
]).
config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $routeProvider.otherwise({redirectTo: '/'});
}]);
