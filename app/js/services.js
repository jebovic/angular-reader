'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('readerApp.services', ['ngResource'])
    .factory('Storie', ['$resource','readerConfig',
        function ($resource, readerConfig) {
            return $resource( readerConfig.getApiUrl() +'/stories', {limit: '@limit', sites: '@sites'}, {
                query: {method: 'GET', params: {limit: 10, sites: []}},
                random: {url: readerConfig.getApiUrl() +'/stories/random', method: 'GET', params: {limit: 10, sites: []}},
                ordered: {url: readerConfig.getApiUrl() +'/stories/ordered', method: 'GET', params: {limit: 10, offset:0, sites: []}}
            });
        }])
    .factory('Site', ['$resource', 'readerConfig',
        function ($resource, readerConfig) {
            return $resource(readerConfig.getApiUrl() + '/sites', {}, {
                query: {method: 'GET', params: {}}
            });
        }])
    .factory('storageService', function () {
        return {
            get: function (key) {
                return localStorage.getItem(key);
            },
            save: function (key, data) {
                localStorage.setItem(key, JSON.stringify(data));
            },
            remove: function (key) {
                localStorage.removeItem(key);
            },
            clearAll: function () {
                localStorage.clear();
            }
        };
    })
    .factory('cacheService',['storageService', function (storageService) {
        return {
            getData: function (key) {
                return storageService.get(key);
            },
            setData: function (key, data) {
                storageService.save(key, data);
            },
            removeData: function (key) {
                storageService.remove(key);
            }
        };
    }])
    .factory('helpCenter', ['cacheService',function(cacheService){
        return {
            active: !cacheService.getData('newbie'),
            blocks: [],
            overlayShift: 100,
            init: function() {
                return this;
            },
            getBlocks: function(){
                return this.blocks;
            },
            dismiss: function () {
                this.active = false;
                cacheService.setData('newbie', false);
            },
            display: function () {
                this.active = true;
            }
        };
    }])
    .factory('readingCenter', ['readerConfig', 'cacheService', 'Storie', 'Site', function(readerConfig, cacheService, Storie, Site){
        var contentProvider = {};
        contentProvider.init = function(context){
            this.context = context;
            this.loading = true;
            this.firstLoad= true;
            this.stories = [];
            /* sites init */
            this.sites = [];
            this.activeSites = cacheService.getData('activeSites') ? angular.fromJson(cacheService.getData('activeSites')) : [];
            return this;
        };
        contentProvider.site = {};
        contentProvider.site.load = function(){
            var $that = contentProvider;
            Site.query({}, function (response) {
                angular.forEach(response.sites, function (value) {
                    $that.sites.push(value);
                });
            });
        };

        /* Utils functions */
        contentProvider.story = {};
        contentProvider.story.currentIndex = 0;
        contentProvider.story.limit = readerConfig.stories.defaultLimit;
        contentProvider.story.offset = 0;
        contentProvider.story.imageExists = function (hash) {
            return hash.length > 0;
        };
        contentProvider.story.imageStyle = function(imageId) {
            return {
                'background-image': 'url('+readerConfig.readerUrl+'/uploads/images/'+imageId+')'
            }
        };
        contentProvider.story.isRead = function (bool) {
            return bool ? 'fa-eye' : 'fa-check-square';
        };

        contentProvider.story.load = function () {
            var $that = contentProvider;
            if ( $that.context == 'ordered' )
            {
                $that.story.loadOrdered();
            }
            if ( $that.context == 'random' )
            {
                $that.story.loadRandom();
            }
        };
        contentProvider.story.loadRandom = function() {
            var $that = contentProvider;
            $that.loading = true;
            var cachedStories = cacheService.getData('readStories');
            var readStories = cachedStories ? angular.fromJson(cachedStories) : [];
            Storie.random(
                {
                    limit: $that.story.limit,
                    sites: $that.activeSites.join(',')
                },
                function (response) {
                    angular.forEach(response.stories, function (story, key) {
                        story.unread = true;
                        var storyIndex = readStories.indexOf(story.id);
                        if (storyIndex != -1) {
                            story.unread = false;
                        }
                        $that.stories.push(story);
                        readStories.push(story.id);
                    });
                    cacheService.setData('readStories', readStories);
                    $that.loading = false;
                    if ($that.firstLoad) {
                        $that.story.currentIndex = 0;
                    }
                    $that.firstLoad = false;
                }
            );
        };
        contentProvider.story.loadOrdered = function () {
            var $that = contentProvider;
            $that.loading = true;
            var cachedStories = cacheService.getData('readStories');
            var readStories = cachedStories ? angular.fromJson(cachedStories) : [];
            Storie.ordered(
                {
                    limit: $that.story.limit,
                    sites: $that.activeSites.join(','),
                    offset: $that.story.offset
                },
                function (response) {
                    angular.forEach(response.stories, function (story, key) {
                        story.unread = true;
                        var storyIndex = readStories.indexOf(story.id);
                        if (storyIndex != -1) {
                            story.unread = false;
                        }
                        $that.stories.push(story);
                        readStories.push(story.id);
                    });
                    cacheService.setData('readStories', readStories);
                    $that.loading = false;
                    if ($that.firstLoad) {
                        $that.story.currentIndex = 0;
                    }
                    $that.story.offset = $that.story.offset + $that.story.limit;
                    $that.firstLoad = false;
                }
            );
        };
        contentProvider.story.purge = function () {
            contentProvider.firstLoad = true;
            contentProvider.stories = [];
            contentProvider.story.offset = 0;
            contentProvider.story.currentIndex = 0;
        };
        return contentProvider;
    }])
    .factory('readerModals', ['$modal', 'readerConfig', 'readingCenter', 'cacheService', function($modal, readerConfig, readingCenter, cacheService){
        var getMore = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/story/get-more.html',
                controller: "ModalGetMoreCtrl",
                size: size,
                resolve: {
                    limitButtons: function () {
                        return readerConfig.limitButtons;
                    }
                }
            });
            modalInstance.result.then(function (selectedLimit) {
                readingCenter.story.limit = selectedLimit;
                readingCenter.story.load(readingCenter.context);
            }, function () {
                /*$log.info('Modal dismissed at: ' + new Date());*/
            });
        };

        var catalog = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/story/filter.html',
                controller: "ModalCatalogCtrl",
                size: size,
                resolve: {
                    sites: function () {
                        return readingCenter.sites;
                    },
                    activeSites: function () {
                        return readingCenter.activeSites;
                    }
                }
            });
            modalInstance.result.then(function (activeSites) {
                readingCenter.story.purge();
                readingCenter.activeSites = activeSites;
                readingCenter.story.load(readingCenter.context);
                cacheService.setData('activeSites', activeSites);
            }, function () {
                /*$log.info('Modal dismissed at: ' + new Date());*/
            });
        };

        return {
            init: function() {
                return {openGetMore: getMore, openCatalog: catalog}
            }
        };
    }])
    .factory('readerNavigation', ['helpCenter', 'readingCenter', function(helpCenter, readingCenter){
        var navigation = {};
        navigation.story = {};
        /* Stories navigation */
        navigation.story.next = function () {
            var storyIndex = readingCenter.story.currentIndex;
            if (readingCenter.stories.length != ( storyIndex + 1 )) {
                readingCenter.stories[storyIndex].unread = false;
                readingCenter.story.currentIndex = storyIndex + 1;
            }
            if (readingCenter.stories.length < ( storyIndex + 8 ) && readingCenter.loading === false) {
                readingCenter.story.load(readingCenter.context);
            }
        };
        navigation.story.previous = function () {
            var storyIndex = readingCenter.story.currentIndex;
            if (storyIndex !== 0) {
                readingCenter.stories[storyIndex].unread = false;
                readingCenter.story.currentIndex = storyIndex - 1;
            }
        };
        navigation.story.first = function () {
            readingCenter.story.currentIndex = 0;
        };
        navigation.story.last = function () {
            readingCenter.story.currentIndex = readingCenter.stories.length - 1;
        };

        navigation.keyboard = function (event) {
            var $that = this;
            if (event.keyCode == 37) {
                $that.story.previous();
            }
            if (event.keyCode == 39) {
                $that.story.next();
            }
            if (event.keyCode == 72 || event.keyCode == 112) {
                if ( helpCenter.active ) {
                    helpCenter.dismiss();
                } else {
                    helpCenter.display();
                }
            }
        };
        navigation.init = function($scope){
            var $nav = this;
            angular.element('body').keydown(function (e) {
                $scope.$apply(function () {
                    $nav.keyboard(e);
                })
            });
            return $nav;
        };

        return navigation;
    }])
    .factory('favCenter', ['cacheService', 'readingCenter', function(cacheService,readingCenter){
        /* Favs management */
        var favProvider = {};
        favProvider.favStoryIds = cacheService.getData('favStoryIds') ? angular.fromJson(cacheService.getData('favStoryIds')) : [];
        favProvider.favStories = cacheService.getData('favStories') ? angular.fromJson(cacheService.getData('favStories')) : [];
        favProvider.toggleFav = function() {
            var $that = this;
            var currentStory = readingCenter.stories[readingCenter.story.currentIndex];
            var currentStoryId = currentStory.id;
            var storyIndex = $that.favStoryIds.indexOf(currentStoryId);
            if (storyIndex != -1) {
                $that.favStoryIds.splice(storyIndex, 1);
                $that.favStories.splice(storyIndex, 1);
            }
            else {
                $that.favStoryIds.push(currentStoryId);
                $that.favStories.push(currentStory);
            }
            cacheService.setData('favStoryIds', $that.favStoryIds);
            cacheService.setData('favStories', $that.favStories);
        };
        favProvider.storieInFavs = function() {
            var $that = this;
            if ( readingCenter.stories.length )
            {
                var currentStoryId = readingCenter.stories[readingCenter.story.currentIndex].id;
                var storyIndex = $that.favStoryIds.indexOf(currentStoryId);
                return storyIndex != -1 ? 'fa-star' : 'fa-star-o';
            }
        };
        favProvider.load = function(){
            var $that = this;
            readingCenter.loading = true;

            angular.forEach($that.favStories, function (story, key) {
                readingCenter.stories.push(story);
            });
            $that.loading = false;
        }
        favProvider.init = function() {
            return this;
        };
        return favProvider;

    }]);