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
			jilexLight: {
				src: [
					'src/jx/Class.js',
					'src/jx/Node.load.js',
				],
				dest: 'dist/jilex-light.src.js',
			},
			jilexClasses: {
				bootstrap: 'src/bootstrap.js',
				options: {
					banner: '"use strict";\n',
					footer: grunt.file.read( 'src/bootstrap.js' )
					// footer: '\n\n\n\n<%= concat.jilexClasses.bootstrap %>'
				},
				src: [
					
					'src/jx/console/console.tag.js',
					// 'src/jx/util/Array.create.js',
					
					'src/jx/Package.js',
					
					'src/jx/core/EventDispatcher.js',
					'src/jx/core/Loadable.js',
					'src/jx/core/Document.js',
					'src/jx/core/Node.js',
					'src/jx/core/Attr.js',
					'src/jx/core/XmlnsAttr.js',
					'src/jx/core/Element.js',
					// 'src/jx/core/Namespace.js',
					
					'src/jx/core/Jilex.js',
					
					// 'src/jx/package.js',
					'src/html/package.js',
					
				],
				dest: 'dist/jilex-classes.src.js',
			}
		},
		
		uglify: {
			jilex: {
				files: {
					'dist/jilex-classes.XHTML.js': ['dist/jilex-classes.src.js'],
					'dist/jilex-light.XHTML.js': ['dist/jilex-light.src.js'],
					'dist/jilex.XHTML.js': ['dist/jilex.src.js'],
					'dist/jilex.HTML5.js': ['dist/jilex5.src.js']
				}
			}
		},
		
		watch: {
			scripts: {
				files: 'src/jx/**/*.js',
				tasks: ['concat:jilexClasses'],
				options: {
					debounceDelay: 250,
				},
			},
		}
	});

  // Load the plugins that provides the "uglify" task and "concat" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['concat:jilexClasses']);

};
