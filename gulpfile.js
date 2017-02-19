// Include gulp
var gulp = require('gulp'); 
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var del = require('del');

var paths = {
  scripts: [ './public/js/**/*.js', '!./public/bower_components/**/*.js' ],
  html: [
    './public/views/**/*.html',
    '!index.html',
    '!./bower_components/**/*.html'
  ],
  scss:'./public/scss/*.scss',
  index: 'public/index.html',
  build: './build/'
}
/* 1 */
// gulp.task('clean', function(){
//   gulp.src( paths.build, { read: false } )
//     .pipe(clean());
// });

gulp.task('copy', [ 'cleanbuild' ], function() {
  gulp.src( paths.html )
    .pipe(gulp.dest('build/'));
});

gulp.task('usemin', [ 'copy' ], function(){
  gulp.src( paths.index )
    .pipe(usemin({
      css: [ minifyCss(), 'concat' ],
      js: [ ngmin(), uglify() ]
    }))
    .pipe(gulp.dest( paths.build ))
});

gulp.task('js', function () {
  gulp.src(paths.scripts)
    .pipe(concat('appbuild-min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build + 'js'));
})

gulp.task('jshint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
    return gulp.src('./public/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('nodemon', function (cb) {
  var started = false;
  return nodemon({
    script: 'app.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true; 
    } 
  });
});

gulp.task('serve', ['jshint', 'sass','nodemon'], function () {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    });
    gulp.watch(paths.scripts, ['jshint']);
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.index).on('change', browserSync.reload);
    gulp.watch(paths.scripts).on('change', browserSync.reload);
    gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('cleanbuild', function(){
  return del(['./build/**/*']);
})

gulp.task('build', ['usemin','js','sass']);

gulp.task('default', ['serve']);