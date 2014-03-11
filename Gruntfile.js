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
        plugins: [ {
          removeViewBox: false
        } ]
      },
      dist: {
        files: [ {
          expand: true,
          cwd: "./app/assets/images/icons/active",
          src: [ "*.svg" ],
          dest: "./app/assets/images/icons/active",
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
      }
    },
    coffee: {
      compile: {
        files: [
          {
            expand: true,
            cwd: "./app/assets/javascripts/lib",
            src: [ "**/*.coffee", "**/**/*.coffee" ],
            dest: "./public/assets/javascripts/lib",
            ext: ".js"
          },
          {
            expand: true,
            cwd: "./spec/javascripts/lib",
            src: [ "**/*.coffee" ],
            dest: "./public/assets/javascripts/spec",
            ext: ".js"
          }
        ]
      }
    },
    copy: {
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
        src: [ "./public/assets/javascripts/lib/**/*.js" ],
        options: {
          helpers: [ "./spec/javascripts/helpers/**/*.js", "./vendor/assets/javascripts/jquery/jquery.js" ],
          host: "http://127.0.0.1:8888/",
          specs: "./public/assets/javascripts/spec/**/*.js",
          template: require("grunt-template-jasmine-requirejs"),
          templateOptions: {
            requireConfig: {
              baseUrl: "./",
              paths: {
                jquery: "./vendor/assets/javascripts/jquery/jquery",
                jsmin: "./vendor/assets/javascripts/lonelyplanet_minjs/dist/$",
                polyfills: "./vendor/assets/javascripts/polyfills",
                lib: "./public/assets/javascripts/lib",
                jplugs: "./vendor/assets/javascripts/jquery-plugins",
                sCode: "./vendor/assets/javascripts/omniture/s_code",
                gpt: "http://www.googletagservices.com/tag/js/gpt",
                pickadate: "./vendor/assets/javascripts/pickadate"
              }
            }
          }
        }
      }
    },
    watch: {
      scripts: {
        files: [ "app/assets/javascripts/lib/**/*.coffee", "spec/javascripts/lib/**/*.coffee" ],
        tasks: [ "shell:cleanJs", "newer:coffee", "jasmine" ],
        options: {
          nospawn: true
        }
      },
      test: {
        files: [ "app/assets/javascripts/lib/**/*.coffee", "spec/javascripts/lib/**/*.coffee", "app/assets/javascripts/lib/**/*.js", "spec/javascripts/lib/**/*.js" ],
        tasks: [ "shell:cleanJs", "coffee", "copy", "connect", "jasmine" ]
      }
    },
    plato: {
      rizzo: {
        files: {
          ".plato/": [ "./public/assets/javascripts/**/*.js" ]
        }
      }
    },
    jshint: {
      src: [ "Gruntfile.js", "app/assets/javascripts/**/*.js" ],
      options: {
        jshintrc: "./.jshintrc"
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
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  // Tasks
  grunt.registerTask("default", [ "shell:cleanJs", "coffee", "copy", "connect", "jasmine" ]);
  grunt.registerTask("ci", [ "coffee", "copy", "connect", "jasmine" ]);
  grunt.registerTask("jasmineTests", [ "watch:test" ]);
  grunt.registerTask("dev", [ "connect", "open:jasmine", "jasmine", "watch" ]);
  grunt.registerTask("wip", [ "jasmine:rizzo:build", "open:jasmine", "connect:server:keepalive" ]);
  grunt.registerTask("report", [ "shell:cleanJs", "coffee", "copy", "plato", "shell:openPlato" ]);
  grunt.registerTask("imageoptim", [ "imageoptim" ]);
  grunt.registerTask("icon:active", [ "grunticon:active", "shell:cleanIcons", "shell:move" ]);
  grunt.registerTask("icon:critical", [ "grunticon:critical", "shell:cleanIcons", "shell:move" ]);
  grunt.registerTask("icon", [ "svgmin", "icon:active", "icon:critical" ]);
  grunt.registerTask("setup", [ "shell:enableHooks" ]);
};
