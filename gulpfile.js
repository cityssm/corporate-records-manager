import gulp from "gulp";
import minify from "gulp-minify";
const mainJavascriptFn = () => {
    return gulp.src("public-typescript/*.js", { allowEmpty: true })
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest("public/javascripts"));
};
const watchFn = () => {
    gulp.watch("public-typescript/*.js", mainJavascriptFn);
};
gulp.task("watch", watchFn);
gulp.task("default", () => {
    mainJavascriptFn();
    watchFn();
});
