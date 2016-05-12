/**
 * JooS framework
 *
 * @license MIT
 * @author Andrey Mindubaev, http://joos.nnov.ru/
 * @version 1.0
 */

var JooS = {
    Reflect: (function(F) {
        return function(source, methods) {
            if (!methods) {
                methods = { };
            }
            if (source) {
                if (!source.prototype.__constructor) {
                    source.prototype.__constructor = source;
                }
                F.prototype = source.prototype;
            } else {
                F.prototype = { constructor: source = F };
            }

            var c;
            if (methods.__constructor) {
                F.prototype = new F;
                c = this.Virtual(F, { __constructor: methods.__constructor }).prototype.__constructor;
                c.prototype = new F;
                delete methods.__constructor;
            } else {
                c = function() {
                    if (this.__constructor) {
                        this.__constructor.apply(this, arguments);
                    }
                };
                c.prototype = new F;
            }
            c.constructor = source;

            return c.prototype.constructor = this.Virtual(c, methods);
        }
    })(new Function),

    Virtual: (function(hidden) {
        var __index = 1;

        /** @private */
        var __extend = function(constructor, name, __self) {
            var __parent = constructor.prototype[name], method;
            if (typeof __self == "function") {
                var __selfName = __self.__name = name + "::" + __index++;
                constructor.prototype[__selfName] = __self;

                if (__parent && typeof __parent == "function") {
                    var __thisObj, __originalParent = __self.__parent = __parent.__self || __parent;

                    method = function(a1, a2, a3) {
                        __thisObj = this;
                        __parent = __originalParent;

                        switch (arguments.length) { // I'm cheater. Almost...
                            case 0:  return this[__selfName]();
                            case 1:  return this[__selfName](a1);
                            case 2:  return this[__selfName](a1, a2);
                            case 3:  return this[__selfName](a1, a2, a3);
                            default: return __self.apply(this, arguments);
                        }
                    };

                    method.__parent = function(a1, a2, a3) {
                        var o = __parent, r;

                        if (o.__name) {
                            __parent = o.__parent;
                            switch (arguments.length) {
                                case 0:
                                    r = __thisObj[o.__name]();
                                    break;
                                case 1:
                                    r = __thisObj[o.__name](a1);
                                    break;
                                case 2:
                                    r = __thisObj[o.__name](a1, a2);
                                    break;
                                case 3:
                                    r = __thisObj[o.__name](a1, a2, a3);
                                    break;
                                default:
                                    r = o.apply(__thisObj, arguments);
                            }
                            __parent = o;
                        } else {
                            r = o.apply(__thisObj, arguments);
                        }

                        return r;
                    };

                    method.__self = __self;
                }
            }

            constructor.prototype[name] = method || __self;
        };

        return function(constructor, methods) {
            for (var name in methods) {
                __extend(constructor, name, methods[name]);
            }

            for (var i=0; i<hidden.length, name = hidden[i]; i++) {
                if (methods.hasOwnProperty(name)) {
                    __extend(constructor, name, methods[name]);
                }
            }

            return constructor;
        };
    })([ "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf" ]),

    Mixin: function(destination, source) {
        for (var i in source.prototype) {
            if (!destination.prototype[i] && i != "constructor") {
                destination.prototype[i] = source.prototype[i];
            }
        }
    },
    Clone: (function(F) {
        return function(Obj) {
            F.prototype = Obj || { };
            return new F();
        };
    })(new Function),

    Extend: function(destination, source) {
        for (var i in source) {
            destination[i] = source[i];
        }
        return destination;
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
            arguments.length ? this.__destructor.apply(this, arguments) : this.__destructor();
        },

        /** @constructs Class */
        __constructor: function() {
        },
        /** @private */
        __destructor: function() {
        }
    }
);

module.exports = JooS;
