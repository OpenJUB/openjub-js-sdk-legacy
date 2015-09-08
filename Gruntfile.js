'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        files: ['src/**.js', 'src/client/**.js'],
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
      },
    },
    uglify: {
      build: {
        src: ['dist/openjub.js'],
        dest: 'dist/openjub.min.js'
      }
    },
    'jsdoc-ng' : {
      dist: {
        src: ['src/**.js', 'src/client/**.js', 'README.md' ],
        dest: 'docs',
        template: 'node_modules/jaguarjs-jsdoc',
        options:  {
          source: {
              includePattern: '.+\\.js(doc)?$',
              excludePattern: '(^|\\/|\\\\)_'
          },
          opts: {
              recurse: true,
              private: true
          }
        }
      }
    },
    browserify: {
      dist: {
        src: 'src/index.js',
        dest: 'dist/openjub.js',
        options: {
          browserifyOptions: {
            debug: true,
            standalone: 'JUB'
          },
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc-ng');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('dist', [
    'jshint', 'jsdoc-ng', 'browserify', 'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
