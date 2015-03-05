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

  var files = grunt.file.readJSON('src/files.json');

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    openjub: {
      dist: 'dist',
      docs: 'docs',
      src: 'src',
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    uglify: {
      options: {
        preserveComments: false,
        banner: '<%= openjub.banner %>'
      },
      build: {
        src: '<%= openjub.dist %>/<%= pkg.filename %>.js',
        dest: '<%= openjub.dist %>/<%= pkg.filename %>.min.js'
      }
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= openjub.banner %>"use strict";\n',
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        },
      },
      dist: {
        src: files.order,
        dest: '<%= openjub.dist %>/<%= pkg.filename %>.js',
      },
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        ignores: [
          '<%= openjub.src %>/vendor/{,*/}*.js',

          //we want to ignore the pre and post-amble
          'src/00_preamble.js',
          'src/99_postamble.js'
        ]
      },
    },
    "jsdoc-ng" : {
      "openjub": {
        src: ['<%= openjub.src %>', 'README.md' ],
        dest: '<%= openjub.docs %>',
        template: 'node_modules/jaguarjs-jsdoc',
        options:  {
          source: {
              includePattern: ".+\\.js(doc)?$",
              excludePattern: "(^|\\/|\\\\)_",
              exclude: [
                'src/00_preamble.js',
                'src/99_postamble.js'
              ]
          },
          opts: {
              recurse: true,
              private: true
          }
        }
      }
    },
    all: [
      '<%= openjub.src %>/{,*/}*.js'
    ],
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= openjub.dist %>'
          ]
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc-ng');

  grunt.registerTask('build', [
    'jshint',
    'jsdoc-ng',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
