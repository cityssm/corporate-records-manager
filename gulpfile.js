import gulp from "gulp";
import minify from "gulp-minify";
import concat from "gulp-concat";
const adminJavascriptFunction = () => {
    return gulp.src([
        "public-typescript/admin/main.js",
        "public-typescript/admin/users.js",
        "public-typescript/admin/recordTypes.js",
        "public-typescript/admin/statusTypes.js",
        "public-typescript/admin/recordUserTypes.js",
        "public-typescript/admin/tableCleanup.js"
    ], { allowEmpty: true })
        .pipe(concat("admin.js"))
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest("public/javascripts"));
};
const editJavascriptFunction = () => {
    return gulp.src([
        "public-typescript/edit/main.js",
        "public-typescript/edit/recordStatuses.js",
        "public-typescript/edit/recordUsers.js",
        "public-typescript/edit/recordURLs.js",
        "public-typescript/edit/relatedRecords.js",
        "public-typescript/edit/recordComments.js"
    ], { allowEmpty: true })
        .pipe(concat("edit.js"))
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest("public/javascripts"));
};
const mainJavascriptFunction = () => {
    return gulp.src("public-typescript/*.js", { allowEmpty: true })
        .pipe(minify({ noSource: true, ext: { min: ".min.js" } }))
        .pipe(gulp.dest("public/javascripts"));
};
const watchFunction = () => {
    gulp.watch("public-typescript/*.js", mainJavascriptFunction);
    gulp.watch("public-typescript/admin/*.js", adminJavascriptFunction);
    gulp.watch("public-typescript/edit/*.js", editJavascriptFunction);
};
gulp.task("watch", watchFunction);
gulp.task("default", () => {
    mainJavascriptFunction();
    adminJavascriptFunction();
    editJavascriptFunction();
    watchFunction();
});
