const gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    fileinclude = require('gulp-file-include'),
    spritesmith = require('gulp.spritesmith'),
    connect = require('gulp-connect'),
    webserver = require('gulp-webserver');
    
gulp.task('minjs', () => {
    return gulp.src('js/main.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('js'))
        .pipe(notify({ message: 'minjs task complete' }));
});

gulp.task('exportjs', () => {
    return gulp.src(['./src/js/*.js'])
        //.pipe(rename({ suffix: '.min' }))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(notify({ message: 'minjs task complete' }));
});
gulp.task('sass', () => {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        //.pipe(gulp.dest('./dist/css/')) /**/
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});
gulp.task('mincss', () => {
    return gulp.src('css/*.css')
        //.pipe(concat('sp.css'))
        //.pipe(gulp.dest('css/css'))
        //.pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});
gulp.task('babel', () => {
    // ES6 源码存放的路径
    return gulp.src(['./es6/test.js', './es6/cuke.js', './es6/cont.js'])
        .pipe(babel({
            'presets':  ['es2015']
        }))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(concat('base.js'))
        .pipe(uglify())
        //转换成 ES5 存放的路径
        .pipe(gulp.dest('./dist/js'))
        .pipe(notify({ message: 'es6 task complete' }));
});
gulp.task('fileinclude', () => {
  gulp.src(['src/html/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist/html/'));
});
gulp.task('sprite', () => {
    return gulp.src('./src/images/shop/*.png')
    	.pipe(spritesmith({
	        imgName: 'shop.png',
	        cssName: 'shop.css'
	    }))
	    .pipe(gulp.dest('./dist/images/base/'))
	    .pipe(notify({ message: 'sprite task complete' }));;
});
// 切换 sass
gulp.task('spritesass', () => {
    return gulp.src('./src/images/icon/*.png')
    	.pipe(spritesmith({
	        imgName: 'icon.png',
		    cssName: 'sprite.scss',
		    cssFormat: 'scss'
	    }))
	    .pipe(gulp.dest('./src/sass/base/'))
	    .pipe(notify({ message: 'sprite task complete' }));;
});
gulp.task('connect', () => {
    connect.server({
        //host : '192.168.1.172', //地址，可不写，不写的话，默认localhost 
        port: '8888', //端口号，可不写，默认8000
        root: './', //当前项目主目录
        livereload: true //自动刷新
    });
});
// 自动刷新的 html 路径
gulp.task('html', () =>{
    gulp.src('dist/html/*.html')
    .pipe(connect.reload());
});
gulp.task('watch', () => {
	gulp.watch('dist/css/*.css', ['html']); //监控css文件
    gulp.watch(['dist/js/*.js', 'dist/js/*/*.js'], ['html']);  //监控js文件
    gulp.watch(['dist/html/*.html'], ['html']);  //监控html文件
    gulp.watch(['src/html/*.html', 'src/html/*/*.html'], ['fileinclude']);
    //gulp.watch(['src/js/*.js', 'src/js/*/*.js'], ['exportjs']);
    gulp.watch(['src/sass/*.scss', 'src/sass/*/*.scss', 'src/sass/*/*/*.scss'], ['sass']);
});

// webserver
gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(webserver({
        port: 8888,
        livereload: true,
        directoryListing: true,
        // 启动服务器打开的页面
        open: './dist/html/index.html'
    }));
});
// 默认任务
gulp.task('mx',['webserver','watch']);