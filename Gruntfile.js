module.exports = function (grunt) {
    'use strict';

    grunt.util.linefeed = '\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    paths: ["app/css","app/less"]
                },
                files: {
                    'app/css/<%= pkg.name %>.css': 'app/less/app.less',
                    'app/css/<%= pkg.name %>-theme.css': 'app/less/theme.less'
                }
            },
            production: {
                options: {
                    paths: ["app/css","app/less"],
                    cleancss: true
                },
                files: {
                    'app/css/<%= pkg.name %>.css': 'app/less/app.less',
                    'app/css/<%= pkg.name %>-theme.css': 'app/less/theme.less'
                }
            }
        },
        'chrome-extension': {
            options: {
                name: "funreader",
                version: "0.0.1",
                id: "00000000000000000000000000000000",
                chrome: "",
                clean: true,
                certDir: 'cert',
                buildDir: 'build-chrome',
                resources: [
                    "app/js/**",
                    "app/css/*.css",
                    "app/img/**",
                    "app/partials/**",
                    "app/*.html",
                    "app/*.json",
                    "app/vendor/bootstrap/dist/css/bootstrap.min.css",
                    "app/vendor/bootstrap/dist/css/bootstrap-theme.min.css",
                    "app/vendor/animate.css/animate.min.css",
                    "app/vendor/Font-Awesome/css/font-awesome.min.css",
                    "app/vendor/Font-Awesome/fonts/*",
                    "app/vendor/jquery/dist/jquery.js",
                    "app/vendor/angular/angular.min.js",
                    "app/vendor/angular-route/angular-route.min.js",
                    "app/vendor/angular-resource/angular-resource.min.js",
                    "app/vendor/angular-sanitize/angular-sanitize.min.js",
                    "app/vendor/ngInfiniteScroll/ng-infinite-scroll.js"
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-chrome-compile');

}
