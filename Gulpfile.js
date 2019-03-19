/* eslint-disable security/detect-non-literal-require */
const babel = require('gulp-babel');
const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');

gulp.task('build:client', () => {
  const frontPath = path.join(process.cwd(), 'client');
  const tsProject = ts.createProject(path.join(frontPath, 'tsconfig.json'));

  return gulp
    .src(path.join(frontPath, 'build'), {read: false, allowEmpty: true})
    .pipe(clean())
    .pipe(
      webpackStream(
        require(path.join(frontPath, 'config/webpack.gulp.js')),
        webpack,
      ),
    )
    .pipe(gulp.dest(path.join(frontPath, 'build')))
    .pipe(tsProject.src().pipe(tsProject()))
    .js.pipe(
      babel({
        configFile: path.join(__dirname, 'babel.config.front.js'),
      }),
    )
    .pipe(gulp.dest(path.join(frontPath, 'build')));
});
