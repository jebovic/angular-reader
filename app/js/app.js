'use strict';


// Declare app level module which depends on filters, and services
angular
    .module('readerApp', [
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ngAnimate',
        'readerApp.config',
        'readerApp.filters',
        'readerApp.api',
        'readerApp.services',
        'readerApp.directives',
        'readerApp.controllers',
        'readerApp.animation',
        'angular-loading-bar',
        'ui.bootstrap'
    ]).
    config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
        $routeProvider.when('/ordered', {templateUrl: 'partials/story/layout.html', controller: 'OrderedController'});
        $routeProvider.when('/favorites', {templateUrl: 'partials/story/layout.html', controller: 'FavsController'});
        $routeProvider.when('/random', {templateUrl: 'partials/story/layout.html', controller: 'RandomController'});
        $routeProvider.otherwise({redirectTo: '/ordered'});
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
    }])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);
