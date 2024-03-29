module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['dist', 'coverage'],
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: ['**/*.js'],
                dest: 'dist/'
            }
        },
        peg: {
            hgvsParser: {
                src: "src/hgvsParser.peg",
                dest: "dist/hgvsParser.js"
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['copy'],
                options: {
                    interrupt: true
                }
            },
            pegjs: {
                files: ['src/**/*.peg'],
                tasks: ['peg'],
                options: {
                    interrupt: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'copy', 'peg']); // run `grunt` for this
    grunt.registerTask('build', ['copy', 'peg']); // run `grunt build` for this
    grunt.registerTask('do-watch', ['build', 'watch']); // run `grunt do-watch` for this
    grunt.registerTask('jasmine', function () { let done = this.async(); let jasmine = require( "./spec/run" ); jasmine.onComplete( done ); } ); // run `grunt jasmine` for this
    grunt.registerTask('test', ['build', 'jasmine']); // run `grunt test` for this
};