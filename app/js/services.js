'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('readerApp.services', ['ngResource']).
  value('version', '0.1')
  .factory('Storie', ['$resource',
    function($resource){
      return $resource('http://api.reader.loc/stories', {limit:'@limit', sites: '@sites'}, {
        query: {method:'GET', params:{limit:10, sites:[]}},
        random: {url:'http://api.reader.loc/stories/random', method:'GET',params:{limit:10, sites:[]}}
      });
    }])
    .factory('Site', ['$resource',
        function($resource){
            return $resource('http://api.reader.loc/sites', {}, {
                query: {method:'GET', params:{}}
            });
        }]);
