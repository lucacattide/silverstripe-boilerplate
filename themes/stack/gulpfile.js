// Gulp - Configuration
'use strict';

// Modules import
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const {
  phpMinify
} = require('@cedx/gulp-php-minify');

// Tasks
// HTML
gulp.task('html', () => gulp.src('./html/dist/**/*.html')
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(size())
  .pipe(gulp.dest('./html/dist'))
);
// PHP
gulp.task('php', () => gulp.src('./php/dist/**/*.php', {
    read: false,
  })
  .pipe(phpMinify({
    silent: true,
  }))
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(size())
  .pipe(gulp.dest('./php/dist'))
);
// Index
gulp.task('index', () => gulp.src([
    './*.html',
    './*.php'
  ], {
    read: false,
  })
  .pipe(phpMinify({
    silent: true,
  }))
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(size())
  .pipe(gulp.dest('./dist'))
);
// Produzione
gulp.task('dist', gulp.parallel(
  'html',
  'php',
  'index',
));
