import gulp from "gulp";
import minify from "gulp-minify";

/*
 * Minify public/javascripts
 */


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
};

gulp.task("watch", watchFn);

/*
 * Initialize default
 */

gulp.task("default", () => {
  mainJavascriptFn();
  watchFn();
});
