import gulp from "gulp";
import minify from "gulp-minify";
import concat from "gulp-concat";

/*
 * Minify public/javascripts
 */


 const adminJavascriptFn = () => {

   return gulp.src([
     "public-typescript/admin/main.js",
     "public-typescript/admin/users.js",
     "public-typescript/admin/recordTypes.js",
     "public-typescript/admin/statusTypes.js"
   ], { allowEmpty: true })
   .pipe(concat("admin.js"))
     .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
     .pipe(gulp.dest("public/javascripts"));
 };


const mainJavascriptFn = () => {

  return gulp.src("public-typescript/*.js", { allowEmpty: true })
    .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
    .pipe(gulp.dest("public/javascripts"));
};


/*
 * Watch
 */

const watchFn = () => {
  gulp.watch("public-typescript/*.js", mainJavascriptFn);
  gulp.watch("public-typescript/admin/*.js", adminJavascriptFn);
};

gulp.task("watch", watchFn);

/*
 * Initialize default
 */

gulp.task("default", () => {
  mainJavascriptFn();
  adminJavascriptFn();
  watchFn();
});
