const gulp = require("gulp");
const ejs = require("gulp-ejs");
const rename = require("gulp-rename");
const connect = require("gulp-connect");
let sass = require("gulp-sass");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");

sass.compiler = require("node-sass");

// require libarys

// ---------COMPILERS----------

// HTML Files Rename - Pretty-Urls

const html = done => {
  gulp
    .src("src/html/templates/*.ejs")
    .pipe(ejs().on("error", err => console.log(err)))
    .pipe(
      rename(path => {
        if (path.basename != "index") {
          path.dirname = path.basename;
          path.basename = "index";
        }
        path.extname = ".html";
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
  done();
};

// SCSS Files Compiler

const scss = done => {
  gulp
    .src("src/css/**/*.scss")
    .pipe(sass().on("error", err => console.log(err)))
    .pipe(gulp.dest("dist/assets/css"))
    .pipe(connect.reload());
  done();
};

// Javascript Compiler

const javascript = done => {
  gulp
    .src(".src/javascript/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(gulp.dest("./dist/assets/javascript"))
    .pipe(connect.reload());
  done();
};

// Json Compiler

const json = done => {
  gulp
    .src("./src/json/*.json")
    .pipe(gulp.dest("./dist/data"))
    .pipe(connect.reload());
  done();
};

// Image Compiler

const images = done => {
  gulp
    .src(".src/images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/assets/images"))
    .pipe(connect.reload());
  done();
};

// --------------WATCHERS-----------

// Watch HTML

const watchHtml = () => {
  gulp.watch(
    "./src/html/**/*.ejs",
    {
      ignoreInitial: false
    },
    html
  );
};

// Watch SCSS

const watchScss = () => {
  gulp.watch(
    "./src/css/**/*.scss",
    {
      ignoreInitial: false
    },
    scss
  );
};

// Watch SCSS

const watchJavascript = () => {
  gulp.watch(
    "./src/javascript/**/*.js",
    {
      ignoreInitial: false
    },
    javascript
  );
};

// Watch Json

const watchJson = () => {
  gulp.watch(
    "./src/json/*.json",
    {
      ignoreInitial: false
    },
    json
  );
};

// Watch Json

const watchImages = () => {
  gulp.watch(
    "./src/images/**/**",
    {
      ignoreInitial: false
    },
    images
  );
};

// develop task

gulp.task("dev", done => {
  watchHtml();
  watchScss();
  watchJavascript();
  watchJson();
  watchImages();
  connect.server({
    livereload: true,
    root: "dist"
  });
  done();
});

// Build

gulp.task("build", done => {
  html(done);
  scss(done);
  javascript(done);
  json(done);
  images(done);
  done();
});
