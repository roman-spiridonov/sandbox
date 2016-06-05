module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {  // task
            server: {  // goal: $grunt shell:server
                //command: 'java -cp L1.2-1.0-jar-with-dependencies.jar main.Main 8080'
				command: 'node server.js'  // command: 'node server.js'
            },
            options: {  // task's options
                stdout: true,
                stderr: true
            }
        },
        fest: {
            templates: {
                files: [{
                    expand: true,  // Flag for dynamic expand
                    cwd: 'templates',  // Source directory to expand
                    src: '*.xml',  // File pattern
                }],
                options: {
                    template: function (data) {
                        return grunt.template.process(
                            'var <%= name %>Tmpl = <%= contents %> ;',
                            {data: data}
                        );
                    }
                }
            }
        },
        watch: {
            fest: {
                files: ['templates/*.xml'],  // files to watch
                tasks: ['fest'],  // recompile template after change using grunt-fest
                options: {
                    interrupt: true,
                    atBegin: true  // Launch the goal at start-up
                }
            },
            server: {
                files: [
                    'public_html/js/**/*.js',
                    'public_html/css/**/*.css',
                    'public_html/*.html'
                ],
                options: {
                    livereload: true
                }
            }
        },
        concurrent: {
            target: ['watch', 'shell'],  // concurrent tasks
            options: {
                logConcurrentOutput: true  // to console
            }
        },
		qunit: {
            all: ['./public_html/tests/index.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-fest');

	grunt.registerTask('test', ['qunit:all']);
    grunt.registerTask('default', ['concurrent']);  
        // instead of ['shell', 'watch'] which collide because Java server does not return control

};