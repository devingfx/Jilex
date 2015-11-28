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
					'src/jx/util/Array.create.js',
					'src/jx/Node.js',
					'src/jx/Document.js',
					'src/jx/Namespace.js',
					'src/jx/NamespaceList.js',
					'src/jx/Component.js',
					'src/jx/jilex.js',
				],
				dest: 'dist/jilex.src.js',
			},
			jilex5: {
				src: [
					'src/jx/util/Array.create.js',
					'src/jx/Node.js',
					'src/jx/Document.js',
					'src/jx/Namespace.js',
					'src/jx/NamespaceList.js',
					'src/jx/Component.js',
					'src/jx/ns.js',
					'src/jx/namespace.polyfill.js',
					'src/jx/jilex.js',
				],
				dest: 'dist/jilex5.src.js',
			},
		},
		
		uglify: {
			jilex: {
				files: {
					'dist/jilex.XHTML.js': ['dist/jilex.src.js'],
					'dist/jilex.HTML5.js': ['dist/jilex5.src.js']
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
