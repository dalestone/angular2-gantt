var gulp = require('gulp');
var uglify = require('gulp-uglify');

var dependencies = [
	'es6-shim/es6-shim.min.js',
	'zone.js/dist/zone.js',
	'reflect-metadata/Reflect.js',
	'systemjs/dist/system.src.js',
	'rxjs/**/*.js',
	'@angular/**/*.js',
];

var modules = [
	// Example: 'iconv-lite/**/*',
];

gulp.task("resources", () => {
	return gulp.src(["src/resources/**/*"])
		.pipe(gulp.dest("./build/"))
});

gulp.task("modules", () => {
	return gulp.src(modules, {cwd: "node_modules/**"})
		.pipe(gulp.dest("./build/node_modules/"));
});

gulp.task("libs", () => {
	return gulp.src(dependencies, {cwd: "node_modules/**"})
		.pipe(gulp.dest("./build/libs/"));
});

gulp.task('styles', () => {
	var postcss      = require('gulp-postcss');
	var autoreset    = require('postcss-autoreset');
	var simplevars   = require('postcss-simple-vars');
	var nested       = require('postcss-nested');
	var lost         = require('lost');
	var cssnext      = require('postcss-cssnext');
	var processors = [
		autoreset({
			reset: {
				margin: 0,
				padding: 0,
				borderRadius: 0,
			},
		}),
		simplevars(),
		nested(),
		lost(),
		cssnext(),
	];
	return gulp.src('./src/styles/*.css')
		.pipe(postcss(processors))
		.pipe(gulp.dest('./build/'));
});


gulp.task('ts-app', () => {
	var ts = require('gulp-typescript');
	var project = ts.createProject('tsconfig-app.json');
	return project.src()
		.pipe(ts(project))
		.pipe(uglify())
		.pipe(gulp.dest('./build/app'));
});

gulp.task('templates', () => {
	var pug  = require('gulp-pug');
	return gulp.src(['./src/templates/**/*.pug'])
		.pipe(pug({
			pretty: true
		}))
		.on('error', console.log)
	.pipe(gulp.dest('./build/'))
});

gulp.task('ts', ['ts-app']);

gulp.task('build', ['templates', 'resources', 'styles', 'ts', 'libs', 'modules']);

gulp.task('watch', ['build'], () => {
	gulp.watch('./src/app/**/*', ['ts-app']);
	gulp.watch('./src/resources/**/*', ['resources']);
	gulp.watch('./src/styles/**/*', ['styles']);
	gulp.watch('./src/templates/**/*', ['templates']);
});
