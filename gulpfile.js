var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('default', function() {
  gulp.src(['assets/stylesheets/*.css', '!assets/stylesheets/about.cssa'])
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('assets/stylesheets'))
});

gulp.task('about', function() {
  gulp.src('assets/stylesheets/about.css')
    .pipe(minifyCSS())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('about.min.css'))
    .pipe(gulp.dest('assets/stylesheets'))

})
