module.exports = function(grunt) {
  var uglifyNonMinOptions = {
    mangle: false,

    beautify: {
      // options in http://lisperator.net/uglifyjs/codegen
      beautify:     true,
      width:        80,
      indent_level: 2
    },

    compress: {
      // options in http://lisperator.net/uglifyjs/compress
      global_defs: {
        "DEBUG": true
      }
    }
  };

  var uglifyMinOptions = {
    beautify: {
      // options in http://lisperator.net/uglifyjs/codegen
      ascii_only: true
    },
    compress: {
      // options in http://lisperator.net/uglifyjs/compress
      global_defs: {
        "DEBUG": false
      }
    }
  };

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    name: '<%= pkg.name %>',

    concat: {
      amd: {
        dest: 'dist/amd/<%= name %>.amd.source.js',
        src: [
          'build/amd-start.js',
          'src/<%= name %>.js',
          'src/amd-end.js'
        ]
      },

      glob: {
        dest: 'dist/global/<%= name %>.glob.source.js',
        src: [
          'build/global-start.js',
          'src/<%= name %>.js',
          'src/global-end.js'
        ]
      },

      node: {
        dest: 'dist/node/<%= name %>.source.js',
        src: [
          'build/node-start.js',
          'src/<%= name %>.js'
        ]
      }
    },

    uglify: {
      // Common task options
      options: {
        // https://npmjs.org/package/grunt-contrib-uglify
        report: 'gzip',
        preserveComments: 'some'
      },

      // Non-minified target
      "amd-non-min": {
        src:  'dist/amd/<%= name %>.amd.source.js',
        dest: 'dist/amd/<%= name %>.amd.js',
        // Target options
        options: uglifyNonMinOptions
      },

      "glob-non-min": {
        src:  'dist/global/<%= name %>.glob.source.js',
        dest: 'dist/global/<%= name %>.glob.js',
        options: uglifyNonMinOptions
      },

      "node-non-min": {
        src:  'dist/node/<%= name %>.source.js',
        dest: 'dist/node/<%= name %>.js',
        options: uglifyNonMinOptions
      },

      // Min target
      "amd-min": {
        src:  'dist/amd/<%= name %>.amd.source.js',
        dest: 'dist/amd/<%= name %>.amd.min.js',
        // Target options
        options: uglifyMinOptions
      },

      "glob-min": {
        src:  'dist/global/<%= name %>.glob.source.js',
        dest: 'dist/global/<%= name %>.glob.min.js',
        options: uglifyMinOptions
      },

      "node-min": {
        src:  'dist/node/<%= name %>.source.js',
        dest: 'dist/node/<%= name %>.min.js',
        options: uglifyMinOptions
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('amd-start', "Generates the amd start file", function() {

    var text = "define(function() {\n\"use strict\";\nvar priv = {version: " +
      JSON.stringify(grunt.config('pkg.version')) +
    "}; // semver";

    require('fs').writeFileSync('build/amd-start.js', text);
  });

  grunt.registerTask('glob-start', "Generates the global start file", function() {

    var text = "privateState = (function() {\n\"use strict\";\nvar priv = {version: " +
      JSON.stringify(grunt.config('pkg.version')) +
    "}; // semver";

    require('fs').writeFileSync('build/global-start.js', text);
  });

  grunt.registerTask('node-start', "Generates the node start file", function() {
    var text = '"use strict";\n' + "var priv = {version: " +
        JSON.stringify(grunt.config('pkg.version')) +
      "}; // semver\n" +
      "module.exports = priv;\n";

    require('fs').writeFileSync('build/node-start.js', text);
  });

  // Default task(s).
  grunt.registerTask('default', [
    'glob-start',
    'node-start',
    'amd-start',
    'concat',
    'uglify'
  ]);
};