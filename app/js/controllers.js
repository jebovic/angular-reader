'use strict';

/* Controllers */

angular.module('readerApp.controllers', [])
  .controller('MyCtrl1', ['$scope', 'Storie', '$sce',function($scope, Storie, $sce) {
    $scope.limit = 10;
    $scope.stories = [];
    $scope.trustHtml = function( data ) {
      return $sce.trustAsHtml( data );
    };
    $scope.loadMore = function() {
        Storie.query({limit: $scope.limit},function( response ){
            angular.forEach($scope.stories, function(value, key){
                value.toAnimate = false;
            });
            angular.forEach(response, function(value, key){
                value.toAnimate = true;
                $scope.stories.push(value);
            });
        });
    };
    $scope.reload = function( limit ) {
        $scope.limit = limit;
        $scope.stories = [];
        Storie.query({limit: $scope.limit},function( response ){
            angular.forEach(response, function(value, key){
                value.toAnimate = true;
                $scope.stories.push(value);
            });
        });
    };
    $scope.reload( $scope.limit );
  }])
  .controller('MyCtrl2', [function() {

  }]);
