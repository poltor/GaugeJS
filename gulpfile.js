var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');


var paths = {
	scripts: {
		src: ['src/js/gauge.js'],
		dist: 'dist/js/',
		watch: ['src/js/**/*.js']
	},
	styles: {
		src: ['src/css/gauge.css'],
		dist: 'dist/css/',
		watch: ['src/less/**/*.less']
	}
};


gulp.task('styles', function() {
	return gulp.src(paths.styles.src)
		.pipe(minifyCss())
		.pipe(gulp.dest(paths.styles.dist));
});

gulp.task('scripts', function() {
	return gulp.src(paths.scripts.src)
		.pipe(uglify())
        .pipe(gulp.dest(paths.scripts.dist));
});