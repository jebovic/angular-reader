'use strict';

/* Directives */


angular.module('readerApp.directives', [])
    .directive('readerHelp', ['helpCenter', function (helpCenter) {
        return {
            restrict: 'EA',
            link: function( scope, elem, attr ) {
                var positionTarget = attr.readerHelpTarget ? attr.readerHelpTarget : '#' + attr.id;
                var bgActive = attr.readerHelpNobg == '' ? false : true;
                helpCenter.blocks.push( {
                    name:attr.readerHelpBlock,
                    target: positionTarget,
                    bg: bgActive
                } );
            }
        }
    }])
    .directive('resize', ['$window','helpCenter',function ($window,helpCenter) {
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
                        'height': (newHeight + helpCenter.overlayShift) + 'px',
                        'width': (newWidth + 2*helpCenter.overlayShift) + 'px',
                        'top': - helpCenter.overlayShift + 'px',
                        'left': - helpCenter.overlayShift + 'px'
                    };
                };

                scope.helpBlockPosition = function ( target ) {
                    var storyContainer = angular.element(target)[0];
                    if ( storyContainer ) {
                        return {
                            'height': storyContainer.offsetHeight + 'px',
                            'width': storyContainer.offsetWidth + 'px',
                            'top': (storyContainer.offsetTop + helpCenter.overlayShift) + 'px',
                            'left': (storyContainer.offsetLeft + helpCenter.overlayShift) + 'px'
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
    }]);
