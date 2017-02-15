module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    ts: {
      all: {
        tsconfig: true
      }
    },
    concat: {
      all: {
        src: ["HEADER.txt", "partygameshow.d.ts"],
        dest: "index.d.ts"
      }
    },
    sed: {
      all: {
        pattern: "@VERSION",
        replacement: "<%= pkg.version %>",
        path: "index.d.ts"
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      all: {
        src: ["partygameshow.d.ts"]
      }
    },
    clean: {
      tscommand: ["tscommand*.tmp.txt"]
    }
  });

  require("load-grunt-tasks")(grunt);

  grunt.registerTask("compile", ["tslint:all", "ts:all", "concat:all", "sed:all", "clean:tscommand"]);
  
}