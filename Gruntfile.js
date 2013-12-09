module.exports = function (grunt) {
    'use strict';
    var extend = require('util')._extend;
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imageoptim: {
            files: [
                'app/assets/images'
            ],
            options: {
                // also run images through ImageAlpha.app before ImageOptim.app
                imageAlpha: true,
                // also run images through JPEGmini.app after ImageOptim.app
                jpegMini: true,
                // quit all apps after optimisation
                quitAfter: true
            }
        },
        grunticon: {
            active: {
                options:{
                    cssprefix: 'icon--',
                    customselectors: {
                        "*": ".$1--before:before, .$1--after:after"
                    },
                    datasvgcss: 'active.css',
                    datapngcss: 'active.png.css',
                    dest: 'app/assets/stylesheets/icons/',
                    src: 'app/assets/images/icons/active/',
                    urlpngcss: 'active.fallback.css'
                }
            },
            critical: {
                options:{
                    cssprefix: 'icon--',
                    customselectors: {
                        "*": ".$1--before:before, .$1--after:after"
                    },
                    datasvgcss: 'critical.svg.css',
                    datapngcss: 'critical.png.css',
                    dest: 'app/assets/stylesheets/icons/',
                    src: 'app/assets/images/icons/active/critical/',
                    urlpngcss: 'critical.css'
                }
            }
        },
        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './app/assets/images/src',
                    src: ['*.svg'],
                    dest: './app/assets/images/src',
                    ext: '.svg'
                }]
            }
        },
        shell: {
            clean_icons: {
                command: 'rm -rf app/assets/images/icons/png'
            },
            clean_js: {
                command: 'rm -rf public/assets/javascripts'
            },
            move: {
                command: 'mv app/assets/stylesheets/icons/png/  app/assets/images/icons/png/'
            },
            openPlato: {
                command: 'open .plato/index.html'
            },
            cat_styles: {
                command: 'cat app/assets/stylesheets/icons/critical.svg.css >> app/assets/stylesheets/icons/active.css'
            }
        },
        coffee: {
            compile: {
                files: [{
                    expand: true,
                    cwd: './app/assets/javascripts/lib',
                    src: ['**/*.coffee', '**/**/*.coffee'],
                    dest: './public/assets/javascripts/lib',
                    ext: '.js'
                }, {
                    expand: true,
                    cwd: './spec/javascripts/lib',
                    src: ['**/*.coffee'],
                    dest: './public/assets/javascripts/spec',
                    ext: '.js'
                }]
            }
        },
        connect: {
            server: {
                options: {
                    hostname: "127.0.0.1",
                    port: 8888
                }
            }
        },
        open: {
            jasmine: {
                path: 'http://127.0.0.1:8888/_SpecRunner.html'
            }
        },
        jasmine: {
            rizzo: {
                src: ['./public/assets/javascripts/lib/**/*.js'],
                options: {
                    helpers: ['./spec/javascripts/helpers/**/*.js', './vendor/assets/javascripts/jquery/jquery-1.7.2.min.js'],
                    host: 'http://127.0.0.1:8888/',
                    specs: './public/assets/javascripts/spec/**/*.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './',
                            paths: {
                                jquery: './vendor/assets/javascripts/jquery/jquery-1.7.2.min',
                                jsmin: './vendor/assets/javascripts/lonelyplanet_minjs/dist/$',
                                polyfills: './vendor/assets/javascripts/polyfills',
                                lib: './public/assets/javascripts/lib',
                                jplugs: './vendor/assets/javascripts/jquery/plugins',
                                s_code: './vendor/assets/javascripts/omniture/s_code',
                                maps_infobox: './vendor/assets/javascripts/google-maps-infobox',
                                gpt: 'http://www.googletagservices.com/tag/js/gpt'
                            }
                        }
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: ['app/assets/javascripts/lib/**/*.coffee', 'spec/javascripts/lib/**/*.coffee'],
                tasks: ['shell:clean_js', 'newer:coffee', 'jasmine'],
                options: {
                    nospawn: true
                }
            }
        },
        plato: {
            rizzo: {
                files: {
                    '.plato/': ['./public/assets/javascripts/**/*.js']
                }
            }
        }

    });

    // This loads in all the grunt tasks auto-magically.
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Tasks
    grunt.registerTask('default', ['shell:clean_js', 'coffee', 'connect', 'jasmine']);
    grunt.registerTask('dev', ['connect', 'open:jasmine', 'jasmine', 'watch']);
    grunt.registerTask('wip', ['jasmine:rizzo:build', 'open:jasmine', 'connect:server:keepalive']);
    grunt.registerTask('report', ['shell:clean_js', 'coffee', 'plato', 'shell:openPlato']);
    grunt.registerTask('imageoptim', ['imageoptim']);
    // If you need to run the icons task, first cd node_modules/grunt-grunticon &&
    // curl https://github.com/filamentgroup/grunticon/pull/84.patch | patch -p1
    // Until this (or a similar PR is merged)
    // https://github.com/filamentgroup/grunticon/pull/84
    grunt.registerTask('icon', ['svgmin', 'grunticon', 'shell:clean_icons', 'shell:move']);
};
