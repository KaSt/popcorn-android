module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);
    var path = require('path');

    grunt.registerTask('default', [
        'update_submodules',
        'stylus',
        'exec:bower',
        'exec:addPlatform',
        'exec:plugins_device',
        'exec:plugins_network',
        'exec:plugins_update',
        'exec:plugins_ssl',
        'exec:prepare_frontend',
        'exec:build_frontend', // build to frontend for eclipse
        'exec:backend_npm',
        'build'
    ]);

    grunt.registerTask('update', [
        'exec:submodules',
        'exec:rmPlatform',
        'clean:plugins',
        'clean:assets_www',
        'clean:assets_backend',
        'default'
    ]);

    grunt.registerTask('build', [
        'compress:backend',
        'copy'
    ]);

    grunt.registerTask('run', [
        'stylus',
        'exec:run_frontend'
    ]);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        exec:{
            addPlatform:{
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " platforms add android",
                stdout:true,
                stderror:true,
                cwd:"popcorn-mobile/frontend"
            },
            rmPlatform:{
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " platforms rm android",
                stdout:true,
                stderror:true,
                cwd:"popcorn-mobile/frontend"

            },
            prepare_frontend:{
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " prepare",
                stdout:true,
                stderror:true,
                cwd:"popcorn-mobile/frontend"

            },
            build_frontend:{
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " build android",
                stdout:true,
                stderror:true,
                cwd:"popcorn-mobile/frontend"

            },
            run_frontend:{
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " run android",
                stdout:true,
                stderror:true,
                cwd:"popcorn-mobile/frontend"

            },

            serve:{
                command:path.join('..', '..', 'node_modules', '.bin', 'phonegap') + " serve",
                stdout:true,
                stderror:true,
                cwd:"popcorn-mobile/frontend"

            },   

            plugins_device: {
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " plugin add org.apache.cordova.device",
                cwd:"popcorn-mobile/frontend"
            },

            plugins_network: {
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " plugin add org.apache.cordova.network-information",
                cwd:"popcorn-mobile/frontend"
            },

            plugins_update: {
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " plugin add https://github.com/popcorn-official/codova-update-plugin.git",
                cwd:"popcorn-mobile/frontend"
            },

            plugins_ssl: {
                command:path.join('..', '..', 'node_modules', '.bin', 'cordova') + " plugin add https://github.com/phenomenz/codova-ssl-plugin.git",
                cwd:"popcorn-mobile/frontend"
            },

            bower: {
                command:path.join('..', '..', 'node_modules', '.bin', 'bower') + " install",
                cwd:"popcorn-mobile/frontend"
            },

            backend_npm: {
                command:'npm install',
                cwd:"popcorn-mobile/backend"
            },

            submodules:'git submodule foreach git pull origin master'     
        },

        stylus: {
            compile: {
                options: {
                    compress: false,
                    'resolve url': true,
                    use: ['nib'],
                    paths: ['./popcorn-mobile/frontend/www/styl']
                },
                files: {
                    'popcorn-mobile/frontend/www/css/app.css' : 'popcorn-mobile/frontend/www/styl/app.styl'
                }
            }
        },

        copy: {
          main: {
            files: [
              //copy xml for plugins and project config
              {expand: true, cwd: 'popcorn-mobile/frontend/platforms/android/res/xml/', src: ['*.xml'], dest: 'eclipse-project/res/xml/'},
              // copy assets
              {expand: true, cwd: 'popcorn-mobile/frontend/platforms/android/assets/www/', src: ['**'], dest: 'eclipse-project/assets/www/'},
              // copy plugins
              {expand: true, cwd: 'popcorn-mobile/frontend/platforms/android/src/org/', src: ['**'], dest: 'eclipse-project/src/org/'},
              {expand: true, cwd: 'popcorn-mobile/frontend/platforms/android/src/nl/', src: ['**'], dest: 'eclipse-project/src/nl/'}
            ]
          }
        },

        clean: {
          plugins: ["popcorn-mobile/frontend/plugins/*", "!popcorn-mobile/frontend/plugins/.gitkeep"],
          assets_www: ["eclipse-project/assets/www/*", "!eclipse-project/assets/www/.gitkeep"],
          assets_backend: ["eclipse-project/assets/*.zip"]
        },

        update_submodules: {
            default: {
                options: {}
            }
        },

        compress: {
          backend: {
            options: {
              archive: 'eclipse-project/assets/backend.zip'
            },
            files: [
              {expand: true, cwd: 'popcorn-mobile/backend/', src: ['**'], dest: 'backend/'},
            ]
          }
        }  

    });

};