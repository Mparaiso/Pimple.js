/*global String,Boolean,Object,Function */
/*
  Pimple dependency injection container 
  copyright 2011 M.PARAISO
*/
(function(){
    /**
     * @param {Object} object
     * @return {Boolean}
     */
    var _isFunction=function(object){
        return object instanceof Function;
    };
    var reservedProperties=['get','set','factory','raw','protect','share','toString','constructor'];
    /**
     *
     * @param {Object} definitions
     * @constructor
     */
    this.Pimple = function(definitions){
        this._definitions={};
        for(var key in definitions){
            if(definitions.hasOwnProperty(key)){
                this.set(key,definitions[key]);
            }
        }
    };
    this.Pimple.prototype={
        /**
         *
         * @param {String} key
         * @returns {*}
         */
        get:function(key){
            if(this._definitions[key]===undefined)return;
            if(_isFunction(this._definitions[key])){
                return this._definitions[key].call(this,this);
            }
            return this._definitions[key];
        },
        /**
         *
         * @param {String} key
         * @param {Object|Function} definition
         */
        set:function(key,definition){
            this._definitions[key]=definition;
            if(reservedProperties.indexOf(key)===-1){
                Object.defineProperty(this,key,{
                    get:function(){
                        return this.get.call(this,key);
                    }
                });
            }
        },
        /**
         *
         * @param {String} key
         * @returns {*}
         */
        raw:function(key){
            return this._definitions[key];
        },
        /**
         *
         * @param {Object,Function} definition
         * @return {Function}
         */
        share:function(definition){
            var cached,self=this;
            return function(){
                if(cached===undefined){
                    cached=definition.call(self,self);
                }
                return cached;
            }
        },
        /**
         *
         * @param {Function}definition
         * @param {Object} context
         * @returns {Function}
         */
        protect:function(definition,context){
            context=context||this;
            return function(){
                return definition.bind(context);
            }
        }
    };

    //CommonJS
    if(module && module.exports){
        module.exports = this.Pimple;
    }
}).apply(this);