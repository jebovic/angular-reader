'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce', 'cacheService', function ($scope, Storie, Site, $sce, cacheService) {
        $scope.loading = true;
        $scope.limit = 10;
        $scope.stories = [];
        $scope.limitButtons = {1: "1", 10: "10", 25: "25", 50: "50"};
        $scope.sites = [];
        $scope.activeSites = [];
        $scope.templates = {
            'header': { url: 'partials/header.html'},
            'settings': { url: 'partials/menu/settings.html'},
            'storyListItem': {url: 'partials/story/list-item.html'}
        };
        Site.query({}, function (response) {
            angular.forEach(response.sites, function (value, key) {
                $scope.sites.push(value);
                $scope.activeSites.push(value);
            });
            $scope.loadMore();
        });
        $scope.imageExists = function (hash) {
            return hash.length > 0;
        };

        $scope.toggleSite = function (site) {
            var toggleIndex = $scope.activeSites.indexOf(site);
            if (toggleIndex != -1) {
                $scope.activeSites.splice(toggleIndex, 1);
            }
            else {
                $scope.activeSites.push(site);
            }
            $scope.reload($scope.limit);
            return true;
        };
        $scope.loadMore = function () {
            $scope.loading = true;
            this.loadStories();
        };
        $scope.reload = function (limit) {
            $scope.loading = true;
            $scope.limit = limit;
            $scope.stories = [];
            $scope.loadStories();
        };
        $scope.isRead = function( bool ) {
            return bool ? 'fa-square' : 'fa-square-o';
        };
        $scope.loadStories = function () {
            var siteIds = [];
            angular.forEach($scope.activeSites, function(value, key){
                siteIds.push(value.id);
            });
            var cachedStories = cacheService.getData('readStories');
            var readStories = cachedStories ? angular.fromJson(cachedStories) : [];
            Storie.random({limit: $scope.limit, sites: siteIds.join(',')}, function (response) {
                angular.forEach(response.stories, function (story, key) {
                    story.toAnimate = false;
                    story.unread = true;
                    var storyIndex = readStories.indexOf(story.id);
                    if (storyIndex != -1) {
                        story.unread = false;
                    }
                    $scope.stories.push(story);
                    readStories.push(story.id);
                });
                cacheService.setData('readStories', readStories);
                $scope.loading = false;
            });
        };
    }]);
