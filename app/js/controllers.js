'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    .controller('OrderedController', ['$scope', 'cacheService', 'readerConfig', 'helpCenter', 'readingCenter', 'readerModals', 'readerNavigation', 'favCenter', 'userAPI', 'googlePlus', function ($scope, cacheService, readerConfig, helpCenter, readingCenter, readerModals, readerNavigation, favCenter, userAPI, googlePlus){
        /* Load dependencies */
        $scope.readerConfig = readerConfig;
        $scope.googlePlus = googlePlus.init();
        $scope.helpCenter = helpCenter.init();
        $scope.readingCenter = readingCenter.init('ordered');
        $scope.navigation = readerNavigation.init();
        $scope.modals = readerModals.init();
        $scope.favCenter = favCenter.init();

        /* Specific */
        $scope.title = "Most recent";
        $scope.quickMenuActive = "ordered";

        /* Page rendering */
        $scope.start = function() {
            $scope.readingCenter.story.purge();
            $scope.readingCenter.story.loadOrdered();
            $scope.readingCenter.site.load();
        };
        $scope.start();
    }])
    .controller('FavsController', ['$scope', 'cacheService', 'readerConfig', 'helpCenter', 'readingCenter', 'readerModals', 'readerNavigation', 'favCenter', 'googlePlus', function ($scope, cacheService, readerConfig, helpCenter, readingCenter, readerModals, readerNavigation, favCenter,googlePlus){
        /* Load dependencies */
        $scope.readerConfig = readerConfig;
        $scope.googlePlus = googlePlus.init();
        $scope.helpCenter = helpCenter.init();
        $scope.readingCenter = readingCenter.init();
        $scope.navigation = readerNavigation.init();
        $scope.favCenter = favCenter.init();

        /* Specific */
        $scope.title = "Consult your favorites stories";
        $scope.quickMenuActive = "favorites";

        /* Page rendering */
        $scope.start = function() {
            $scope.favCenter.load();
        };
        $scope.start();
    }])
    .controller('RandomController', ['$scope', 'cacheService', 'readerConfig', 'helpCenter', 'readingCenter', 'readerModals', 'readerNavigation', 'favCenter', 'googlePlus', function ($scope, cacheService, readerConfig, helpCenter, readingCenter, readerModals, readerNavigation, favCenter, googlePlus){
        /* Load dependencies */
        $scope.readerConfig = readerConfig;
        $scope.googlePlus = googlePlus.init();
        $scope.helpCenter = helpCenter.init();
        $scope.readingCenter = readingCenter.init('random');
        $scope.navigation = readerNavigation.init();
        $scope.modals = readerModals.init();
        $scope.favCenter = favCenter.init();

        /* Specific */
        $scope.title = "Consult random stories";
        $scope.quickMenuActive = "random";

        /* Page rendering */
        $scope.start = function() {
            $scope.readingCenter.story.load();
            $scope.readingCenter.site.load();
        };
        $scope.start();
    }])
    .controller('ModalGetMoreCtrl', ['$scope', '$modalInstance', 'limitButtons', function ($scope, $modalInstance, limitButtons) {
        $scope.title = "Get more Doonut stories in your bag";
        $scope.limitButtons = limitButtons;
        $scope.ok = function (selectedLimit) {
            $modalInstance.close(selectedLimit);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('ModalCatalogCtrl', ['$scope', '$modalInstance', 'sites', 'activeSites', function ($scope, $modalInstance, sites, activeSites) {
        $scope.title = "Choose your favorites sites";
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