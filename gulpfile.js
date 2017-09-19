var gulp                = require('gulp'),
    runSequence         = require('run-sequence'),
    del                 = require('del'),
    uglyfly             = require('gulp-uglyfly'),
    imagemin            = require('gulp-imagemin'),
    sass                = require('gulp-sass');
    concat              = require('gulp-concat');

// clean:dist
gulp.task('clean:dist', function() {
    return del.sync([
        'public/css',
        'public/js',
        'public/img',
        'public/fonts',
        'public/ckeditor'
    ]);
});
// for watching file changes
gulp.task('watch', function() {
    gulp.watch('resources/src/**/*.js', ['js']);
    gulp.watch('resources/src/**/*.scss', ['sass-site', 'sass-admin']);
});
// task for making js files development
gulp.task('js-dev', function() {
    return gulp.src('resources/src/js/**/*.js')
        .pipe( gulp.dest('public/js/'));
});
// task for making js files production
gulp.task('js', function() {
    return gulp.src('resources/src/js/**/*.js')
        .pipe( uglyfly() )
        .pipe( gulp.dest('public/js/'));
});
// task for clone ckeditor files
gulp.task('ckeditor', function() {
    return gulp.src('resources/src/ckeditor/**/*')
        .pipe( gulp.dest('public/ckeditor/'));
});
// task for make css compressed stylesheets admin
gulp.task('sass-admin', function () {
    gulp.src('resources/src/sass/cpanel/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('public/css/cpanel'));
});
// task for make css compressed stylesheets site
gulp.task('sass-site', function () {
    gulp.src('resources/src/sass/site/app.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(gulp.dest('public/css/site'));
});
// task for copy fonts
gulp.task('fonts', function () {
    gulp.src('resources/src/fonts/**/*.*')
    .pipe(gulp.dest('public/fonts/'));
});
// task for build images prod
gulp.task('images-prod', function(){
    return gulp.src('resources/src/img/**/*.+(png|jpg|gif|ico|svg)')
        .pipe(imagemin({
            interlaced: true,
            pngquant: true,
            progressive: true
        }))
        .pipe(gulp.dest('public/img/'));
});
// task for build images dev
gulp.task('images-dev', function(){
    return gulp.src('resources/src/img/**/*.+(png|jpg|gif|ico|svg)')
        .pipe(gulp.dest('public/img/'));
});
// update new files on directories
gulp.task('updateFiles', ['js'], function() {
    gulp.watch('resources/src/**/*.js', ['js']);
});
// task for copy favicons
gulp.task('fav', function () {
    gulp.src('resources/src/fav/**/*.*')
        .pipe(gulp.dest('public/img'));
});
// for development without local server | use `gulp dev`
gulp.task('dev', function () {
    runSequence('clean:dist', ['images-dev', 'js-dev', 'sass-site', 'sass-admin', 'watch', 'fonts', 'ckeditor', 'fav'],
        function () {
            console.log("-----------------");
            console.log("Build successful! Gulp is watching files...");
        }
    );
});
// default | when use `gulp`
gulp.task('default', function () {
    runSequence('clean:dist', ['images-prod', 'js', 'sass-site', 'sass-admin', 'fonts', 'ckeditor', 'fav'],
        function () {
            console.log("-----------------");
            console.log("Build successful!");
        }
    );
});