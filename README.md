#PIMPLE.JS

### Pimple is a Dependency injection container for javascript , compatible with all javascript enabled browsers.
see : http://en.wikipedia.org/wiki/Dependency_injection

### author M.Paraiso , inspired by Pimple by Fabien Potencier : https://github.com/fabpot/Pimple

#### contact: mparaiso@free.Fr

### status: beta

### features:
+ AMD compatible

## USAGE

### installation 

in a html file
```html
<script type='text/javascript' src='path/to/pimple/pimple.js'>
```

### definition

```javascript
var pimple = new Pimple()
```
or initialise the container with values

```javascript
var pimple = new Pimple({'greet':function(){return "hi"},'color':'green'})
```

#### define a service
you define a service with an anonymous function

```javascript
// Pimple.set(name,callback)
// given a Database object
pimple.set('database',function (pimple /* pimple is injected in the function */ ) {
    return new Database(pimple.get('connection_string'));
});

// on recent browsers , you can use accessors ( IE9+,CHROME,FIREFOX,OPERA,SAFARI )
pimple.set('database',function (pimple /* pimple is injected in the function */ ) {
    return new Database(pimple.connection_string);
});
```
### define a paramater
```javascript
// just set a scalar value
pimple.set('color',"green");
```

#### query for a service

since the service is wrapped into a function , it will be lazy-loaded , allowing to save computer CPU.

```javascript
pimple.get('service')
//or on recent browsers support defineProperty  ( IE9+,CHROME,FIREFOX,OPERA,SAFARI )
pimple.service
pimple['service']
```

#### define a shared service 

the service callback with be exectuted only once and the result will be shared for each call
```javascript
// Pimple.share(name,callback)
pimple.share('car',function (pimple /* pimple is injected in the function */ ) {
    return {
      engine:"x",
      color:"red"
    }
});
var car = pimple.get('car'); // or car = pimple.car on recent browsers supporting accessors
car.color = 'green'
console.log(pimple.get("car").color) // returns green
```
#### define a protected service

```javascript
//Pimple.protect(name,callback)
pimple.protect('sayHi',function(){
      return alert('Hi');
});
pimple.get('sayHi')(); // alerts Hi
```

#### extends a defined service

Pimple.extend returns a service definition ( a callback ).

```javascript
// define a service ajax_service
pimple.set("ajax",function(pimple){
  return new Ajax({method:'GET'});
});
//Pimple.extend(existing_service_name,callback)
pimple.set('ajax',pimple.extend('ajax',function(ajax,pimple){
  ajax.method = "PUT";
  return ajax;
}));
```

#### get the service raw definition

Pimple.raw returns the original service defintion ( a scalar or a callback )

```javascript
pimple.set('service',function(pimple){
  new Service();
})
//Pimple.raw(service_name)
pimple.raw('service') // return the  service callback definition
```

CHANGE LOG
0.0.2 register method added
