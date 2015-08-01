var gulp = require('gulp'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps');

// Webserver Task
gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

// Sass Task
gulp.task('sass', function() {
  gulp.src('./scss/{,*/}*.{scss,sass}')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./css'))
    .pipe(connect.reload());
});

// HTML Task
gulp.task('html', function() {
  gulp.src('./{,*/}*.html')
    .pipe(connect.reload());
});

// Create Gulp Default Task
gulp.task('default', ['html','sass', 'connect'], function () {
  gulp.watch('./scss/{,*/}*.{scss,sass}', ['sass'])
  gulp.watch('./{,*/}*.html', ['html']);
});

