'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    //cacheService.setData('newbie', false);
    .controller('RandomController', ['$scope', 'Storie', 'Site', '$sce', 'cacheService', '$modal', function ($scope, Storie, Site, $sce, cacheService, $modal) {
        $scope.loading = true;
        $scope.showStoryIndex = 0;
        $scope.direction = 'left';
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
            'help': { url: 'partials/help/overlay.html'},
            'helpBlock': { url: 'partials/help/block.html'},
            'storyListItem': {url: 'partials/story/list-item.html'}
        };
        $scope.isNewbie = cacheService.getData('newbie') ? cacheService.getData('newbie') : true;
        $scope.help = {
            active: ($scope.isNewbie === true),
            blocks: [],
            overlayShit: 100,
            dismiss: function () {
                $scope.help.active = false;
                cacheService.setData('newbie', false);
            },
            display: function () {
                $scope.resizeHelpBlock();
                $scope.help.active = true;
            }
        };
        $scope.resizeHelpBlock = function () {
            var helpBlock = angular.element('#swipeHelpBlock');
            var activeStory = angular.element('.storyContainer')[$scope.showStoryIndex];
            if (activeStory && helpBlock) {
                helpBlock.css({
                    'height': activeStory.offsetHeight + 'px'
                });
            } else {
            }
        };
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
            $scope.purgeStories();
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
            $scope.loadStories();
            $scope.showStoryIndex = 0;
        };
        $scope.isRead = function (bool) {
            return bool ? 'fa-square' : 'fa-square-o';
        };
        $scope.loadStories = function () {
            var siteIds = [];
            angular.forEach($scope.activeSites, function (value, key) {
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
                if ($scope.firstLoad) {
                    $scope.showFirst();
                }
                $scope.firstLoad = false;
            });
        };

        $scope.nextStory = function () {
            var storyIndex = $scope.showStoryIndex;
            $scope.direction = 'left';
            if ($scope.stories.length != ( storyIndex + 1 )) {
                $scope.showStoryIndex = storyIndex + 1;
                $scope.stories[$scope.showStoryIndex].unread = false;
            }
            if ($scope.stories.length < ( storyIndex + 8 ) && $scope.loading === false) {
                $scope.loadMore();
            }
        };
        $scope.previousStory = function () {
            var storyIndex = $scope.showStoryIndex;
            $scope.direction = 'right';
            if (storyIndex !== 0) {
                $scope.showStoryIndex = storyIndex - 1;
                $scope.stories[$scope.showStoryIndex].unread = false;
            }
        };
        $scope.navigate = function (event) {
            if (event.keyCode == 37) {
                $scope.previousStory();
            }
            if (event.keyCode == 39) {
                $scope.nextStory();
            }
            if (event.keyCode == 72 || event.keyCode == 112) {
                if ($scope.help.active) {
                    $scope.help.dismiss();
                } else {
                    $scope.help.display();
                }
            }
        };
        $scope.showFirst = function () {
            $scope.showStoryIndex = 0;
            $scope.resizeHelpBlock();
        };
        $scope.showLast = function () {
            $scope.showStoryIndex = $scope.stories.length - 1;
        };

        $scope.purgeStories = function () {
            $scope.firstLoad = true;
            $scope.stories = [];
        }


        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/story/get-more.html',
                controller: "ModalInstanceCtrl",
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


        /******************************************************************/

        angular.element('body').keydown(function (e) {
            $scope.$apply(function () {
                $scope.navigate(e);
            })
        });

        $scope.loadMore();
        Site.query({}, function (response) {
            angular.forEach(response.sites, function (value, key) {
                $scope.sites.push(value);
                $scope.activeSites.push(value);
            });
        });
    }])
    .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'limitButtons', function ($scope, $modalInstance, limitButtons) {

        $scope.limitButtons = limitButtons;

        $scope.ok = function (selectedLimit) {
            $modalInstance.close(selectedLimit);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);