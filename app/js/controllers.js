'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce', function ($scope, Storie, Site, $sce) {
        $scope.loading = true;
        $scope.limit = 10;
        $scope.stories = [];
        $scope.limitButtons = {1: "Une à la fois", 10: "10 d'un coup", 25: "25 massif !", 50: "50 grosse caisse !"};
        $scope.sites = [];
        $scope.activeSites = [];
        $scope.templates = {
            'header': { url: 'partials/header.html'},
            'menuItems': { url: 'partials/menu/items.html'},
            'menuSites': { url: 'partials/menu/sites.html'},
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
        $scope.loadStories = function () {
            var siteIds = [];
            Storie.random({limit: $scope.limit, sites: siteIds.join(',')}, function (response) {
                angular.forEach($scope.stories, function (story, key) {
                    story.toAnimate = false;
                });
                angular.forEach(response.stories, function (story, key) {
                    story.toAnimate = false;
                    $scope.stories.push(story);
                });
                $scope.loading = false;
            });
        };
    }]);
