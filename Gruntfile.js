module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    ts: {
      def: {
        tsconfig: 'tsconfig.json',
      },
      validate: {
        tsconfig: 'tsconfig.validate.json',
      },
      test: {
        tsconfig: 'tsconfig.test.json',
      }
    },
    concat: {
      def: {
        src: ["HEADER.txt", "partygameshow.d.ts"],
        dest: "index.d.ts"
      }
    },
    sed: {
      def: {
        pattern: "@VERSION",
        replacement: "<%= pkg.version %>",
        path: "index.d.ts"
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      def: {
        src: ["partygameshow.d.ts"]
      },
      validate: {
        src: ["partygameshow.d.ts", "validate.ts"]
      },
      test: {
        src: ["partygameshow.d.ts", "mock.ts", "test.ts"]
      }
    },
    simplemocha: {
      test: {
        src: ["test.js"]
      }
    },
    clean: {
      tscommand: ["tscommand*.tmp.txt"],
      js: ["*.js", "*.js.map", "!Gruntfile.js"]
    }
  });

  require("load-grunt-tasks")(grunt);

  grunt.registerTask("build", ["tslint:def", "ts:def", "concat:def", "sed:def", "clean:tscommand"]);

  grunt.registerTask("validate", ["tslint:validate", "ts:validate", "clean:tscommand"])

  grunt.registerTask("test", ["ts:test", "simplemocha:test", "clean:js", "clean:tscommand"]);

  grunt.registerTask("compile", ["validate", "test", "build"])

}
