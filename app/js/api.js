'use strict';

/* API */

angular.module('readerApp.api', ['ngResource'])
    .factory('dataProvider', ['$resource','readerConfig', function ($resource, readerConfig) {
        return {
            story:  $resource( readerConfig.getApiUrl() +'/stories', {limit: '@limit', sites: '@sites'}, {
                query: {method: 'GET', params: {limit: 10, sites: []}},
                random: {url: readerConfig.getApiUrl() +'/stories/random', method: 'GET', params: {limit: 10, sites: []}},
                ordered: {url: readerConfig.getApiUrl() +'/stories/ordered', method: 'GET', params: {limit: 10, offset:0, sites: []}}
            }),
            site:  $resource(readerConfig.getApiUrl() + '/sites', {}, {
                query: {method: 'GET', params: {}}
            })
        }
    }])
    .factory('userAPI', ['$http','readerConfig', function ($http, readerConfig) {
        return {
            signIn: function(authResult) {
                return $http.post(readerConfig.getApiUrl() +'/user/connect', authResult);
            },
            disconnect: function() {
                return $http.post(readerConfig.getApiUrl() +'/user/disconnect');
            }
        }
    }])
    .factory('googlePlus', ['readerConfig', '$rootScope', function(readerConfig, $rootScope){
        /* User */
        var googlePlusBridge = {};
        googlePlusBridge.immediateFailed = false;
        googlePlusBridge.user = {};
        googlePlusBridge.user.profile = undefined;
        googlePlusBridge.user.hasProfile = false;
        googlePlusBridge.user.isSignedIn = false;

        googlePlusBridge.user.renderSignIn = function() {
            gapi.signin.render('googlePlusSignin', readerConfig.googlePlus);
        };

        googlePlusBridge.user.signedIn = function(profile) {
            var $that = googlePlusBridge;
            $rootScope.$apply( function(){
                $that.user.isSignedIn = true;
                $that.user.profile = profile;
                $that.user.hasProfile = true;
            });
        };

        googlePlusBridge.user.signIn = function(authResult) {
            var $that = googlePlusBridge;
            if (authResult['error']) {
                $that.user.reset();
                return true;
            }
            $that.processAuth(authResult);
        };

        googlePlusBridge.disconnect = function() {
            var $that = this;
            gapi.auth.signOut();
            $that.user.reset();
            $that.user.renderSignIn();
        };

        googlePlusBridge.user.reset = function(){
            var $that = googlePlusBridge;
            $that.user.profile = undefined;
            $that.user.hasProfile = false;
            $that.user.isSignedIn = false;
            $that.immediateFailed = true;
        };

        googlePlusBridge.processAuth = function(authResult) {
            var $that = this;
            $that.immediateFailed = true;
            if ($that.user.isSignedIn) {
                return 0;
            }
            if (authResult['access_token']) {
                $that.immediateFailed = false;
                gapi.auth.setToken(authResult);
                gapi.client.load('plus', 'v1', function() {
                    var request = gapi.client.plus.people.get({userId: 'me'});
                    request.execute($that.user.signedIn);
                });
            } else if (authResult['error']) {
                if (authResult['error'] == 'immediate_failed') {
                    $that.immediateFailed = true;
                } else {
                    console.log('Error:' + authResult['error']);
                }
            }
        };

        googlePlusBridge.init = function() {
            readerConfig.googlePlus.callback = googlePlusBridge.user.signIn;
            return this;
        }

        return googlePlusBridge;
    }]);