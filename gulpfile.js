var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var del = require('del');
var inject = require('gulp-inject');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');

var paths = {
  styles: {
    src: './public/css/*.scss',
    dest: './build/public/css/'
  },
  scripts: {
    src: './public/js/*.js',
    dest: './build/public/js/'
  },
  views: {
    src: './app/views/**/**.handlebars',
    dest: './build/views/'
  }
};

function clean() {
  return del([ 
    './build/'
  ]);
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(livereload());
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true, allowEmpty: true })
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function views() {
  return gulp.src(paths.views.src)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.views.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.views.src, index);
}

function develop() {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee handlebars',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', (chunk) => {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
}

function vendors() {
  gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ])
  .pipe(concat('vendor.min.js'))
  .pipe(gulp.dest('./build/public/js/'))
  
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('./build/public/css/'));
}

function index() {
  var target = gulp.src('./build/views/layouts/main.handlebars');
  var sources = gulp.src([ './build/public/js/*.min.js', './build/public/css/*.css'], {read: false});
  return target.pipe(inject(sources))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./build/views/layouts'));
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.develop = develop;
exports.index = index;
exports.vendors = vendors;
exports.views = views;

var build = gulp.series(clean, styles, scripts, views, vendors, index, gulp.parallel(develop, watch));

gulp.task('default', build);
