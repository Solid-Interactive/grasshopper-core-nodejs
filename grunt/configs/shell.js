module.exports = function (grunt) {
    'use strict';
    var lineEnding = '\n',
        _ = require('lodash');
    grunt.config('shell', {
        test : {
            command : 'mocha <%= debug %> --colors --recursive -R spec <%= test %>',
            options : {
                stdout : true,
                stderr : true
            }
        },
        testInspector : {
            command : 'node-debug _mocha -t 60000 --colors -R spec <%= test %>',
            options : {
                stdout : true,
                stderr : true
            }
        },
        'jekyllBuild': {
            command : 'cd docs && jekyll build && cd ../',
            options : {
                stdout : true,
                stderr : true
            }
        },
        'server': {
            command : 'node dev/server',
            options : {
                stdout : true,
                stderr : true
            }
        },
        'shortlog' : {
            options : {
                stderr : true,
                stdout : false,
                failOnError : true,
                callback : function (err, stdout, stderr, cb) {
                    stdout = stdout.split(lineEnding);
                    _.each(stdout, function (line, index) {
                        stdout[index] = line.replace(/^\s*\d+\s+([^\s])/, '* $1');
                    });
                    grunt.config.set('contributors', stdout.join(lineEnding));
                    cb();
                }
            },
            command : 'git --no-pager shortlog -ns HEAD'
        },
        'mongoExport' : {
            options : {
                stdout : true,
                stderr : true,
                failOnError : true,
                execOptions: {
                    cwd: './'
                }
            },
            command : 'mongoexport --jsonArray --db test -c <%= collection %> --host localhost:27017 ' +
            '--out .data/<%= fixtureFolder %>/<%= collection %>.json'
        },
        'mongoImport' :{
            options : {
                stdout : true,
                stderr : true,
                failOnError : true,
                execOptions: {
                    cwd: './'
                }
            },
            command : 'mongoimport --drop --jsonArray --db test -c <%= collection %> --host localhost:27017 ' +
            '--file .data/<%= fixtureFolder %>/<%= collection %>.json'
        }
    });
};