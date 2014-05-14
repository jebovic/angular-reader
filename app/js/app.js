'use strict';


// Declare app level module which depends on filters, and services
angular
    .module('readerApp', [
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'readerApp.filters',
        'readerApp.services',
        'readerApp.directives',
        'readerApp.controllers',
        'infinite-scroll',
        'ui.bootstrap'
    ]).
    config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
        $routeProvider.when('/random', {templateUrl: 'partials/views/random.html', controller: 'RandomController'});
        $routeProvider.otherwise({redirectTo: '/random'});
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|chrome-extension):/);
    }]);
