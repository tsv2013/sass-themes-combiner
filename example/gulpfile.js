'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
//var sassThemesCombiner = require('../sass-themes-combiner.js');
var sassThemesCombiner = require('gulp-sass-themes-combiner');

gulp.task("sass", function () {
    var themesCombiner = sassThemesCombiner('./styles/themes/_*.scss', { debug: true });

    return gulp.src(['./styles/**/*.scss'])
      .pipe(themesCombiner.init())
      .pipe(sass.sync().on("error", sass.logError))
      .pipe(themesCombiner.combine('mySite'))
      .pipe(gulp.dest('./dist/styles'));
});
