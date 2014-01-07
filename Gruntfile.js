module.exports = function (grunt) {
    'use strict';
    var extend = require('util')._extend;
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        imageoptim: {
            src: [
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
                files: [{
                    expand: true,
                    cwd: "app/assets/images/icons/active",
                    dest: "app/assets/stylesheets/icons",
                    src: ["*.svg"]
                }],
                options: {
                    cssprefix: ".icon--",
                    customselectors: {
                        "*": [".icon--$1--before:before, .icon--$1--after:after"],
                        "chevron-right": [".picker__nav--next"],
                        "chevron-left": [".picker__nav--prev"]
                    },
                    datasvgcss: "active.css",
                    datapngcss: "active.png.css",
                    urlpngcss: "active.fallback.css"
                }
            },
            critical: {
                files: [{
                    expand: true,
                    cwd: "app/assets/images/icons/active/critical/",
                    dest: "app/assets/stylesheets/icons",
                    src: ["*.svg"]
                }],
                options: {
                    cssprefix: ".icon--",
                    customselectors: {
                        "*": [".icon--$1--before:before, .icon--$1--after:after"],
                        "chevron-right": [".picker__nav--next"],
                        "chevron-left": [".picker__nav--prev"]
                    },
                    datasvgcss: "critical.svg.css",
                    datapngcss: "critical.png.css",
                    urlpngcss: "critical.css"
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
                    cwd: './app/assets/images/icons/active',
                    src: ['*.svg'],
                    dest: './app/assets/images/icons/active',
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
                    helpers: ['./spec/javascripts/helpers/**/*.js', './vendor/assets/javascripts/jquery/jquery.js'],
                    host: 'http://127.0.0.1:8888/',
                    specs: './public/assets/javascripts/spec/**/*.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: './',
                            paths: {
                                jquery: './vendor/assets/javascripts/jquery/jquery',
                                jsmin: './vendor/assets/javascripts/lonelyplanet_minjs/dist/$',
                                polyfills: './vendor/assets/javascripts/polyfills',
                                lib: './public/assets/javascripts/lib',
                                jplugs: './vendor/assets/javascripts/jquery/plugins',
                                s_code: './vendor/assets/javascripts/omniture/s_code',
                                maps_infobox: './vendor/assets/javascripts/google-maps-infobox',
                                gpt: 'http://www.googletagservices.com/tag/js/gpt',
                                pickadate: './vendor/assets/javascripts/pickadate'
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
    grunt.registerTask('ci', ['coffee', 'connect', 'jasmine']);
    grunt.registerTask('dev', ['connect', 'open:jasmine', 'jasmine', 'watch']);
    grunt.registerTask('wip', ['jasmine:rizzo:build', 'open:jasmine', 'connect:server:keepalive']);
    grunt.registerTask('report', ['shell:clean_js', 'coffee', 'plato', 'shell:openPlato']);
    grunt.registerTask('imageoptim', ['imageoptim']);
    grunt.registerTask('icon:active', ['grunticon:active', 'shell:clean_icons', 'shell:move']);
    grunt.registerTask('icon:critical', ['grunticon:critical', 'shell:clean_icons', 'shell:move']);
    grunt.registerTask('icon', ['svgmin', 'icon:active', 'icon:critical']);
};
