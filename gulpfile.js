const browserSync = require('browser-sync');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');

const env = process.env.NODE_ENV;

let html = { src: ['src/html/*.html', 'src/html/**/*.html'], dest: 'public' };
let meta = { src: ['src/meta/*'], dest: 'public' };
let assets = {
  scripts: {
    src: ['src/assets/js/*', 'src/assets/js/**/*'],
    dest: 'public/assets/js'
  },
  styles: {
    src: ['src/assets/scss/*.scss', 'src/assets/scss/**/*.scss'],
    dest: 'public/assets/css'
  },
  images: {
    src: ['src/assets/img/*', 'src/assets/img/**/*'],
    dest: 'public/assets/img'
  },
  fonts: {
    src: ['src/assets/fonts/*', 'src/assets/fonts/**/*'],
    dest: 'public/assets/fonts'
  }
};

// BrowserSync
gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './public/'
    }
  });
});

// Pipeline
gulp.task('html', function () {
  return gulp
    .src(html.src)
    .pipe(gulp.dest(html.dest))
    .pipe(browserSync.stream());
});

gulp.task('meta', function() {
  return gulp
    .src(meta.src)
    .pipe(gulp.dest(meta.dest))
    .pipe(browserSync.stream());
});

gulp.task('assets:scripts', function () {
  return gulp
    .src(assets.scripts.src)
    .pipe(gulp.dest(assets.scripts.dest))
    .pipe(browserSync.stream());
});

gulp.task('assets:styles', function () {
  gulp
    .src(assets.styles.src)
    .pipe(sourcemaps.init())

    // scss output compressed if production or expanded if development
    .pipe(gulpif(env === 'production', sass({
          outputStyle: 'compressed'
        }), sass({ outputStyle: 'expanded' })))
    .pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest(assets.styles.dest))
    .pipe(browserSync.stream());
});

gulp.task('assets:images', function() {
  return gulp
    .src(assets.images.src)
    .pipe(gulp.dest(assets.images.dest))
    .pipe(browserSync.stream());
});

gulp.task('assets:fonts', function() {
  return gulp
    .src(assets.fonts.src)
    .pipe(gulp.dest(assets.fonts.dest))
    .pipe(browserSync.stream());
});

gulp.task('clean:maps', (env === 'production', deleteMapsFolder));

function deleteMapsFolder() {
  return del(['public/maps/**']);
}

// Watch
gulp.task('watch', function () {
  gulp.watch(html.src, ['html']);
  gulp.watch(meta.src, ['meta']);
  gulp.watch(assets.scripts.src, ['assets:scripts']);
  gulp.watch(assets.styles.src, ['assets:styles']);
  gulp.watch(assets.images.src, ['assets:images']);
  gulp.watch(assets.fonts.src, ['assets:fonts']);
});

// Default
gulp.task('default',
  gulpif(env === 'production',
    ['html', 'meta', 'assets:scripts', 'assets:styles', 'assets:images', 'assets:fonts', 'clean:maps'],
    ['html', 'meta', 'assets:scripts', 'assets:styles', 'assets:images', 'assets:fonts', 'browserSync', 'clean:maps', 'watch']
  )
);
