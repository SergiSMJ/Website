// This gulp workflow was started with carloscuesta starterkit yeoman generator
// https://github.com/carloscuesta/starterkit

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    uncss = require('gulp-uncss'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    ghPages = require('gulp-gh-pages'),
    cssimport = require('gulp-cssimport'),
    beautify = require('gulp-beautify'),
    sourcemaps = require('gulp-sourcemaps'),
    critical = require('critical').stream,
    svgIcons = require('gulp-svg-icons'),
    icons = new svgIcons('src/icons'),
    inlinesource = require('gulp-inline-source');

//* baseDirs: baseDirs for the project */

var baseDirs = {
    dist:'dist/',
    src:'src/',
    assets: 'dist/assets/'
};

/* routes: object that contains the paths */

var routes = {
    styles: {
        scss: baseDirs.src+'styles/*.scss',
        _scss: baseDirs.src+'styles/_includes/*.scss',
        css: baseDirs.assets+'css/'
    },

    templates: {
        html: baseDirs.src+'templates/*.html'
    },

    scripts: {
        base:baseDirs.src+'scripts/',
        js: baseDirs.src+'scripts/*.js',
        jsmin: baseDirs.assets+'js/'
    },

    files: {
        html: 'dist/',
        images: baseDirs.src+'images/*',
        imgmin: baseDirs.assets+'files/img/',
        cssFiles: baseDirs.assets+'css/*.css',
        htmlFiles: baseDirs.dist+'*.html',
        styleCss: baseDirs.assets+'css/style.css'
    },

    deployDirs: {
        baseDir: baseDirs.dist,
        baseDirFiles: baseDirs.dist+'**',
        ftpUploadDir: 'FTP-DIRECTORY'
    }
};

/* Compiling Tasks */

// Templating

gulp.task('templates', function() {
    return gulp.src(routes.templates.html)
        .pipe(minifyHTML({
            empty:true,
            quotes:true,
            cdata:true,
            conditionals:true
        }))
        .pipe(browserSync.stream())
        .pipe(gulp.dest(routes.files.html))
        .pipe(notify({
            title: 'HTML minified succesfully!',
            message: 'templates task completed.',
            onLast: true
        }));
});

// SCSS

gulp.task('styles', function() {
    return gulp.src(routes.styles.scss)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "Error: Compiling SCSS.",
                message:"<%= error.message %>"
            })
        }))
        .pipe(sourcemaps.init())
            .pipe(sass({
                outputStyle: 'compressed'
            }))
            .pipe(autoprefixer('last 3 versions'))
        .pipe(sourcemaps.write())
        .pipe(cssimport({}))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(routes.styles.css))
        .pipe(browserSync.stream())
        .pipe(notify({
            title: 'SCSS Compiled and Minified succesfully!',
            message: 'scss task completed.',
            onLast: true
        }));
});

/* Scripts (js) ES6 => ES5, minify and concat into a single file.*/

gulp.task('scripts', function() {
    return gulp.src(routes.scripts.js)
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "Error: Babel and Concat failed.",
                message:"<%= error.message %>"
            })
        }))
        .pipe(sourcemaps.init())
            .pipe(concat('script.js'))
            .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(routes.scripts.jsmin))
        .pipe(browserSync.stream())
        .pipe(notify({
            title: 'JavaScript Minified and Concatenated!',
            message: 'your js files has been minified and concatenated.',
            onLast: true
        }));
});

/* Image compressing task */

gulp.task('images', function() {
    gulp.src(routes.files.images)
        .pipe(imagemin())
        .pipe(gulp.dest(routes.files.imgmin));
});

//Deploy to github pages

gulp.task('gh-pages', function() {
    return gulp.src(routes.deployDirs.baseDirFiles)
        .pipe(ghPages({
            message: 'Yo! Updating and pushing [timestap]'
        }));
});

/* Preproduction beautifiying task (SCSS, JS) */

gulp.task('beautify', function() {
    gulp.src(routes.scripts.js)
        .pipe(beautify({indentSize: 4}))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "Error: Beautify failed.",
                message:"<%= error.message %>"
            })
        }))
        .pipe(gulp.dest(routes.scripts.base))
        .pipe(notify({
            title: 'JS Beautified!',
            message: 'beautify task completed.',
            onLast: true
        }));
});

/* Serving (browserSync) and watching for changes in files */

gulp.task('serve', function() {
    browserSync.init({
        server: './dist/'
    });

    gulp.watch([routes.styles.scss, routes.styles._scss], ['styles']);
    gulp.watch(routes.templates.html, ['templates']);
    gulp.watch(routes.scripts.js, ['scripts', 'beautify']);
});

/* Optimize your project */

gulp.task('uncss', function() {
    return gulp.src(routes.files.cssFiles)
        .pipe(uncss({
            html:[routes.files.htmlFiles],
            ignore:['*:*']
        }))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "Error: UnCSS failed.",
                message:"<%= error.message %>"
            })
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest(routes.styles.css))
        .pipe(notify({
            title: 'Project Optimized!',
            message: 'UnCSS completed!',
            onLast: true
        }));
});

/* Extract CSS critical-path */

gulp.task('critical', function () {
    return gulp.src(routes.files.htmlFiles)
        .pipe(critical({
            base: baseDirs.dist,
            inline: true,
            html: routes.files.htmlFiles,
            css: routes.files.styleCss,
            ignore: ['@font-face',/url\(/],
            width: 1300,
            height: 900
        }))
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "Error: Critical failed.",
                message:"<%= error.message %>"
            })
        }))
        .pipe(gulp.dest(baseDirs.dist))
        .pipe(notify({
            title: 'Critical Path completed!',
            message: 'css critical path done!',
            onLast: true
        }));
});

gulp.task('icons', function() {
    return gulp.src(routes.templates.html)
        .pipe(icons.replace())
        .pipe(gulp.dest(routes.files.html));
});

gulp.task('inject', ['icons'], function() {
    return gulp.src('src/templates/index.html')
        .pipe(icons.inject())
        .pipe(gulp.dest(routes.files.html));
});

gulp.task('inlinesource', function () {
    return gulp.src(routes.templates.html)
        .pipe(inlinesource())
        .pipe(minifyHTML({
            empty:true,
            quotes:true,
            cdata:true,
            conditionals:true
        }))
        .pipe(gulp.dest(routes.files.html));
});

gulp.task('svg', ['icons', 'inject']);

gulp.task('dev', ['templates', 'styles', 'scripts',  'images', 'serve']);

gulp.task('build', ['templates', 'styles', 'scripts', 'images']);

gulp.task('optimize', ['uncss', 'critical', 'images']);

gulp.task('deploy', ['optimize',  'gh-pages']);

gulp.task('default', function() {
    gulp.start('dev');
});
