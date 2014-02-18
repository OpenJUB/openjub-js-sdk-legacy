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
        banner: '<%= openjub.banner %>',
      },
      dist: {
        src: files.order,
        dest: '<%= openjub.dist %>/<%= pkg.filename %>.js',
      },
    }
  });

  grunt.registerTask('build', [
    'concat',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
