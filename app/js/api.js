'use strict';

/* API */

angular.module('readerApp.api', ['ngResource'])
    .factory('DataProvider', ['$resource','readerConfig', function ($resource, readerConfig) {
        return {
            story:  $resource( readerConfig.getApiUrl() +'/stories', {limit: '@limit', sites: '@sites'}, {
                query: {method: 'GET', params: {limit: 10, sites: []}},
                random: {url: readerConfig.getApiUrl() +'/stories/random', method: 'GET', params: {limit: 10, sites: []}},
                ordered: {url: readerConfig.getApiUrl() +'/stories/ordered', method: 'GET', params: {limit: 10, offset:0, sites: []}}
            }),
            site:  $resource(readerConfig.getApiUrl() + '/sites', {}, {
                query: {method: 'GET', params: {}}
            })
        }
    }])
    .factory('UserAPI', ['$http','readerConfig', function ($http, readerConfig) {
        return {
            signIn: function(authResult) {
                return $http.post(readerConfig.getApiUrl() +'/user/connect', authResult);
            },
            disconnect: function() {
                return $http.post(readerConfig.getApiUrl() +'/user/disconnect');
            }
        }
    }]);