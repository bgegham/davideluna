module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    lineNumbers: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'resources/src/sass/cpanel',
                        src: ['**/*.scss'],
                        dest: 'public/css/cpanel',
                        ext: '.css'
                    },
                    {
                        expand: true,
                        cwd: 'resources/src/sass/site/',
                        src: ['app.scss'],
                        dest: 'public/css/site',
                        ext: '.css'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task(s).
    grunt.registerTask('default', ['sass']);

};
