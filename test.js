var JooS = require("./joos");
var assert = require("assert");

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

var a1 = new Class1("qwerty");
var a2 = new Class2("qwerty", "asdf");

assert.equal(a1.method1(), "qwerty", "");
assert.equal(a2.method1(), "asdf[qwerty]");
