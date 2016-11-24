import gulp from 'gulp'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import sass from 'gulp-sass'
import sourcemaps from "gulp-sourcemaps"
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import nodemon from 'gulp-nodemon'
import path from 'path'
import concat from 'gulp-concat'
import browserSync from 'browser-sync'

const reload = browserSync.reload;
const port = process.env.port || 8000;

gulp.task('js', () => gulp.src([
    // './lib/three.js-master/build/three.min.js',
    // './lib/three.js-master/examples/js/loaders/BinaryLoader.js',
    // './lib/three.js-master/examples/js/Detector.js',
    // './lib/three.js-master/examples/js/libs/stats.min.js',
    './src/js/app/index.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(concat('app.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./src/js'))
  .pipe(reload({stream:true})));


gulp.task('sass', () => gulp.src('./src/styles/app.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./src/styles/'))
  .pipe(reload({stream:true})));

gulp.task('build-js', () => gulp.src(['./src/js/app/index.js'])
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015'],
  }))
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dest/js'))
  .pipe(reload({stream:true})));

gulp.task('build-sass', () => gulp.src('./src/styles/app.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    cssnano()
  ]))
  .pipe(gulp.dest('./dest/styles/'))
  .pipe(reload({stream:true})));

gulp.task('nodemon', cb => {
  let called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'src/**/*.js',
      'node_modules/**/*.js',
      'dist/**/*.js'
    ],
    env: {
      'NODE_ENV': 'development',
      'PORT': port
    },
  }).on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  }).on('restart', () => {
    console.log('Ndoemon restarted!');
  });
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    server: {
        baseDir: 'src'
    }
  });
});

gulp.task('copy', () => {
  gulp.src('./src/index.html')
    .pipe(gulp.dest('./dest/'));
  gulp.src('./src/textures/*')
    .pipe(gulp.dest('./dest/textures/'));
});

gulp.task('build', ['build-js', 'build-sass', 'copy']);

gulp.task('default', ['nodemon', 'sass', 'js', 'browser-sync'], () => {
  gulp.watch('./src/styles/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/*.html').on('change', reload);
});