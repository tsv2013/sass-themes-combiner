# gulp-sass-themes-combiner

SASS themes injector &amp; combiner.

A plugin for [Gulp](https://github.com/gulpjs/gulp) as extension of [gulp-sass](https://github.com/dlmanning/gulp-sass).

Inspired by [gulp-sass-themes](https://github.com/bbuhler/gulp-sass-themes).

## Usage

Source files
```
+-- styles
    +-- _default-colors.scss
    +-- body.scss
    +-- form.scss
    +-- login.scss
    +-- themes
        +-- _white.scss
        +-- _black.scss
```

Gulpfile
```javascript
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const themesCombiner = require('gulp-sass-themes-combiner');

gulp.task("sass", function () {
    var themesCombiner = themesCombiner('./styles/themes/_*.scss');

    return gulp.src(['./styles/**/*.scss'])
      .pipe(themesCombiner.init())
      .pipe(sass.sync().on("error", sass.logError))
      .pipe(themesCombiner.combine('mySite'))
      .pipe(gulp.dest('./dist/styles'));
});

```

Output
```
+-- dist
    +-- styles
        +-- mySite.white.css
        +-- mySite.dark.css
```

## Parameters

### themes
Type: `String | Array<String>`
Glob pattern to theme files.

### options

#### cwd
Type: `String`
Current working directory for glob pattern.

#### debug
Type: `Boolean`
Verbose working mode.

#### ext
Type: `String`
Theme file extension (`.scss` or `.sass`, default - `.sass`).
