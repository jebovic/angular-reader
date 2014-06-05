'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
    .controller('OrderedController', ['$scope', 'cacheService', 'readerConfig', 'helpCenter', 'readingCenter', 'readerModals', 'readerNavigation', 'favCenter', 'UserAPI', function ($scope, cacheService, readerConfig, helpCenter, readingCenter, readerModals, readerNavigation, favCenter, UserAPI){
        /* User */
        $scope.userProfile = undefined;
        $scope.hasUserProfile = false;
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;

        $scope.disconnect = function() {

            /*UserAPI.disconnect().then(function() {
                $scope.userProfile = undefined;
                $scope.hasUserProfile = false;
                $scope.isSignedIn = false;
                $scope.immediateFailed = true;
                //$scope.renderSignIn();
            });*/
        };

        $scope.signedIn = function(profile) {
            console.log(profile);
            $scope.isSignedIn = true;
            $scope.userProfile = profile;
            $scope.hasUserProfile = true;
        };

        $scope.signIn = function(authResult) {
            $scope.$apply(function() {
                $scope.processAuth(authResult);
            });
        };

        $scope.processAuth = function(authResult) {
            $scope.immediateFailed = true;
            if ($scope.isSignedIn) {
                return 0;
            }
            if (authResult['access_token']) {
                $scope.immediateFailed = false;
                // Successfully authorized, create session
                gapi.auth.setToken(authResult);
                gapi.client.load('plus', 'v1', function() {
                    var request = gapi.client.plus.people.get({userId: 'me'});
                    request.execute($scope.signedIn);
                });
                /*UserAPI.signIn(authResult).then( function( response ){
                    console.log(response);
                });*/
            } else if (authResult['error']) {
                if (authResult['error'] == 'immediate_failed') {
                    $scope.immediateFailed = true;
                } else {
                    console.log('Error:' + authResult['error']);
                }
            }
        };

        $scope.renderSignIn = function() {
            gapi.signin.render('myGsignin', {
                'callback': $scope.signIn,
                'clientid': "826340305331-cq525g9v91m0hr7d7m6a05lsnuqo0gjn.apps.googleusercontent.com",
                //'requestvisibleactions': Conf.requestvisibleactions,
                'scope': 'https://www.googleapis.com/auth/plus.login',
                'theme': 'dark',
                'cookiepolicy': 'single_host_origin',
                'accesstype': 'offline'
            });
        }

        /* Load dependencies */
        $scope.readerConfig = readerConfig;
        $scope.helpCenter = helpCenter.init();
        $scope.readingCenter = readingCenter.init('ordered');
        $scope.navigation = readerNavigation.init($scope);
        $scope.modals = readerModals.init();
        $scope.favCenter = favCenter.init();

        /* Specific */
        $scope.title = "Most recent";
        $scope.quickMenuActive = "ordered";

        /* Page rendering */
        $scope.start = function() {
            $scope.renderSignIn();
            $scope.readingCenter.story.purge();
            $scope.readingCenter.story.loadOrdered();
            $scope.readingCenter.site.load();
        };
        $scope.start();
    }])
    .controller('FavsController', ['$scope', 'cacheService', 'readerConfig', 'helpCenter', 'readingCenter', 'readerModals', 'readerNavigation', 'favCenter', function ($scope, cacheService, readerConfig, helpCenter, readingCenter, readerModals, readerNavigation, favCenter){
        /* Load dependencies */
        $scope.readerConfig = readerConfig;
        $scope.helpCenter = helpCenter.init();
        $scope.readingCenter = readingCenter.init();
        $scope.navigation = readerNavigation.init($scope);
        $scope.favCenter = favCenter.init();

        /* Specific */
        $scope.title = "Consult your favorites stories";
        $scope.quickMenuActive = "favorites";

        /* Page rendering */
        $scope.favCenter.load();
    }])
    .controller('RandomController', ['$scope', 'cacheService', 'readerConfig', 'helpCenter', 'readingCenter', 'readerModals', 'readerNavigation', 'favCenter', function ($scope, cacheService, readerConfig, helpCenter, readingCenter, readerModals, readerNavigation, favCenter){
        /* Load dependencies */
        $scope.readerConfig = readerConfig;
        $scope.helpCenter = helpCenter.init();
        $scope.readingCenter = readingCenter.init('random');
        $scope.navigation = readerNavigation.init($scope);
        $scope.modals = readerModals.init();
        $scope.favCenter = favCenter.init();

        /* Specific */
        $scope.title = "Consult random stories";
        $scope.quickMenuActive = "random";

        /* Page rendering */
        $scope.readingCenter.story.load();
        $scope.readingCenter.site.load();
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