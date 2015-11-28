module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';\n',
			},
			jilex: {
				src: [
					'src/jx/*.js',
				],
				dest: 'dist/jilex.src.js',
			}
		},
		
		uglify: {
			jilex: {
				files: {
					'dist/jilex.js': ['dist/jilex.src.js']
				}
			}
		}
	});

  // Load the plugins that provides the "uglify" task and "concat" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  // Default task(s).
  grunt.registerTask('default', ['concat:jilex']);

};
