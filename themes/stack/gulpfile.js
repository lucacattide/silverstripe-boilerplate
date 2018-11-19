// Gulp - Configurazione
'use strict';

// Inclusione Moduli
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');

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
gulp.task('php', () => gulp.src('./php/dist/**/*.php')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(size())
    .pipe(gulp.dest('./php/dist'))
);
// Index
gulp.task('index', () => gulp.src(['./*.html', './*.php'])
    .pipe(htmlmin({
      removeComments: true,
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
