var gulp = require('gulp'),
gutil = require('gulp-util'),
coffee = require('gulp-coffee'),
browserify = require('gulp-browserify'),
compass = require('gulp-compass'),
//connect = require('gulp-connect'),
sass = require('gulp-ruby-sass'),
autoprefixer = require('gulp-autoprefixer'),
minifycss = require('gulp-minify-css'),
webserver = require('gulp-webserver'),
gulpif = require('gulp-if'),
uglify = require('gulp-uglify'),
minifyHTML = require('gulp-minify-html'),
jsonminify = require('gulp-jsonminify'),
imagemin = require('gulp-imagemin'),
pngcrush = require('imagemin-pngcrush'),
phonegapBuild = require('gulp-phonegap-build'),
o = require('open'),
ripple = require('ripple-emulator'),
haml = require('gulp-haml'),
concat = require('gulp-concat');


//Variable Declaration
var env,
coffeeSources,
jsSources,
sassSources,
cssSources,
htmlSources,
jsonSources,
outputDir,
sassStyle;


//ENVIROMENT VARS
// change local variables based on program envirorment variables
// set the mode with NODE_ENV = ""
env = process.env.NODE_ENV || 'development';

if (env === 'development'){
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'app/';
  sassStyle = 'compressed';
}


//Data Sources
coffeeSources = [
 'development/coffee/*.coffee',
]
jsSources = [
 'bower_components/jquery/dist/jquery.js',
 'bower_components/jquery-cookie/jquery.cookie.js',
 'bower_components/angular/angular.js',
 'bower_components/angular-resource/angular-resource.js',
 'temporary/js/*.js',
];
sassSources = [
 'development/sass/style.scss',
]
cssSources = [
 'temporary/css/*.css',
]
hamlSources = [
'development/haml/*.haml'
]
htmlSources = [
'temporary/html/*.html'
]

//Temporary File Destinations
htmlTemp = 'temporary/html/';
cssTemp = 'temporary/css/';
jsTemp = 'temporary/js/';

//jsonSources = [outputDir + 'js/*.json']

//Data Destinations
var rootDir = 'build/';
var styleDest = rootDir + 'stylesheets/';
var scriptDest = rootDir + 'javascripts/';



//----------------------------------------------------------------------------Gulp Tasks-----------------------------------------------------------------------------------//



gulp.task('log',function(){
  gutil.log('sassStyle is set to: ' + sassStyle)
});



// ----------------------------------------------------------------------------------------------------------------

//compile coffee script
gulp.task('prepCoffee',function(){
   gulp.src(coffeeSources)
  .pipe(coffee({bare:true}).on('error',gutil.log))
  .pipe(gulp.dest(jsTemp))
});

//concatinate scripts
gulp.task('prepJs',function(){
   gulp.src(jsSources)
  .pipe(concat('prot.js'))
  //.pipe(browserify())
  //.pipe(uglify())
  //.pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest(scriptDest))
  //.pipe(connect.reload())
});

// ------------------------------------------------------------------------------------------------------

//compass for sass processing
gulp.task('compass', function(){
  gulp.src(sassSources)
  .pipe(compass({
    config_file:'./config.rb',
    css: 'temporary/css',
    sass:'development/sass',
    style: 'expanded'
  }).on('error', gutil.log))
  .pipe(gulp.dest(cssTemp))
  //.pipe(connect.reload())
});

// gulp.task('prepSass', function() {
//    gulp.src(sassSources)
//     .pipe(sass({ style: sassStyle }))
//     .pipe(gulp.dest('components/css/'))
// });

gulp.task('prepCss', function() {
   gulp.src(cssSources)
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'Firefox ESR', 'opera 12.1', 'ios 6', 'android 4'))
    //.pipe(rename({suffix: '.min'}))
    //.pipe(minifycss())
    .pipe(concat('style.css'))
    .pipe(gulp.dest(styleDest))
});

//--------------------------------------------------------------------------------------------------------------


// Get all .haml files in one folder and render
gulp.task('prepHaml', function () {
  gulp.src(hamlSources)
    .pipe(haml())
    .pipe(gulp.dest(htmlTemp));
});


//html processing code
gulp.task('prepHtml',function(){
  gulp.src(htmlSources)
  .pipe(gulpif(env === 'production',minifyHTML()))
  .pipe(gulpif(env === 'production',gulp.dest(outputDir)))
  //.pipe(minifyHTML())
  .pipe(gulp.dest(rootDir))
 //.pipe(connect.reload())
});

//----------------------------------------------------------------------------------------------

//watch temp files for changes
gulp.task('watch',function(){
  gulp.watch(coffeeSources,['prepCoffee']);
  gulp.watch(jsSources,['prepJs']);
  gulp.watch(sassSources,['compass']);
  gulp.watch(cssSources,['prepCss']);
  gulp.watch(hamlSources,['prepHaml']);
  gulp.watch(htmlSources,['prepHtml']);
});

// // //fire up server
// // gulp.task('connect',function() {
// //   connect.server({
// //     root: outputDir,
// //     livereload:true
// //   })
// // });

//webserver processing code
gulp.task('webserver', function() {
  //gulp.src('app/views/layouts/')
  gulp.src(rootDir)
    .pipe(webserver({
      livereload: true,
      open: false
    }));
});


// //image processing task
// gulp.task('images',function(){
//   gulp.src('builds/development/images/**/*.*')
//   .pipe(gulpif(env === 'production',imagemin({
//     progressive:true,
//     svgoPlugins:[{removeViewBox:false}],
//     use: [pngcrush()]
//   })))
//   .pipe(gulpif(env === 'production',gulp.dest(outputDir + 'images')))
//  // .pipe(connect.reload())
// });

// //json processing code
// gulp.task('json',function(){
//   gulp.src('builds/development/js/*.json')
//     .pipe(gulpif(env === 'production',jsonminify()))
//     .pipe(gulpif(env === 'production',gulp.dest('builds/production/js')))
//     //.pipe(connect.reload())
// });
//
//
//

/**
 * These tasks are for compiling the code into mobile apps
 */

gulp.task('build', function () {
    gulp.src('/')
        .pipe(phonegapBuild({
          "isRepository": "true",
          "appId": "9876",
          "user": {
          "token": "PHs2K_cgTce4TLUmKGhL"
          }
        }));
});

gulp.task('build-debug', function () {
    gulp.src('/')
        .pipe(phonegapeBuild({
          "appId": "1234",
          "user": {
            "email": "cdaniels@marlboro.edu",
            "password": "yourPassw0rd"
          }
        }));
});

// gulp.task('ripple',function(){
//   var options = {
//         keepAlive: false,
//         open: true,
//         port: 4400
//     };

//     // Start the ripple server
//     ripple.emulate.start(options);

//     if (options.open) {
//         o('http://localhost:' + options.port + '?enableripple=cordova-3.0.0');
//     }
// });


/**
 *The default task below will effectively determine the order in which the sucsessive actions occured
 */
// gulp.task('default',['log','html','json','coffee','js','compass','images','webserver','watch']);
// gulp.task('default',['prepCoffee','prepJs','prepCss','prepHtml','watch']);
gulp.task('default',['prepCoffee','prepJs','compass','prepCss','prepHaml','prepHtml','build','webserver','watch']);
