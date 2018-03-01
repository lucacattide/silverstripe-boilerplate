// Gulp - Configurazione
'use strict';

// Inclusione Moduli
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const {phpMinify} = require('@cedx/gulp-php-minify');
const size = require('gulp-size');

// Tasks
// HTML
gulp.task('html', () => gulp.src('./html/dist/**/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(size())
  .pipe(gulp.dest('./html/dist'))
);
// PHP
gulp.task('php', () => gulp.src('./php/dist/**/*.php', {
    read: false,
  })
  .pipe(phpMinify())
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(size())
  .pipe(gulp.dest('./php/dist'))
);
// Index
gulp.task('index', () => gulp.src(['./*.html', './*.php'])
  .pipe(htmlmin({
    collapseWhitespace: true,
  }))
  .pipe(size())
  .pipe(gulp.dest('./dist'))
);
// Produzione
gulp.task('dist', [
  'html',
  'php',
  'index',
]);
