'use strict';


// Declare app level module which depends on filters, and services
angular.module('readerApp', [
  'ngRoute',
  'ngSanitize',
  'readerApp.filters',
  'readerApp.services',
  'readerApp.directives',
  'readerApp.controllers',
  'infinite-scroll'
]).
config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {
  $routeProvider.when('/random', {templateUrl: 'partials/random.html', controller: 'RandomController'});
  $routeProvider.otherwise({redirectTo: '/random'});
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
}]);
