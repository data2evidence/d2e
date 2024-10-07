/**
 * Test suite for the XS Engine utilities (utilLib.xsjslib).
 *
 * @namespace pa.services.lib
 *
 */
import utilLib = require("../../src/utils/utils");
let settingsObj: any;
import { CreateLogger } from "../../src/utils/Logger";
let log = CreateLogger();

describe("TESTS SUITE FOR UTILITY FUNCTIONS", function () {
  beforeAll(function (done) {
    log.debug(
      "\n\n-----------------------------Test class: utils_integrationtest.ts -----------------------------\n"
    );

    settingsObj = {
      settings: {
        errorDetailsReturnOn: true,
        errorStackTraceReturnOn: true,
      },
      getSettings: () => {
        return settingsObj.settings;
      },
    };

    done();
  });
  describe("createGuid()...", function () {
    it("generates hexadecimal GUIDs with letter in uppercase (as far one can tell from a few tests...)", function () {
      let i;
      let newGuid;
      for (i = 0; i < 10; i++) {
        newGuid = utilLib.createGuid();
        expect(newGuid).toMatch(/[A-F0-9]+/);
      }
    });

    it("generates distinct GUIDs (as far one can tell from a few tests...)", function () {
      let seenGuids = [];
      let i;
      let newGuid;
      for (i = 0; i < 10; i++) {
        newGuid = utilLib.createGuid();
        expect(seenGuids).not.toContain(newGuid);
        seenGuids.push(newGuid);
      }
    });
  });

  describe("deepEquals", function () {
    it("should return true if two json objects are equal", function () {
      let o1;
      let o2;
      o1 = {
        patient: {},
      };
      o2 = utilLib.cloneJson(o1);
      expect(utilLib.deepEquals(o1, o2)).toBe(true);

      o1 = {};
      o2 = utilLib.cloneJson(o1);
      expect(utilLib.deepEquals(o1, o2)).toBe(true);

      o1 = {
        a: {
          b: {
            c: "a",
          },
        },
      };
      o2 = utilLib.cloneJson(o1);
      expect(utilLib.deepEquals(o1, o2)).toBe(true);
    });

    it("should return false if two json objects are not equal", function () {
      let o1;
      let o2;
      o1 = {
        patient: {},
      };
      o2 = {
        patient: {},
        a: 1,
      };
      expect(utilLib.deepEquals(o1, o2)).toBe(false);

      o1 = {};
      o2 = {
        "": {},
      };
      expect(utilLib.deepEquals(o1, o2)).toBe(false);

      o1 = {
        a: {
          b: {
            c: "x",
          },
        },
      };
      o1 = {
        a: {
          b: {
            c: "y",
          },
        },
      };
      expect(utilLib.deepEquals(o1, o2)).toBe(false);
    });
  });

  describe("formatErrorMessage()", function () {
    it("returns simple error message if error detail and stack trace flags are false and no description is given", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      settingsObj.getSettings().errorDetailsReturnOn = false;
      settingsObj.getSettings().errorStackTraceReturnOn = false;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(testErrorStub, settingsObj);

      expect(result).toBe("An error occurred.");

      settingsObj.getSettings().errorDetailsReturnOn = originalErrorDetailsVal;
      settingsObj.getSettings().errorStackTraceReturnOn = originalStackTraceVal;
    });

    it("returns the normal error message including the error message and no stack trace if no description was given, error detail flag set to true and stack trace flag set to false", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = true;
      settings.errorStackTraceReturnOn = false;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(testErrorStub, settingsObj);

      expect(result).toBe(
        "An error occurred.\n\nError message:\nMy message is this"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("returns the normal error message including the stack trace and no error message if no description was given, error detail flag set to false and stack trace flag set to true", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = false;
      settings.errorStackTraceReturnOn = true;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(testErrorStub, settingsObj);

      expect(result).toBe(
        "An error occurred.\n\nStack trace:\nAnd here is a stack trace"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("returns the normal error message and an indication that no stack was available if no stack trace was given", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = true;
      settings.errorStackTraceReturnOn = true;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
      };

      let result = utilLib.formatErrorMessage(testErrorStub, settingsObj);

      expect(result).toBe(
        "An error occurred.\n\nError message:\nMy message is this\n\nNo stack information available"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("appends the stack trace when available", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = true;
      settings.errorStackTraceReturnOn = true;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(testErrorStub, settingsObj);

      expect(result).toBe(
        "An error occurred.\n\nError message:\nMy message is this\n\nStack trace:\nAnd here is a stack trace"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("returns simple error message with description if error detail and stack trace flags are false and a description is given", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = false;
      settings.errorStackTraceReturnOn = false;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(
        testErrorStub,
        settingsObj,
        "This is my description."
      );

      expect(result).toBe("An error occurred: This is my description.");

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("returns error message with description including error details and no stack trace if error details flag set to true and stack trace flags is false and a description is given", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = true;
      settings.errorStackTraceReturnOn = false;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(
        testErrorStub,
        settingsObj,
        "This is my description."
      );

      expect(result).toBe(
        "An error occurred: This is my description.\n\nError message:\nMy message is this"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("returns error message with description including stack trace and no error details if error details flag set to false and stack trace flags is true and a description is given", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = false;
      settings.errorStackTraceReturnOn = true;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(
        testErrorStub,
        settingsObj,
        "This is my description."
      );

      expect(result).toBe(
        "An error occurred: This is my description.\n\nStack trace:\nAnd here is a stack trace"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });

    it("returns error message with description including stack trace and error details if error details and stack trace flags are true and a description is given", function () {
      // make test case independent of global flags
      let originalErrorDetailsVal =
        settingsObj.getSettings().errorDetailsReturnOn;
      let originalStackTraceVal =
        settingsObj.getSettings().errorStackTraceReturnOn;

      let settings = settingsObj.getSettings();

      settings.errorDetailsReturnOn = true;
      settings.errorStackTraceReturnOn = true;
      settingsObj["settings"] = settings;

      // Cannot use a real error since Jasmin add its own trace...
      let testErrorStub = {
        toString: function () {
          return "My message is this";
        },
        stack: "And here is a stack trace",
      };

      let result = utilLib.formatErrorMessage(
        testErrorStub,
        settingsObj,
        "This is my description."
      );

      expect(result).toBe(
        "An error occurred: This is my description.\n\nError message:\nMy message is this\n\nStack trace:\nAnd here is a stack trace"
      );

      settings.errorDetailsReturnOn = originalErrorDetailsVal;
      settings.errorStackTraceReturnOn = originalStackTraceVal;
      settingsObj["settings"] = settings;
    });
  });

  describe("validateRequestPath", function () {
    it("should throw an error iff the path is invalid", function () {
      let validPaths = [
        "fad.asdf.asdf.adfasdf.1",
        "fad.asdf.asdf.adfasdf.BLA",
        "fad.asdf.ad1_fasdf.bla",
      ];

      validPaths.forEach(function (path) {
        expect(function () {
          utilLib.validateRequestPath(path);
        }).not.toThrow();
      });
    });

    it("should throw an error if the path is invalid", function () {
      let invalidPaths = [
        'fad.asdf.asdf.adfasdf.START"',
        "fad.asdf.asdf.adfas df.START",
        'fad.asdf.asdf.adfasdf."END"',
        'fad.asdf.asdf.ad;fasdf."END"',
        "fad.asdf.ad1_fasdf.bla ",
      ];

      invalidPaths.forEach(function (path) {
        expect(function () {
          utilLib.validateRequestPath(path);
        }).toThrow();
      });
    });
  });

  describe("getJsonWalkFunction", function () {
    it("should return the object for a path without wildcards correctly", function () {
      let obj = {
        a: {
          b: {
            cello: "correct",
          },
        },
        b: {},
      };
      let jsonWalk = utilLib.getJsonWalkFunction(obj);
      let result = jsonWalk("a.b.cello");
      expect(result.length).toBe(1);
      expect(result[0].obj).toBe("correct");
      expect(result[0].path).toBe("a.b.cello");

      let result2 = jsonWalk("b.cello");
      expect(result2.length).toBe(0);

      let result3 = jsonWalk("a.b");
      expect(result3.length).toBe(1);
      expect(result3[0].path).toBe("a.b");
      expect(result3[0].obj).toEqual({
        cello: "correct",
      });
    });

    it("should return objects and paths for simple *-wildcards ordered by keys", function () {
      let obj = {
        b: {
          b: 2,
        },
        c: {
          b: 3,
        },
        a: {
          b: 1,
        },
      };

      let jsonWalk = utilLib.getJsonWalkFunction(obj);
      let result = jsonWalk("*.b");

      expect(result.length).toBe(3);

      expect(result[0].path).toBe("a.b");
      expect(result[1].path).toBe("b.b");
      expect(result[2].path).toBe("c.b");
      expect(result[0].obj).toBe(1);
      expect(result[1].obj).toBe(2);
      expect(result[2].obj).toBe(3);
    });

    it("should return the objects and paths for nested *-wildcards ordered by keys", function () {
      let obj = {
        b: {
          x: {
            b: 3,
          },
        },
        c: {
          x: {
            b: 4,
          },
        },
        a: {
          x: {
            b: 1,
            c: 2,
          },
        },
      };

      let jsonWalk = utilLib.getJsonWalkFunction(obj);
      let result = jsonWalk("*.x.*");

      expect(result.length).toBe(4);

      expect(result[0].path).toBe("a.x.b");
      expect(result[1].path).toBe("a.x.c");
      expect(result[2].path).toBe("b.x.b");
      expect(result[3].path).toBe("c.x.b");
      expect(result[0].obj).toBe(1);
      expect(result[1].obj).toBe(2);
      expect(result[2].obj).toBe(3);
      expect(result[3].obj).toBe(4);
    });

    it("should return the objects and paths for **-wildcards", function () {
      let obj = {
        a: {
          x: {
            attr: 1,
          },
        },
        b: {
          y: {
            attr: 2,
          },
        },
        c: {
          attr: 3,
          d: {
            e: {
              attr: 4,
              f: {
                attr: 5,
              },
            },
          },
        },
      };

      let jsonWalk = utilLib.getJsonWalkFunction(obj);
      let result = jsonWalk("**.attr");

      expect(result.length).toBe(5);

      expect(result[0].path).toBe("a.x.attr");
      expect(result[1].path).toBe("b.y.attr");
      expect(result[2].path).toBe("c.attr");
      expect(result[3].path).toBe("c.d.e.attr");
      expect(result[4].path).toBe("c.d.e.f.attr");
      expect(result[0].obj).toBe(1);
      expect(result[1].obj).toBe(2);
      expect(result[2].obj).toBe(3);
      expect(result[3].obj).toBe(4);
      expect(result[4].obj).toBe(5);

      let result2 = jsonWalk("c.**.attr");

      expect(result2.length).toBe(2);

      expect(result2[0].path).toBe("c.d.e.attr");
      expect(result2[1].path).toBe("c.d.e.f.attr");
      expect(result2[0].obj).toBe(4);
      expect(result2[1].obj).toBe(5);
    });
  });
});