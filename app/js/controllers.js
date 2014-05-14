'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce', 'cacheService', function ($scope, Storie, Site, $sce, cacheService) {
        $scope.loading = true;
        $scope.showStoryIndex = 0;
        $scope.movedToNext = false;
        $scope.movedToPrevious = false;
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
                var first = true;
                angular.forEach(response.stories, function (story, key) {
                    story.unread = true;
                    story.animationClass = !first ? 'hide' : '';
                    var storyIndex = readStories.indexOf(story.id);
                    if (storyIndex != -1) {
                        story.unread = false;
                    }
                    $scope.stories.push(story);
                    readStories.push(story.id);
                    first = false;
                });
                cacheService.setData('readStories', readStories);
                $scope.loading = false;
            });
        };

        $scope.nextStory = function() {
            var storyIndex = $scope.showStoryIndex;
            if ( $scope.stories.length != ( storyIndex + 1 ) )
            {
                $scope.stories[storyIndex].animationClass = "animated fadeOutLeftBig";
                $scope.stories[storyIndex + 1].animationClass = "animated fadeInRightBig";
                $scope.showStoryIndex = storyIndex + 1;
            }
        }
        $scope.previousStory = function() {
            var storyIndex = $scope.showStoryIndex;
            if ( storyIndex !== 0 )
            {
                $scope.stories[storyIndex].animationClass = "animated fadeOutRightBig";
                $scope.stories[storyIndex - 1].animationClass = "animated fadeInLeftBig";
                $scope.showStoryIndex = storyIndex - 1;
            }
        }
    }]);
