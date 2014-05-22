'use strict';

/* Directives */


angular.module('readerApp.directives', [])
    .directive('readerHelp', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'EA',
            link: function( scope, elem, attr ) {
                var positionTarget = attr.readerHelpTarget ? attr.readerHelpTarget : '#' + attr.id;
                scope.help.blocks.push( {
                    name:attr.readerHelpBlock,
                    target: positionTarget
                } );
            }
        }
    }])
    .directive('resize', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return { 'h': w.height(), 'w': w.width() };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                scope.helpOverlay = function () {
                    var bodyElem = angular.element('body')[0];
                    var newHeight = Math.max(newValue.h, bodyElem.offsetHeight);
                    var newWidth = Math.max(newValue.w, bodyElem.offsetWidth);
                    return {
                        'height': (newHeight + scope.help.overlayShit) + 'px',
                        'width': (newWidth + 2*scope.help.overlayShit) + 'px',
                        'top': - scope.help.overlayShit + 'px',
                        'left': - scope.help.overlayShit + 'px'
                    };
                };

                scope.helpBlockPosition = function ( target ) {
                    var storyContainer = angular.element(target)[0];
                    if ( storyContainer ) {
                        return {
                            'height': storyContainer.offsetHeight + 'px',
                            'width': storyContainer.offsetWidth + 'px',
                            'top': (storyContainer.offsetTop + scope.help.overlayShit) + 'px',
                            'left': (storyContainer.offsetLeft + scope.help.overlayShit) + 'px'
                        };
                    } else {
                        return '';
                    }
                };
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    });
