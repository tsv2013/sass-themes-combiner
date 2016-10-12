var globby = require('globby');
var path = require('path');
var slash = require('slash');
var through2 = require('through2');

var defaultOptions = {
    debug: false,
    cwd: process.cwd(),
    ext: '.scss'
};

/**
 * @param {String|Array<String>} themes Glob pattern to theme files.
 * @param {Object=} options Options
 *
 * @param {String=} options.debug Verbose working mode.
 * @param {String=} options.cwd Current working directory for glob pattern.
 * @param {String=} options.ext Theme file extension (`.scss` or `.sass`).
 *
 * @returns {Stream}
 */
module.exports = function(themes, options) {
    'use strict';

    var settings = Object.assign({}, defaultOptions, options);
    var themeImports = {};
    var targetFiles = {};

    globby.sync(themes, { cwd: settings.cwd }).forEach(function(themePath) {
        var themeName = path.basename(themePath, settings.ext).replace(/_(.+)/, '$1');
        themeImports[themeName] = new Buffer("@import " + slash(themePath) + ";\n\n");
    });

    return {
        init: function() {
            return through2.obj(function(file, enc, next) {
                //console.log(JSON.stringify(themeImports));
                var files = this;
                var filename = path.basename(file.path, settings.ext);
                var dirname = path.dirname(file.path);

                Object.keys(themeImports).forEach(function(themeName) {
                    var themedFile = file.clone();
                    if(settings.debug) {
                        console.log("init: " + themeName + ", " + file.path);
                    }

                    themedFile.contents = Buffer.concat([themeImports[themeName], themedFile.contents]);
                    themedFile.path = path.join(dirname, filename + "." + themeName + settings.ext);

                    files.push(themedFile);
                });

                next();
            });
        },
        combine: function(target) {
            return through2.obj(
                function(file, enc, next) {
                    //console.log(JSON.stringify(targetFiles));
                    var files = this;
                    var filename = path.basename(file.path);
                    var dirname = path.dirname(file.path);

                    if(!!target) {
                        Object.keys(themeImports).forEach(function(themeName) {
                            var resultFile = targetFiles[themeName];
                            if(!resultFile) {
                                resultFile = file.clone();
                                resultFile.cwd = settings.cwd;
                                resultFile.base = settings.cwd;
                                resultFile.path = path.join("", [target, themeName, "css"].join("."));
                                resultFile.contents = new Buffer('');
                                targetFiles[themeName] = resultFile;
                            }
                            if(filename.indexOf("." + themeName + ".") !== -1) {
                                resultFile.contents = Buffer.concat([resultFile.contents, file.contents]);
                                if(settings.debug) {
                                    console.log("combine: " + themeName + ", " + resultFile.path);
                                }
                            }
                        });
                    }
                    else {
                        files.push(file);
                    }
                    next();
                },
                function(callback) {
                    var files = this;
                    Object.keys(themeImports).forEach(function(themeName) {
                        var resultFile = targetFiles[themeName];
                        if(!!resultFile) {
                            files.push(resultFile);
                        }
                    });
                    callback();
                }
            );
        }
    }
    
};