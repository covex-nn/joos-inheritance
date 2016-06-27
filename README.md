# JavaScript inheritance

[![Build Status](https://travis-ci.org/covex-nn/joos-inheritance.svg?branch=master)](https://travis-ci.org/covex-nn/joos-inheritance)
[![dependency status](https://david-dm.org/covex-nn/joos-inheritance.svg)](https://david-dm.org/covex-nn/joos-inheritance)
[![devDependency Status](https://david-dm.org/covex-nn/joos-inheritance/dev-status.svg)](https://david-dm.org/covex-nn/joos-inheritance#info=devDependencies) 
[![npm version](https://badge.fury.io/js/joos-inheritance.svg)](https://badge.fury.io/js/joos-inheritance)

Javascript class inheritance

## Usage example

```javascript
var JooS = require("joos-inheritance");

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
    /** @lends Class0.prototype */
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
 * @class NewClass1
 * @extends Function0
 */
var NewClass1 = JooS.Reflect(
    Class0,
    /** @lends NewClass1.prototype */
    {
        method1: function() {
            return "!" + this.method1.__parent() + "!";
        }
    }
);

var NativeObj0 = new Function0("qwerty");
console.log(NativeObj0.method1()); // --> qwerty

var Obj1 = new Class0("qwerty");
console.log(Obj1.method1()); // --> [qwerty]

var NewObj1 = new NewClass1("qwerty");
console.log(NewObj1.method1()); // --> ![qwerty]!
```
