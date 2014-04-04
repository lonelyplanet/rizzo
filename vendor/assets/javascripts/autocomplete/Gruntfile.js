module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    jasmine: {
      standard: {
        src: "src/js/*.js",
        options: {
          specs: "spec/tests/*.js",
          vendor: "bower_components/jquery/dist/jquery.js"
        }
      },
      amd: {
        src: "src/js/*.js",
        options: {
          helpers: [ "node_modules/jasmine-jquery/lib/jasmine-jquery.js", "bower_components/jquery/dist/jquery.js" ],
          specs: "spec/tests/*.js",
          host: "http://127.0.0.1:8000",
          template: require("grunt-template-jasmine-requirejs"),
          templateOptions: {
            requireConfig: {
              baseUrl: "./",
              paths: {
                jquery: "./bower_components/jquery/dist/jquery"
              }
            }
          }
        }
      }
    },

    watch: {
      scripts: {
        files: [ "Gruntfile.js", "src/js/*.js", "spec/tests/*.js" ],
        tasks: [ "jasmine:amd" ],
        options: {
          nospawn: true
        }
      }
    },

    connect: {
      test: {
        hostname: "http://127.0.0.1",
        port: 8000,
        keepalive: true
      }
    }

  });

  // This loads in all the grunt tasks auto-magically.
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.registerTask("default", [ "connect", "watch" ]);

};
