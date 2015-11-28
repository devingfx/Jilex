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
				options: {
					banner: '"use strict";'
				},
				src: [
					'src/jx/util/Array.create.js',
					
					'src/jx/Package.js',
					'src/jx/package.js',
					'src/html/package.js',
					
					'src/jx/core/EventDispatcher.js',
					'src/jx/core/Loadable.js',
					'src/jx/core/Node.js',
					'src/jx/core/Document.js',
					'src/jx/core/Attr.js',
					'src/jx/core/XmlnsAttr.js',
					'src/jx/core/Element.js',
					'src/jx/core/Namespace.js',
					'src/jx/core/Jilex.js',
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
		}
	});

  // Load the plugins that provides the "uglify" task and "concat" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  // Default task(s).
  grunt.registerTask('default', ['concat:jilex']);

};