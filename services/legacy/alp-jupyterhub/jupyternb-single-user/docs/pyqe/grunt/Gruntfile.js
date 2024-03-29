module.exports = function(grunt) {

  // This is the configuration.
  grunt.initConfig({
    run: {
      options: {
        // Task-specific options go here.
      },
      your_target: {
        cmd: 'node',
        args: [
          'domManipulate.js'
        ]
      }
    },
    processhtml: {
      options: {
        data: {
          message: ''
        }
      },
      dist: {
        files: {
          'dest/index.html': ['./html/final-template-index.html']
        }
      }
    }
  });
  
    // Load the plugins
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-processhtml');
  
    // Default task(s).
    grunt.registerTask('default', ['run', 'processhtml']);
  };
  