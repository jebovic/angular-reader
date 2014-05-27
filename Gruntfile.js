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
                    'app/css/<%= pkg.name %>-theme.css': 'app/less/theme.less',
                    'app/css/<%= pkg.name %>-responsive.css': 'app/less/responsive.less',
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
                        "vendor/Font-Awesome/css/font-awesome.min.css",
                        "vendor/angular-loading-bar/build/loading-bar.min.css",
                        "vendor/Font-Awesome/fonts/*"
                    ],
                    dest: "build-webapp/"
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: "build-webapp/",
                    src: ["**"],
                    dest: "build-webapp-prod"
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
                        "app/vendor/angular-touch/angular-touch.min.js",
                        "app/vendor/angular-resource/angular-resource.min.js",
                        "app/vendor/angular-sanitize/angular-sanitize.min.js",
                        "app/vendor/angular-bootstrap/ui-bootstrap.min.js",
                        "app/vendor/angular-bootstrap/ui-bootstrap-tpls.min.js",
                        "app/vendor/angular-animate/angular-animate.min.js",
                        "app/vendor/angular-loading-bar/build/loading-bar.min.js",
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
        },
        replace: {
            'prod-url': {
                src: ['build-webapp-prod/*.json', 'build-webapp-prod/js/*.js', 'build-webapp-prod/partials/*.html', 'build-webapp-prod/partials/**/*.html'],
                overwrite: true,
                replacements: [{
                    from: 'reader.loc',
                    to: 'reader.amiral-labs.com'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-chrome-compile');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-file-blocks');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.registerTask('build-webapp', ['copy:main','less', 'uglify:js', 'cssmin:css','fileblocks']);
    grunt.registerTask('build-webapp-prod', ['build-webapp', 'copy:prod', 'replace:prod-url']);

}
