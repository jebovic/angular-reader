'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
  .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce',function($scope, Storie, Site, $sce) {
    $scope.loading = true;
    $scope.limit = 10;
    $scope.stories = [];
    $scope.limitButtons = {1: "1 item", 10: "10 items", 25: "25 items", 50: "50 items"};
    $scope.sites = [];
    $scope.activeSites = [];
    Site.query({},function( response ){
        angular.forEach(response.sites, function(value, key){
            $scope.sites.push(value);
            $scope.activeSites.push(value);
        });
        $scope.loadMore();
    });
    $scope.imageExists = function(hash) {
        return hash.length > 0;
    };

    $scope.toggleSite = function(site) {
        var toggleIndex = $scope.activeSites.indexOf(site);
        if ( toggleIndex != -1 )
        {
            $scope.activeSites.splice(toggleIndex, 1);
        }
        else {
            $scope.activeSites.push(site);
        }
        $scope.reload( $scope.limit );
        return true;
    };
    $scope.loadMore = function() {
        $scope.loading = true;
        this.loadStories();
    };
    $scope.reload = function( limit ) {
        $scope.loading = true;
        $scope.limit = limit;
        $scope.stories = [];
        $scope.loadStories();
    };
    $scope.loadStories = function() {
        var siteIds = [];
        angular.forEach($scope.activeSites, function(value, key){
            siteIds.push(value.id);
        });
        Storie.random({limit: $scope.limit, sites: siteIds.join(',')},function( response ){
            angular.forEach($scope.stories, function(value, key){
                value.toAnimate = false;
            });
            angular.forEach(response.stories, function(value, key){
                value.toAnimate = true;
                $scope.stories.push(value);
            });
            $scope.loading = false;
        });
    };
  }]);
