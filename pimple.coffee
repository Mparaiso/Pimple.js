###
  Pimple dependency injection container 
  copyright 2011 M.PARAISO 
###
Pimple = do->
  class Pimple
    ### create a new container ###
    constructor:(values={})->
      @_values={}
      for key,value of values
        @set(key,value)
    ### define a service or a parameter ###
    set:(key=null,value=null)->
      if key==null then return
      result=null
      if @_isFunction(value)
        result=()=>
          return value(this)
      else
        result=value
      @_values[key]=result
      @_defineGetter(key)
      return 
    ### define accessor ####
    _defineGetter:(key)->
      if @[key]? then return 
      Object.defineProperty(this,key,{
        get:(x)=>
          return @get(key)
      })
    ### test if a value is a function ###
    _isFunction:(value)->

      return typeof value == 'function' and value instanceof Function
    ### access a service or a parameter ###
    get:(key)->
      value = this._values[key]
      if @_isFunction(value)
        return value(this)
      else
        return value
    ### define a shared service ###
    share:(key,callback)->
      _object = null
      if @_isFunction(callback)
        @set(key,=> 
          if _object!=null
            return _object
          else
            _object=callback(this)
            return _object
        )
      else
        @_throwNotCallbackError()
    ### return the function definition of the service ###
    raw:(key)->
      if @_values[key]?
        return @_values[key]
    ### protect a function ###
    protect:(key,callback)->
      if @_isFunction callback
        @set(key,->
          return callback
        )
      else
        @_throwNotCallbackError()
    ### extends a service definition ###
    extend:(key,callback)->
      definition = @raw(key)
      if @_isFunction(definition)
        return =>
          callback(definition(this),this)
      else
        @_throwNotCallbackError()
      
    _throwNotCallbackError:->
      throw new NotACallbackError()
    ### register a service provider ###
    register:(provider,definitions=[])->
        provider(this)
        for key,value of definitions
            @set(key,value)
        return this

  class NotACallbackError extends Error
    constructor:(rest...)->
      super(rest...)
      @type="NotACallbackError"
      toString:->"NotACallbackError"

  return Pimple

###
 make Pimple compatible with requirejs and AMD
###
if define? and exports?
  define ->
    return Pimple

else if module?.exports?
    module.exports = Pimple
    return
else
    @Pimple = Pimple






