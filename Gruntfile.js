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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

}