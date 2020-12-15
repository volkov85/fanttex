const {src, dest, watch, series, parallel} = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemaps = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const cssnano = require(`cssnano`);
const rename = require(`gulp-rename`);
const pug = require(`gulp-pug`);
const htmlmin = require(`gulp-htmlmin`);
const rigger = require(`gulp-rigger`);
const babel = require(`gulp-babel`);
const uglify = require(`gulp-uglify`);
const modernizr = require(`gulp-modernizr`);
const imagemin = require(`gulp-imagemin`);
const imageminPngquant = require(`imagemin-pngquant`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);
const webp = require(`gulp-webp`);
const del = require(`del`);
const browserSync = require(`browser-sync`).create();

// Компиляция файлов *.css из *.scss с автопрефиксером и минификацией
function css() {
  return src(`source/scss/*.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: require(`scss-resets`).includePaths
    }).on(`error`, sass.logError))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/css`))
    .pipe(browserSync.stream());
}
exports.css = css;

// Компиляция файлов *.html из *.pug с минификацией
function html() {
  return src(`source/*.pug`)
    .pipe(pug())
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(dest(`build`));
}
exports.html = html;

// Минификация файлов скриптов *.js
function js() {
  return src(`source/js/*.js`, {
    allowEmpty: true
  })
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(babel({
      presets: [`@babel/env`]
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/js`));
}
exports.js = js;

// Копирование файлов библиотек *.css
function csslibs() {
  return src([
    `node_modules/photoswipe/dist/default-skin/**`,
    `!node_modules/photoswipe/dist/default-skin/*.css`
  ])
    .pipe(dest(`build/css`));
}
exports.csslibs = csslibs;

// Копирование файлов библиотек *.js
function jslibs() {
  return src([
    `node_modules/lozad/dist/lozad.min.{js,js.map}`,
    `node_modules/swup/dist/swup.min.{js,js.map}`,
    `node_modules/@swup/body-class-plugin/dist/SwupBodyClassPlugin.min.{js,js.map}`,
    `node_modules/@swup/scroll-plugin/dist/SwupScrollPlugin.min.{js,js.map}`,
    `node_modules/swiper/swiper-bundle.min.{js,js.map}`,
    `node_modules/lottie-web/build/player/lottie_svg.min.{js,js.map}`,
    `node_modules/imask/dist/imask.min.{js,js.map}`,
    `node_modules/aos/dist/aos.{js,js.map}`,
    `node_modules/photoswipe/dist/photoswipe.min.{js,js.map}`,
    `node_modules/photoswipe/dist/photoswipe-ui-default.min.{js,js.map}`
  ])
    .pipe(dest(`build/js/vendors`));
}
exports.jslibs = jslibs;

// Генерация файла библиотеки Modernizr
function modzr() {
  return src(`fake`, {
    allowEmpty: true
  })
    .pipe(modernizr({
      options: [`setClasses`],
      crawl: false,
      tests: [`webp`]
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`build/js/vendors`));
}
exports.modzr = modzr;

// Сжатие файлов изображений
exports.img = () => {
  return src(`source/img/*.{png,jpg,svg}`)
    .pipe(imagemin([
      imageminPngquant({
        speed: 1,
        strip: true,
        quality: [0.7, 0.9]
      }),
      imageminMozjpeg({
        quality: 80
      }),
      imagemin.svgo()
    ]))
    .pipe(dest(`build/img`));
};

// Генерация файлов изображений в формате *.webp
exports.webp = () => {
  return src(`source/img/*.{png,jpg}`)
    .pipe(webp({
      quality: 80,
      alphaQuality: 80,
      method: 6
    }))
    .pipe(dest(`build/img`));
};

// Удаление файлов в папке build перед копированием
function clean() {
  return del(`build`);
}
exports.clean = clean;

// Копирование файлов в папку build
function copy() {
  return src([
    `source/animations/**`,
    `source/fonts/**/*.{woff,woff2}`,
    `source/img/**`,
    `source/img/icon-*.svg`,
    `source/*.ico`
  ], {
    base: `source`
  })
    .pipe(dest(`build`));
}
exports.copy = copy;

// Запуск сервера Browsersync
function server() {
  browserSync.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch(`source/scss/**/*.scss`, css);
  watch(`source/js/*.js`, series(js, refresh));
  watch(`source/**/*.pug`, series(html, refresh));
}
exports.server = server;

// Автообновление страницы
function refresh(done) {
  browserSync.reload();
  done();
}
exports.refresh = refresh;

// Создание сборки проекта
exports.build = series(
  clean,
  parallel(copy, css, js, csslibs, jslibs, html)
);

// Создание сборки проекта и запуск сервера Browsersync
exports.start = series(
  clean,
  parallel(copy, css, js, csslibs, jslibs, html),
  server
);
