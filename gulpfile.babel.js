import del from "del";
import gulp from "gulp";
import babel from "gulp-babel";

/* All the gulp tasks */
gulp.task("build", ["clean"], () => {
    gulp.src("src/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("build"));
});

gulp.task("watch", () => gulp.watch("src/**/*.js", ["build"]));

gulp.task("default", ["clean", "build", "watch"]);