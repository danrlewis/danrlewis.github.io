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

// Gulp Sass Task
gulp.task('sass', function() {
    gulp.src('./scss/{,*/}*.{scss,sass}')
      .pipe(sourcemaps.init())
      .pipe(sass({
        errLogToConsole: true
      }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./css'));
})



// Create Gulp Default Task
// ------------------------
// Having watch within the task ensures that 'sass' has already ran before watching
//
// This setup is slightly different from the one on the blog post at
// http://www.zell-weekeat.com/gulp-libsass-with-susy/#comment-1910185635
gulp.task('default', ['sass', 'connect'], function () {
  gulp.watch('./scss/{,*/}*.{scss,sass}', ['sass'])
});

