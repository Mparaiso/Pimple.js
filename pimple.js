/*jslint eqeq:true,node:true,es5:true,white:true,plusplus:true,nomen:true,unparam:true,devel:true,regexp:true */
/*global String,Boolean,Object,Function */
/**
 *  Pimple dependency injection container 
 *  @copyright 2011 M.PARAISO <mparaiso@online.fr>
 *  @license LGPL
 *  @version 2.0.0
 */
(function(){
    "use strict";
    var self,_isFunction,reservedProperties;
    self=this;
    /**
     * Pimple dependency injection container
     * @param {Object} object
     * @return {Boolean}
     */
    _isFunction=function(object){
        return object instanceof Function;
    };
    reservedProperties=['get','set','factory','raw','protect','share','toString','constructor','prototype'];

    /**
     *
     * @param {Object} definitions
     * @constructor
     */
    this.Pimple =function Pimple(services){
        if(!(this instanceof Pimple)){
            return new Pimple(services);
        }
        this._definitions={};
        this._raw={};
        if(services){
            Object.keys(services).forEach(function(service){
                this.set(service,services[service]);
            },this);
        }
    };
    /** define a service */ 
    this.Pimple.prototype.set=function(name,service){
        var s;
        this._raw[name]=service;
        if(service instanceof Function){
            s = (function(){
                var cached;
                return function(pimple){
                    if(cached === undefined){
                        cached = service(pimple);
                    }
                    return cached;
                };
            }());
        }else{
            s=service;
        }
        this._definitions[name]=s;
        try{
            if(reservedProperties.indexOf(name)===-1){
            Object.defineProperty(this,name,{
                get:function(){
                    return this.get(name);
                }
            });
            }
        }catch(e){}
        return this;
    };
    /** register a factory */
    this.Pimple.prototype.factory=function(name,function_){
        var self=this;
        this._raw[name]=function_;
        this._definitions[name]=function_;
        try{
            if(reservedProperties.indexOf(name)===-1){
                Object.defineProperty(this,name,{
                    get:function(){
                        return this.get(name);
                    }
                });
            }
        }catch(e){}
    };
    /** get a service instance */
    this.Pimple.prototype.get=function(name){
        if (this._definitions[name] instanceof Function){
            return this._definitions[name](this);
        }
        return this._definitions[name];
    };
    /* register a protected function */
    this.Pimple.prototype.protect=function(service){
        return function(){
            return service;
        };
    };
    /** extend a service */
    this.Pimple.prototype.extend=function(serviceName,service){
        var def,self=this;
        if(this._definitions[serviceName]===undefined){
            return this;
        }
        def=self._definitions[serviceName];
        if(def instanceof Function){
            def=def(this);
        }
        service(def,this);
        
	return this;
    };
    /** get a service raw definition */
    this.Pimple.prototype.raw=function(name){
        return this._raw[name]; 
    };
    /** register a service provider */
    this.Pimple.prototype.register=function(provider){
        if(provider.register instanceof Function){
            provider.register(this);
        }else if(provider instanceof Function){
            provider(this);
        }
        return this;
    };
    //AMD
    if(this.define instanceof Function){
        this.define('pimple',[],function(){return self.Pimple;});
    }
    //CommonJS
    if(module && module.exports){
        module.exports = this.Pimple;
    }
}).call(this);
