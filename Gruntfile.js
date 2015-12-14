/**
 * Created by chenqb on 2015/7/4.
 */
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            main: {
                files: [{
                    expand: true,
                    cwd: './src/less/',
                    src: ['**/*.less'],
                    dest: './public/css/',
                    ext: '.css'
                }]
            },
            compileCore: {
                options: {
                    strictMath: true,
                    outputSourceFiles: true
                }
                //hx: {
                //    src: 'src/less/hx.less',
                //    dest: 'assets/css/<%= pkg.name %>.css'
                //},
                //email: {
                //    src: 'src/less/email.less',
                //    dest: 'assets/css/email.css'
                //}
            }
        },
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                advanced: false
            },
            minifyCore: {
                files: {
                    'public/css/base.min.css': 'public/css/base.css'
                }
            }
        },
        uglify: {
            options: {
                banner: '/** ! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            buildall: {
                files: {

                }
            }
        },
        jshint: {
            files: ['src/js/*.js', 'src/test/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>','src/less/*.less'],
            tasks: ['jshint',"less",'cssmin',"uglify"]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // 只需在命令行上输入"grunt"，就会执行default task
    grunt.registerTask('default', ['jshint', 'uglify', 'less','cssmin']);
};
