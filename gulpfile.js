// Include gulp
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var ngmin = require('gulp-ngmin');
var minifyHtml = require('gulp-minify-html');
var usemin = require('gulp-usemin');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

var paths = {
    login:['./public/login/*.js', './public/login/*.html'],
    dashboard: ['./public/dashboard/*.js', './public/dashboard/*.html'],
    scripts: ['public/**/*.js' ,'!./public/bower_components/**/*.js'],
    html: [
        './public/**/*.html',
        '!index.html',
        '!./bower_components/**/*.html'
    ],
    scss: './public/scss/**/*.scss',
    css: './public/stylesheets/**/*.css',
    index: 'public/index.html',
    build: './build/'
}

gulp.task('copy', ['delete-build'], function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest('build/'));
});

gulp.task('usemin', ['copy'], function() {
    return gulp.src(paths.html)
        .pipe(usemin())
        .pipe(gulp.dest(paths.build))
});

gulp.task('minify-css', function() {
    return gulp.src(paths.css)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('js', function() {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(gulp.dest(paths.build));
})

gulp.task('jshint', function() {
    return gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
    return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('nodemon', ['jshint', 'sass'], function(cb) {
    gulp.watch(paths.scripts, ['jshint']);
    gulp.watch(paths.scss, ['sass']);
    var started = false;
    return nodemon({
        script: 'app.js',
        ext: 'css html js scss'
    }).on('start', function() {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });


});

gulp.task('delete-build', function() {
    return del(['./build/**/*']);
})

gulp.task('build', ['usemin', 'js', 'minify-css', 'sass', 'jshint']);

gulp.task('default', ['nodemon']);
