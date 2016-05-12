var JooS = require("./joos");
var assert = require("assert");

/**
 * Class Function0
 * @constructor
 */
var Function0 = function(value0) {
    this.value0 = value0;
};

Function0.prototype.method1 = function() {
    return this.value0;
};

/**
 * @class Class0
 * @extends Function0
 */
var Class0 = JooS.Reflect(
    Function0,
    /** @lends Class0 */
    {
        __constructor: function(value0) {
            this.__constructor.__parent(value0);
        },
        method1: function() {
            return "[" + this.method1.__parent() + "]";
        }
    }
);

/**
 * @class Class1
 * @augments JooS.Class
 */
var Class1 = JooS.Reflect(
    JooS.Class,
    /** @lends Class1.prototype */
    {
        /** @constructs */
        __constructor: function(value1) {
            this.value1 = value1;
        },
        method1: function() {
            return this.value1;
        }
    }
);

/**
 * @class Class2
 * @augments Class1
 */
var Class2 = JooS.Reflect(
    Class1,
    /** @lends Class2.prototype */
    {
        /** @constructs Class2 */
        __constructor: function(value1, value2) {
            this.__constructor.__parent(value1);

            this.value2 = value2;
        },
        method1: function() {
            return this.value2 + "[" + this.method1.__parent() + "]";
        }
    }
);

// test inheritance constructor & methods for "native" prototype
var a0 = new Class0("zxcv");
assert(a0.method1(), "[zxcv]");

// test inheritance for "joos" classes
var a1 = new Class1("qwerty");
assert.equal(a1.method1(), "qwerty", "");

var a2 = new Class2("qwerty", "asdf");
assert.equal(a2.method1(), "asdf[qwerty]");
