var gulp = require('gulp');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber')
var reload = browserSync.reload

gulp.task('default', function(){

	// browserSync.init({
 	// 		proxy: "http://localhost:8888/HETIC/annee_3/front_end/app-start/"
 	// });
	gulp.watch('js/**/*.js', ['js_app']);
	gulp.watch('js/**/*.js').on('change', reload);

	// gulp.watch('sass/**/*.scss', ['sass']);
	// gulp.watch('sass/**/*.scss').on('change', reload);
});

gulp.task('js_app', function(){

	return gulp.src('js/app/**/*.js')
		// .pipe(plumber({
		// 	errorHandler: function (error) {
		// 		console.log(error.message);
		// 		this.emit('end')
		// 	}
		// }))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('js/dist/'));

});

gulp.task('sass', function(){

	return gulp.src('sass/**/*.scss')
		// .pipe(plumber({
		// 	errorHandler: function (error) {
		// 		console.log(error.message);
		// 		this.emit('end')
		// 	}
		// }))
		.pipe(sass({
			indentedSyntax: false
		}))
		.pipe(gulp.dest('stylesheets/'))

})