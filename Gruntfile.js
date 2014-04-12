module.exports = function (grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            main: {
                options: {
                    paths: ["app/css","app/less"]
                },
                files: {
                    'app/css/<%= pkg.name %>.css': 'app/less/app.less',
                    'app/css/<%= pkg.name %>-theme.css': 'app/less/theme.less'
                }
            }
        },
        copy: {
            main: {
                files: [{
                    cwd: 'app/',
                    expand: true,
                    src: [
                        "*.html",
                        "*.json",
                        "img/*",
                        "partials/**/*.html",
                        "vendor/bootstrap/dist/css/bootstrap.min.css",
                        "vendor/animate.css/animate.min.css",
                        "vendor/Font-Awesome/css/font-awesome.min.css",
                        "vendor/Font-Awesome/fonts/*"
                    ],
                    dest: "build-webapp/"
                }]
            }
        },
        uglify: {
            js: {
                files: {
                    'build-webapp/js/<%= pkg.name %>.min.js': [
                        "app/vendor/jquery/dist/jquery.js",
                        "app/vendor/bootstrap/dist/js/bootstrap.min.js",
                        "app/vendor/angular/angular.min.js",
                        "app/vendor/angular-route/angular-route.min.js",
                        "app/vendor/angular-resource/angular-resource.min.js",
                        "app/vendor/angular-sanitize/angular-sanitize.min.js",
                        "app/vendor/ngInfiniteScroll/ng-infinite-scroll.js",
                        "app/vendor/angular-bootstrap/ui-bootstrap.min.js",
                        "app/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js",
                        "app/js/*.js"
                    ]
                }
            }
        },
        cssmin : {
            css:{
                src: 'app/css/*.css',
                dest: 'build-webapp/css/<%= pkg.name %>.min.css'
            }
        },
        fileblocks: {
            options: {
                removeFiles: true
            },
            dist: {
                src: 'build-webapp/index.html',
                blocks: {
                    'prodStyles' : {
                        src: [
                            'css/*.css'
                            ],
                        cwd: 'build-webapp'
                    },
                    'prodScripts' : {
                        src: [
                            'js/*.js'
                        ],
                        cwd: 'build-webapp'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-chrome-compile');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-file-blocks');
    grunt.registerTask('build-webapp', ['copy:main','less', 'uglify:js', 'cssmin:css','fileblocks']);

}
