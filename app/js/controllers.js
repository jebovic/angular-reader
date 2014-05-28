'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    //cacheService.setData('newbie', false);
    .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce', 'cacheService', 'helpCenter', '$modal', function ($scope, Storie, Site, $sce, cacheService, helpCenter, $modal) {
        /******************************************************************
         * Configuration & Initialization
         ******************************************************************/
        $scope.loading = true;
        $scope.firstLoad = true;
        $scope.isNewbie = cacheService.getData('newbie') ? cacheService.getData('newbie') : true;
        $scope.limitButtons = [
            { limit: 25, text: "25 stories" },
            { limit: 50, text: "50 stories" },
            { limit: 100, text: "100 stories" },
            { limit: 200, text: "200 stories" }
        ];
        $scope.templates = {
            'header': { url: 'partials/header.html'},
            'settings': { url: 'partials/menu/settings.html'},
            'help': { url: 'partials/help/overlay.html'},
            'helpBlock': { url: 'partials/help/block.html'},
            'storyListItem': {url: 'partials/story/list-item.html'}
        };

        /******************************************************************
         * Help center
         ******************************************************************/
        $scope.activeHelpCenter = function(){
            helpCenter.display();
        };
        $scope.dismissHelpCenter = function(){
            helpCenter.dismiss();
        };
        $scope.isActiveHelpCenter = function(){
            return helpCenter.active;
        };
        $scope.blocksHelpCenter = function(){
            return helpCenter.blocks;
        };

        /******************************************************************
         * Reading center
         ******************************************************************/
        /* Stories init */
        $scope.showStoryIndex = 0;
        $scope.direction = 'left';
        $scope.limit = 25;
        $scope.stories = [];
        /* Sites init */
        $scope.sites = [];
        $scope.activeSites = cacheService.getData('activeSites') ? angular.fromJson(cacheService.getData('activeSites')) : [];
        /* Utils functions */
        $scope.imageExists = function (hash) {
            return hash.length > 0;
        };
        $scope.storyImageStyle = function(imageId) {
            return {
                'background-image': 'url(http://reader.loc/uploads/images/'+imageId+')'
            }
        };
        $scope.isRead = function (bool) {
            return bool ? 'fa-square' : 'fa-square-o';
        };
        $scope.loadMore = function () {
            $scope.loading = true;
            this.loadStories();
        };
        /* Loading functions */
        $scope.reload = function (limit) {
            $scope.loading = true;
            $scope.limit = limit;
            $scope.loadStories();
            $scope.showStoryIndex = 0;
        };
        $scope.purgeStories = function () {
            $scope.firstLoad = true;
            $scope.stories = [];
        };
        $scope.loadStories = function () {
            var cachedStories = cacheService.getData('readStories');
            var readStories = cachedStories ? angular.fromJson(cachedStories) : [];
            Storie.random(
                {
                    limit: $scope.limit,
                    sites: $scope.activeSites.join(',')
                },
                function (response) {
                    angular.forEach(response.stories, function (story, key) {
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
                    if ($scope.firstLoad) {
                        $scope.showFirst();
                    }
                    $scope.firstLoad = false;
                }
            );
        };
        /* Favs management */
        $scope.favStoryIds = cacheService.getData('favStoryIds') ? angular.fromJson(cacheService.getData('favStoryIds')) : [];
        $scope.favStories = cacheService.getData('favStories') ? angular.fromJson(cacheService.getData('favStories')) : [];
        $scope.toggleFav = function() {
            var currentStory = $scope.stories[$scope.showStoryIndex];
            var currentStoryId = currentStory.id;
            var storyIndex = $scope.favStoryIds.indexOf(currentStoryId);
            if (storyIndex != -1) {
                $scope.favStoryIds.splice(storyIndex, 1);
                $scope.favStories.splice(storyIndex, 1);
            }
            else {
                $scope.favStoryIds.push(currentStoryId);
                $scope.favStories.push(currentStory);
            }
            cacheService.setData('favStoryIds', $scope.favStoryIds);
            cacheService.setData('favStories', $scope.favStories);
        };
        $scope.storieInFavs = function() {
            if ( $scope.stories.length )
            {
                var currentStoryId = $scope.stories[$scope.showStoryIndex].id;
                var storyIndex = $scope.favStoryIds.indexOf(currentStoryId);
                return storyIndex != -1 ? 'fa-star' : 'fa-star-o';
            }
        };
        /* Stories navigation */
        $scope.nextStory = function () {
            var storyIndex = $scope.showStoryIndex;
            $scope.direction = 'left';
            if ($scope.stories.length != ( storyIndex + 1 )) {
                $scope.stories[storyIndex].unread = false;
                $scope.showStoryIndex = storyIndex + 1;
            }
            if ($scope.stories.length < ( storyIndex + 8 ) && $scope.loading === false) {
                $scope.loadMore();
            }
        };
        $scope.previousStory = function () {
            var storyIndex = $scope.showStoryIndex;
            $scope.direction = 'right';
            if (storyIndex !== 0) {
                $scope.stories[storyIndex].unread = false;
                $scope.showStoryIndex = storyIndex - 1;
            }
        };
        $scope.showFirst = function () {
            $scope.showStoryIndex = 0;
        };
        $scope.showLast = function () {
            $scope.showStoryIndex = $scope.stories.length - 1;
        };

        /******************************************************************
         * Modals
         ******************************************************************/
        $scope.openGetMore = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/story/get-more.html',
                controller: "ModalGetMoreCtrl",
                size: size,
                resolve: {
                    limitButtons: function () {
                        return $scope.limitButtons;
                    }
                }
            });
            modalInstance.result.then(function (selectedLimit) {
                $scope.reload(selectedLimit);
            }, function () {
                /*$log.info('Modal dismissed at: ' + new Date());*/
            });
        };

        $scope.openCatalog = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/story/filter.html',
                controller: "ModalCatalogCtrl",
                size: size,
                resolve: {
                    sites: function () {
                        return $scope.sites;
                    },
                    activeSites: function () {
                        return $scope.activeSites;
                    }
                }
            });
            modalInstance.result.then(function (activeSites) {
                $scope.purgeStories();
                $scope.activeSites = activeSites;
                $scope.reload($scope.limit);
                cacheService.setData('activeSites', activeSites);
            }, function () {
                /*$log.info('Modal dismissed at: ' + new Date());*/
            });
        };

        /******************************************************************
         * Keyboard shortcuts
         ******************************************************************/
        $scope.keyboard = function (event) {
            if (event.keyCode == 37) {
                $scope.previousStory();
            }
            if (event.keyCode == 39) {
                $scope.nextStory();
            }
            if (event.keyCode == 72 || event.keyCode == 112) {
                if ( $scope.isActiveHelpCenter() ) {
                    $scope.dismissHelpCenter();
                } else {
                    $scope.activeHelpCenter();
                }
            }
        };
        angular.element('body').keydown(function (e) {
            $scope.$apply(function () {
                $scope.keyboard(e);
            })
        });

        /******************************************************************
         * Page init
         ******************************************************************/
        /* Load stories*/
        $scope.loadMore();
        /* Get sites from catalog */
        Site.query({}, function (response) {
            angular.forEach(response.sites, function (value, key) {
                $scope.sites.push(value);
            });
        });
        /* Help center init */
        if ( $scope.isNewbie === true ) { $scope.activeHelpCenter(); }
    }])
    .controller('ModalGetMoreCtrl', ['$scope', '$modalInstance', 'limitButtons', function ($scope, $modalInstance, limitButtons) {

        $scope.limitButtons = limitButtons;

        $scope.ok = function (selectedLimit) {
            $modalInstance.close(selectedLimit);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('ModalCatalogCtrl', ['$scope', '$modalInstance', 'sites', 'activeSites', function ($scope, $modalInstance, sites, activeSites) {
        $scope.sites = sites;
        $scope.activeSites = activeSites;
        $scope.toggleSite = function (siteId) {
            var toggleIndex = $scope.activeSites.indexOf(siteId);
            if (toggleIndex != -1) {
                $scope.activeSites.splice(toggleIndex, 1);
            }
            else {
                $scope.activeSites.push(siteId);
            }
        };
        $scope.getStarClass = function (siteId) {
            return $scope.activeSites.indexOf(siteId) != -1 ? 'fa-star' : 'fa-star-o';
        }
        $scope.ok = function () {
            $modalInstance.close($scope.activeSites);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);