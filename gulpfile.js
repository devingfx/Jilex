const gulp = require('gulp');
// const babel = require('gulp-babel');
const rename = require("gulp-rename");
// var concat = require('gulp-concat');
const through = require('through2');
const exec = require('child_process').exec;
// const exec = require('gulp-exec');
const jspm = require('gulp-jspm-build');
const watch = require('gulp-watch');
const batch = require('gulp-batch');
const plumber = require('gulp-plumber');


function json2Tpl( tpl )
{
	// console.log(arguments);
	return through.obj(function (file, enc, cb)
	{
		if (file.isNull())
			return cb(null, file);
		
		if (file.isStream())
			return cb(new gutil.PluginError('gulp-template', 'Streaming not supported'));
		
		var json = JSON.parse( file.contents.toString() );
		file.contents = new Buffer( tpl(json) );
		cb( null, file );
	})
}

// . build/sh-tpl src/jx/bootstrap.js > dist/bootstrap.js
// #. src/jx/bootstrap.js > dist/bootstrap.js


gulp.task('build-bootstrap', function (cb) {
  //exec('sh build/sh-tpl src/jx/bootstrap.js > dist/bootstrap.js', function (err, stdout, stderr) {
  exec('cat src/jx/recorder.js jspm_packages/system.src.js dist/JXMLDocument.js config.js src/jx/bootstrap.js > dist/system.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})
// <gulp:task name="build-bootstrap">
// 	<node:exec>. build/sh-tpl src/jx/bootstrap.js > dist/bootstrap.js</node:exec>
// 	<gulp:file src="src/jx/bootstrap.js">
// 	    <gulp:exec pipeStdout="true">. build/sh-tpl <%= file.path %><gulp:exec>
// 	    <gulp:dest>dist</gulp:dest>
// 	</gulp:file>
// </gulp:task>
// var exec = require('gulp-exec');
// gulp.task('build-bootstrap', function(){
//     return gulp.src('src/jx/bootstrap.js')
// 	    .pipe(exec('sh build/sh-tpl <%= file.path %>', {pipeStdout:true} ))
// 	    // .pipe(exec.reporter(reportOptions));
// 	    .pipe(gulp.dest('dist'))
// 	    // .pipe(exec('<%= file.path %>', {pipeStdout:true} ))
// 	    // .pipe(gulp.dest('dist'))
// });

gulp.task('build-bundles', function(){
    jspm({
        bundles: [
            { src: 'src/jx/core/JXMLDocument.js', dst: 'JXMLDocument.js' }
        ]
        // ,options: { minify: true, mangle: true }
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build-bootstrap','build-bundles'])

gulp.task('watch', function () {
    // watch('src/**/*.js', batch(function (events, done) {
    //     gulp.start('build', done);
    // })).pipe(plumber())
    watch(['src/jx/bootstrap.js','config.js'], batch(function (events, done) {
	        gulp.start('build-bootstrap', done);
	    }))
        // .pipe(plumber())
    watch('src/**/*.js', batch(function (events, done) {
	        gulp.start('build-bundles', done);
	    }))
});


gulp.task('default', ['build','watch'])