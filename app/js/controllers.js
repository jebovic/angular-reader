'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce', 'cacheService', function ($scope, Storie, Site, $sce, cacheService) {
        $scope.loading = true;
        $scope.showStoryIndex = 0;
        $scope.movedToNext = false;
        $scope.movedToPrevious = false;
        $scope.limit = 25;
        $scope.stories = [];
        $scope.limitButtons = [
            { limit: 25, text: "25 stories" },
            { limit: 50, text: "50 stories" },
            { limit: 100, text: "100 stories" },
            { limit: 200, text: "200 stories" }
        ];
        $scope.sites = [];
        $scope.activeSites = [];
        $scope.firstLoad = true;
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
            /* $scope.stories = []; */
            $scope.showStoryIndex = 0;
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
                    story.unread = true;
                    story.animationClass = 'hide';
                    var storyIndex = readStories.indexOf(story.id);
                    if (storyIndex != -1) {
                        story.unread = false;
                    }
                    $scope.stories.push(story);
                    readStories.push(story.id);
                });
                cacheService.setData('readStories', readStories);
                $scope.loading = false;
                if ( $scope.firstLoad )
                {
                    $scope.showFirst();
                }
                $scope.firstLoad = false;
            });
        };

        $scope.nextStory = function() {
            var storyIndex = $scope.showStoryIndex;
            if ( $scope.stories.length != ( storyIndex + 1 ) )
            {
                $scope.stories[storyIndex].animationClass = "animated fadeOutLeft";
                $scope.stories[storyIndex + 1].animationClass = "animated fadeInRight";
                $scope.showStoryIndex = storyIndex + 1;
            }
            if ( $scope.stories.length < ( storyIndex + 8 ) && $scope.loading === false )
            {
                $scope.loadMore();
            }
        };
        $scope.previousStory = function() {
            var storyIndex = $scope.showStoryIndex;
            // MARK read
            if ( storyIndex !== 0 )
            {
                $scope.stories[storyIndex].animationClass = "animated fadeOutRight";
                $scope.stories[storyIndex - 1].animationClass = "animated fadeInLeft";
                $scope.showStoryIndex = storyIndex - 1;
            }
        };
        $scope.navigate = function( event ) {
            if ( event.keyCode == 37 )
            {
                $scope.previousStory();
            }
            if ( event.keyCode == 39 )
            {
                $scope.nextStory();
            }
        };
        $scope.showFirst = function() {
            $scope.stories[0].animationClass = "animated fadeInRight";
        };
        $scope.showLast = function() {
            $scope.showStoryIndex = $scope.stories.length - 1;
        };

        $('body').keydown(function (e) {
            $scope.$apply(function () {
                $scope.navigate(e);
            })
        });
    }]);
