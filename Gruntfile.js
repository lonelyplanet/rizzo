module.exports = function(grunt) {

  "use strict";

  require("util")._extend;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    imageoptim: {
      src: [
        "app/assets/images"
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
        files: [ {
          expand: true,
          cwd: "app/assets/images/icons/active",
          dest: "app/assets/stylesheets/icons",
          src: [ "*.svg" ]
        } ],
        options: {
          cssprefix: ".icon--",
          customselectors: {
            "*": [ ".icon--$1--before:before, .icon--$1--after:after" ],
            // leave single words unquoted for jscs to pass
            calendar: [ "#quote-departure-date .icon, #quote-return-date .icon" ],
            magazine: [ ".icon--guide, .icon--guide--before:before, .icon--guide--after:after" ],
            population: [ ".icon--population-ntk" ],
            "place--pin": [ ".icon--place, .icon--place--before:before, .icon--place--after:after" ],
            "chevron-right": [ ".picker__nav--next" ],
            "chevron-left": [ ".picker__nav--prev" ],
            "chevron-down": [ ".select2-choice:after" ],
            "chevron-up": [ ".select2-dropdown-open .select2-choice:after" ]
          },
          datasvgcss: "active.css",
          datapngcss: "active.png.css",
          urlpngcss: "active.fallback.css"
        }
      },
      critical: {
        files: [ {
          expand: true,
          cwd: "app/assets/images/icons/active/critical/",
          dest: "app/assets/stylesheets/icons",
          src: [ "*.svg" ]
        } ],
        options: {
          cssprefix: ".icon--",
          customselectors: {
            "*": [ ".icon--$1--before:before, .icon--$1--after:after" ],
            "chevron-right": [ ".picker__nav--next" ],
            "chevron-left": [ ".picker__nav--prev" ]
          },
          datasvgcss: "critical.svg.css",
          datapngcss: "critical.png.css",
          urlpngcss: "critical.css"
        }
      }
    },
    svgmin: {
      options: {
        plugins: [
          { removeDesc: true },
          { removeTitle: true },
          { removeViewBox: false }
        ]
      },
      dist: {
        files: [ {
          expand: true,
          cwd: "./app/assets/images/icons",
          src: [ "**/*.svg" ],
          dest: "./app/assets/images/icons",
          ext: ".svg"
        } ]
      }
    },
    shell: {
      cleanIcons: {
        command: "rm -rf app/assets/images/icons/png"
      },
      cleanJs: {
        command: "rm -rf public/assets/javascripts"
      },
      move: {
        command: "mv app/assets/stylesheets/icons/png/  app/assets/images/icons/png/"
      },
      openPlato: {
        command: "open .plato/index.html"
      },
      enableHooks: {
        command: "ln -s -f ../../git-hooks/pre-commit .git/hooks/pre-commit"
      },
      fetchSubmodules: {
        command: "git submodule init && git submodule update"
      },
      killPhantom: {
        command: "pkill -f phantomjs || true"
      }
    },
    copy: {
      data: {
        expand: true,
        cwd: "./app/assets/javascripts/data",
        src: [ "**/*.js", "**/**/*.js" ],
        dest: "./public/assets/javascripts/data"
      },
      source: {
        expand: true,
        cwd: "./app/assets/javascripts/lib",
        src: [ "**/*.js", "**/**/*.js" ],
        dest: "./public/assets/javascripts/lib"
      },
      specs: {
        expand: true,
        cwd: "./spec/javascripts/lib",
        src: [ "**/*.js", "**/**/*.js" ],
        dest: "./public/assets/javascripts/spec"
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
        path: "http://127.0.0.1:8888/_SpecRunner.html"
      }
    },
    jasmine: {
      rizzo: {
        options: {
          host: "http://127.0.0.1:8888/",
          helpers: [
            "./vendor/assets/javascripts/jquery/dist/jquery.js",
            "node_modules/jasmine-jquery/lib/jasmine-jquery.js",
            "node_modules/jasmine-ajax/lib/mock-ajax.js",
            "./spec/javascripts/helpers/**/*.js"
          ],
          template: require("grunt-template-jasmine-requirejs"),
          specs: "./public/assets/javascripts/spec/**/*_spec.js",
          templateOptions: {
            version: "./vendor/assets/javascripts/requirejs/require.js",
            requireConfig: {
              baseUrl: "./",
              paths: {
                flamsteed: "./vendor/assets/javascripts/flamsteed/lib/javascripts/flamsteed",
                hogan: "./vendor/assets/javascripts/hogan/dist/hogan-3.0.0.amd",
                jplugs: "./vendor/assets/javascripts/jquery-plugins",
                jquery: "./vendor/assets/javascripts/jquery/dist/jquery",
                jtimeago: "./vendor/assets/javascripts/jquery-timeago/jquery.timeago",
                sailthru: "./vendor/assets/javascripts/sailthru/v1",
                sCode: "./vendor/assets/javascripts/omniture/s_code",
                trackjs: "./vendor/assets/javascripts/trackjs/trackjs",
                dfp: "./vendor/assets/javascripts/jquery.dfp.js/jquery.dfp",
                autocomplete: "./vendor/assets/javascripts/autocomplete/dist/autocomplete",
                nouislider: "./vendor/assets/javascripts/nouislider",
                pickadate: "./vendor/assets/javascripts/pickadate",
                polyfills: "./vendor/assets/javascripts/polyfills",
                amazon: "./vendor/assets/javascripts/amazon",
                picker: "vendor/assets/javascripts/pickadate/lib/picker",
                pickerDate: "./vendor/assets/javascripts/pickadate/lib/picker.date",
                pickerLegacy: "./vendor/assets/javascripts/pickadate/lib/legacy",
                "jquery-bbq-deparam/jquery-deparam": "./vendor/assets/javascripts/jquery-bbq-deparam/jquery-deparam",
                data: "./public/assets/javascripts/data",
                lib: "./public/assets/javascripts/lib"
              }
            }
          }
        }
      }
    },
    plato: {
      rizzo: {
        files: {
          ".plato/": [ "./public/assets/javascripts/lib/**/*.js" ]
        }
      }
    },
    jshint: {
      src: [ "Gruntfile.js", "app/assets/javascripts/**/*.js" ],
      options: {
        jshintrc: "./.jshintrc",
        ignores: "app/assets/javascripts/data/**"
      }
    },
    jscs: {
      src: [ "Gruntfile.js", "app/assets/javascripts/**/*.js" ],
      options: {
        config: "./.jscs.json"
      }
    }

  });

  // This loads in all the grunt tasks auto-magically.
  require("matchdep").filterDev("grunt-!(template-jasmine-requirejs)").forEach(grunt.loadNpmTasks);

  // Tasks
  grunt.registerTask("default", [ "shell:cleanJs", "copy", "connect", "jasmine", "shell:killPhantom" ]);
  grunt.registerTask("ci", [ "shell:cleanJs", "copy", "connect", "jasmine" ]);
  grunt.registerTask("dev", [ "connect", "open:jasmine", "jasmine", "shell:killPhantom" ]);
  grunt.registerTask("wip", [ "jasmine:rizzo:build", "open:jasmine", "connect:server:keepalive" ]);
  grunt.registerTask("report", [ "shell:cleanJs", "copy", "plato", "shell:openPlato" ]);
  grunt.registerTask("imageoptim", [ "imageoptim" ]);
  grunt.registerTask("icon:active", [ "grunticon:active", "shell:cleanIcons", "shell:move" ]);
  grunt.registerTask("icon:critical", [ "grunticon:critical", "shell:cleanIcons", "shell:move" ]);
  grunt.registerTask("icon", [ "svgmin", "icon:active", "icon:critical" ]);
  grunt.registerTask("setup", [ "shell:fetchSubmodules", "shell:enableHooks" ]);
};
