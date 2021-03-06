'use strict';

/* Config */

angular.module('readerApp.config', [])
    .factory('readerConfig', ['cacheService',function(cacheService){
        return {
            readerUrl : 'http://reader.loc',
            getApiUrl: function(){
                return this.readerUrl + '/api';
            },
            limitButtons: [
                { limit: 25, text: "25" },
                { limit: 50, text: "50" },
                { limit: 100, text: "100" },
                { limit: 200, text: "200" }
            ],
            templates: {
                'header': { url: 'partials/header.html'},
                'help': { url: 'partials/help/overlay.html'},
                'helpBlock': { url: 'partials/help/block.html'},
                'storyListItem': {url: 'partials/story/list-item.html'},
                'menu': {
                    'user': {url: 'partials/menu/user.html'}
                }
            },
            stories: {
                defaultLimit: 25
            },
            googlePlus: {
                'clientid': "826340305331-cq525g9v91m0hr7d7m6a05lsnuqo0gjn.apps.googleusercontent.com",
                'scope': 'https://www.googleapis.com/auth/plus.login',
                'theme': 'dark',
                'width': 'iconOnly',
                'cookiepolicy': 'single_host_origin',
                'accesstype': 'offline'
            }
        }
    }]);
