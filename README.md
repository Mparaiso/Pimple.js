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

