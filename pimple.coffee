###
  service container
###
# if(typeof Object.defineProperty == 'function')
#   class _PimpleBase
# else 
#   throw new Error("Pimple is not compatible with your browser")

class Pimple
  constructor:(values={})->
    for key,value in values
      @set(key,value)
      
  set:(key,value)->
    result=null
    if @_isFunction(value)
      result=()=>
        return value(this)
    else
      result=value
    @_values[key]=result
    @_defineGetter(key)
    return 

  _defineGetter:(key)->
    Object.defineProperty(this,key,{
      get:(x)=>
        return @get(key)
    })

  _isFunction:(value)->

    return typeof value == 'function' and value instanceof Function

  get:(key)->
    value = this._values[key]
    if @_isFunction(value)
      return value(this)
    else
      return value
  
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

  raw:(key)->
    if @_values.key?
      return this['_values'][key]

  protect:(key,callback)->
    if @_isFunction callback
      @set(key,->
        return callback
      )
    else
      @_throwNotCallbackError()

  _throwNotCallbackError:->
    throw new NotACallbackError()

class NotACallbackError extends Error
  constructor:(rest...)->
    super(rest...)
    @type="NotACallbackError"
    toString:->"NotACallbackError"



