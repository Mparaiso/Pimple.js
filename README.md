#PIMPLE.JS

### Pimple is a small Dependency Injection Container for javascript , compatible with all javascript enabled browsers.

### author M.Paraiso , inspired by Pimple by Fabien Potencier : https://github.com/fabpot/Pimple

### status: beta

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
pimple.set('databasse',function (pimple) {
    return new Database(pimple.get('connection_string'));
});

// on recent browsers , you can use accessors ( IE9+,CHROME,FIREFOX,OPERA,SAFARI )
pimple.set('database',function (pimple) {
    return new Database(pimple.connection_string);
});
// or just set a scalar value
pimple.set('color',"green");
```

### query for a service

```javascript
pimple.get('service')
//or on recent browsers support defineProperty  ( IE9+,CHROME,FIREFOX,OPERA,SAFARI )
pimple.service
```

### define a shared service 

the service callback with be exectuted only once
```javascript
// Pimple.share(name,callback)
// given a Router object
pimple.share('car',function (pimple) {
    return {
      engine:"x",
      color:"red"
    }
});
var car = pimple.get('car'); // or car = pimple.car on recent browsers supporting accessors
car.color = 'green'
console.log(pimple.get(car).color) // returns green
```