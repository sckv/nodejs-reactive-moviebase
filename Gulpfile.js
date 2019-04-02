/* eslint-disable security/detect-non-literal-require */
const babel = require('gulp-babel');
const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const nodemon = require('gulp-nodemon');

const frontPath = path.join(process.cwd(), 'client');
const tsFrontProject = ts.createProject(path.join(frontPath, 'tsconfig.json'));
const buildFrontPath = path.join(frontPath, 'build');

const backPath = path.join(process.cwd(), 'server');
const buildBackPath = path.join(backPath, 'build');
const tsBackProject = ts.createProject(path.join(backPath, 'tsconfig.json'));

gulp.task('build:client', () => {
  return gulp
    .src(buildFrontPath, {read: false, allowEmpty: true})
    .pipe(clean())
    .pipe(webpackStream(require(path.join(frontPath, 'config/webpack.gulp.js')), webpack))
    .pipe(gulp.dest(buildFrontPath))
    .pipe(tsFrontProject.src())
    .pipe(tsFrontProject())
    .js.pipe(
      babel({
        configFile: path.join(process.cwd(), 'babel.config.front.js'),
      }),
    )
    .pipe(gulp.dest(buildFrontPath));
});

gulp.task('compile:server', () => {
  return gulp
    .src(buildBackPath, {read: true, allowEmpty: true})
    .pipe(clean())
    .pipe(tsBackProject.src())
    .pipe(tsBackProject())
    .js.pipe(
      babel({
        configFile: path.join(process.cwd(), 'babel.config.back.js'),
      }),
    )
    .pipe(gulp.dest(buildBackPath));
});

gulp.task('nodemon:server', () => {
  return nodemon({
    script: 'server/build/start.js',
    watch: 'server/src',
    ext: 'ts',
    tasks: ['compile:server'],
    done: false,
  });
});
