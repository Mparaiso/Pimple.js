
/*
 Pimple dependency injection container
 copyright 2011 M.PARAISO
 */


(function() {
    var Pimple,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
        __slice = [].slice;

    Pimple = (function() {
        var NotACallbackError;
        Pimple = (function() {
            /* create a new container
             */

            function Pimple(values) {
                var key, value;
                if (values == null) {
                    values = {};
                }
                this._values = {};
                for (key in values) {
                    value = values[key];
                    this.set(key, value);
                }
            }

            /* define a service or a parameter
             */


            Pimple.prototype.set = function(key, value) {
                var result,
                    _this = this;
                if (key == null) {
                    key = null;
                }
                if (value == null) {
                    value = null;
                }
                if (key === null) {
                    return;
                }
                result = null;
                if (this._isFunction(value)) {
                    result = function() {
                        return value(_this);
                    };
                } else {
                    result = value;
                }
                this._values[key] = result;
                this._defineGetter(key);
            };

            /* define accessor
             */


            Pimple.prototype._defineGetter = function(key) {
                var _this = this;
                if (this[key] != null) {
                    return;
                }
                return Object.defineProperty(this, key, {
                    get: function(x) {
                        return _this.get(key);
                    }
                });
            };

            /* test if a value is a function
             */


            Pimple.prototype._isFunction = function(value) {
                return typeof value === 'function' && value instanceof Function;
            };

            /* access a service or a parameter
             */


            Pimple.prototype.get = function(key) {
                var value;
                value = this._values[key];
                if (this._isFunction(value)) {
                    return value(this);
                } else {
                    return value;
                }
            };

            /* define a shared service
             */


            Pimple.prototype.share = function(key, callback) {
                var _object,
                    _this = this;
                _object = null;
                if (this._isFunction(callback)) {
                    return this.set(key, function() {
                        if (_object !== null) {
                            return _object;
                        } else {
                            _object = callback(_this);
                            return _object;
                        }
                    });
                } else {
                    return this._throwNotCallbackError();
                }
            };

            /* return the function definition of the service
             */


            Pimple.prototype.raw = function(key) {
                if (this._values[key] != null) {
                    return this._values[key];
                }
            };

            /* protect a function
             */


            Pimple.prototype.protect = function(key, callback) {
                if (this._isFunction(callback)) {
                    return this.set(key, function() {
                        return callback;
                    });
                } else {
                    return this._throwNotCallbackError();
                }
            };

            /* extends a service definition
             */


            Pimple.prototype.extend = function(key, callback) {
                var definition,
                    _this = this;
                definition = this.raw(key);
                if (this._isFunction(definition)) {
                    return function() {
                        return callback(definition(_this), _this);
                    };
                } else {
                    return this._throwNotCallbackError();
                }
            };

            Pimple.prototype._throwNotCallbackError = function() {
                throw new NotACallbackError();
            };

            return Pimple;

        })();
        NotACallbackError = (function(_super) {

            __extends(NotACallbackError, _super);

            function NotACallbackError() {
                var rest;
                rest = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                NotACallbackError.__super__.constructor.apply(this, rest);
                this.type = "NotACallbackError";
                ({
                    toString: function() {
                        return "NotACallbackError";
                    }
                });
            }

            return NotACallbackError;

        })(Error);
        return Pimple;
    })();

    /*
     make Pimple compatible with requirejs and AMD
     */


    if ((typeof define !== "undefined" && define !== null) && (typeof exports !== "undefined" && exports !== null)) {
        define(function() {
            return Pimple;
        });
    } else if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
        module.exports = Pimple;
        return;
    } else {
        this.Pimple = Pimple;
    }

}).call(this);
