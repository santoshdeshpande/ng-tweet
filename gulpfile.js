var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpPlugins = require('gulp-load-plugins');
var bowerFiles = require('main-bower-files');
var p = gulpPlugins();


gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(p.rimraf());
});

gulp.task('bootstrap', function(){
	gulp.src('bower_components/bootstrap-sass/**/*.scss')
		.pipe(p.rubySass({style:'expanded'}))
		.pipe(p.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		.pipe(p.concat('bootstrap.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(p.rename({suffix: '.min'}))
		.pipe(p.minifyCss())
		.pipe(gulp.dest('dist/css'))	

});

gulp.task('copyFonts', function() {
	gulp.src('bower_components/bootstrap-sass/dist/fonts/*')
		.pipe(gulp.dest('dist/fonts'))
})

gulp.task('styles', ['bootstrap'],function() {
	gulp.src('app/styles/**/*.scss')
		.pipe(p.rubySass({style:'expanded'}))
		.pipe(p.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		.pipe(gulp.dest('dist/css'))
		.pipe(p.rename({suffix: '.min'}))
		.pipe(p.minifyCss())
		.pipe(gulp.dest('dist/css'))		
});

gulp.task('deps', function() {
	var jsFilter = p.filter(['**/*.js']);
	gulp.src(bowerFiles())
		.pipe(jsFilter)
		.pipe(p.using())
		.pipe(p.concat('vendors.js'))
		.pipe(gulp.dest('dist/js/vendors'))
		.pipe(jsFilter.restore())		
});

gulp.task('scripts', function() {
	return gulp.src('app/scripts/**/*.js')
		.pipe(p.concat('main.js'))
		.pipe(p.ngAnnotate())
		.pipe(p.uglify())
		.pipe(gulp.dest('dist/js/'))			
});

gulp.task('templateCache', function() {
	return gulp.src('app/views/**/*.html')
		.pipe(p.angularTemplatecache({module:'ngTweet'}))
		.pipe(gulp.dest('dist/js/'));
});

var sources = gulp.src(['dist/js/*js', 'dist/css/*.min.css'], {read:false});
var bowerSource = gulp.src(['dist/js/vendors/*.js', 'dist/css/vendors/*.min.css'], {read:false});

gulp.task('index', function() {
	gulp.src('app/index.html')
		.pipe(gulp.dest('dist/'));

});

gulp.task('watch', function() {	
//	p.livereload.listen();
	gulp.watch('app/index.html', ['index']);
	gulp.watch('app/styles/**/*.scss', ['styles']).on('change', p.livereload.changed);
	gulp.watch('app/scripts/**/*.js', ['scripts']).on('change', p.livereload.changed);
	gulp.watch('app/views/**/*.html', ['templateCache']).on('change', p.livereload.changed);
	gulp.watch('dist/index.html').on('change', p.livereload.changed);
});

gulp.task('server', function() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static(__dirname+'/dist/'));
  	app.listen(4000, '0.0.0.0');	
});


gulp.task('build', ['deps','scripts','styles','templateCache', 'index','copyFonts']);

gulp.task('default', ['deps','server','scripts','styles','templateCache','index','copyFonts','watch']);


