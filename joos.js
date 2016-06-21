/**
 * Hidden methods names
 *
 * @type {string[]}
 */
var hidden = [
    "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"
];

/**
 * Unique id for transformed method
 *
 * @type {Number}
 */
var index = 1;

/**
 * Transform method with .__parent, .__self() and .__name
 *
 * @return null
 */
var transformMethod = function(constructor, name, __self) {
    var __parent = constructor.prototype[name], method;

    if (typeof __self == "function") {
        var selfName = __self.__name = name + "::" + index++;
        constructor.prototype[selfName] = __self;

        if (__parent && typeof __parent == "function") {
            var thisObj, originalParent = __self.__parent = __parent.__self || __parent;

            method = function() {
                thisObj = this;
                __parent = originalParent;

                return __self.apply(this, arguments);
            };

            method.__parent = function() {
                var o = __parent, r;

                if (o["__name"]) {
                    __parent = o.__parent;
                    r = o.apply(thisObj, arguments);
                    __parent = o;
                } else {
                    r = o.apply(thisObj, arguments);
                }

                return r;
            };

            method.__self = __self;
        }
    }

    constructor.prototype[name] = method || __self;
};

/**
 * Attach and transform methods to constructor
 *
 * @param {Function} constructor Constructor
 * @param {Object}   methods     Methods
 *
 * @return {Function}
 */
var transformConstructor = function(constructor, methods) {
    for (var name in methods) {
        if (methods.hasOwnProperty(name)) {
            transformMethod(constructor, name, methods[name]);
        }
    }

    for (var i=0; i<hidden.length, name = hidden[i]; i++) {
        if (methods.hasOwnProperty(name)) {
            transformMethod(constructor, name, methods[name]);
        }
    }

    return constructor;
};

/**
 * Function with clear prototype
 *
 * @type {Function}
 */
var F = new Function;

/**
 * Module object
 *
 * @type {{Reflect: JooS.Reflect, Clone: JooS.Clone, Extend: JooS.Extend, Value: JooS.Value, Closure: JooS.Closure}}
 */
var JooS = {
    /**
     * Reflect methods on source constructor
     *
     * @param {Function} source  Source constructor
     * @param {Object}   methods Methods
     *
     * @return {Function}
     */
    Reflect: function(source, methods) {
        var constructor;

        if (!methods) {
            methods = { };
        }
        if (source) {
            if (!source.prototype.__constructor) {
                source.prototype.__constructor = source;
            }
            F.prototype = source.prototype;
        } else {
            F.prototype = {
                constructor: source = F
            };
        }

        if (methods.__constructor) {
            F.prototype = new F;
            constructor = transformConstructor(F, { __constructor: methods.__constructor }).prototype.__constructor;
            constructor.prototype = new F;
            delete methods.__constructor;
        } else {
            constructor = function() {
                if (this.__constructor) {
                    this.__constructor.apply(this, arguments);
                }
            };
            constructor.prototype = new F;
        }
        constructor.constructor = source;

        return constructor.prototype.constructor = transformConstructor(constructor, methods);
    },
    /**
     * Clone data object
     *
     * @param {Object} data Data
     *
     * @return {Object}
     */
    Clone: function(data) {
        F.prototype = data || { };
        return new F();
    },
    /**
     * Extend destination with source
     *
     * @param {Object} destination Destination object
     * @param {Object} source      Source object
     *
     * @return {Object}
     */
    Extend: function(destination, source) {
        for (var i in source) {
            destination[i] = source[i];
        }
        return destination;
    },
    /**
     * Read-only value
     *
     * @param {*} value Value
     *
     * @returns {Function}
     */
    Value: function(value) {
        return function() {
            return value;
        }
    },
    /**
     * Function in context
     *
     * @param {Object}   thisObj Context
     * @param {Function} method  Function
     *
     * @returns {Function}
     */
    Closure: function(thisObj, method) {
        return function() {
            return method.apply(thisObj, arguments);
        }
    }
};

/**
 * @class JooS.Class
 */
JooS.Class = JooS.Reflect(
    null,
    /** @lends JooS.Class.prototype */
    {
        destroy: function() {
            this.__destructor.apply(this, arguments);
        },
        /** @constructs JooS.Class */
        __constructor: function() {
        },
        /** @private */
        __destructor: function() {
        }
    }
);

module.exports = JooS;
