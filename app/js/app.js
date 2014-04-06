'use strict';


// Declare app level module which depends on filters, and services
angular.module('readerApp', [
  'ngRoute',
  'ngSanitize',
  'readerApp.filters',
  'readerApp.services',
  'readerApp.directives',
  'readerApp.controllers',
  'infinite-scroll',
  'akoenig.deckgrid'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/random', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/random'});
}]);
