PIMPLE.JS
=========

[![NPM](https://nodei.co/npm/pimple.png?downloads=true)](https://nodei.co/npm/pimple/)

[![Build Status](https://travis-ci.org/Mparaiso/Pimple.js.png?branch=2.X)](https://travis-ci.org/Mparaiso/Pimple.js)

###WARNING : this is the documentation for branch 2.X, the API has been heavily refactored from version 1.X

#### Pimple is a Dependency injection container for javascript , compatible with all javascript enabled browsers.
see : http://en.wikipedia.org/wiki/Dependency_injection

author M.Paraiso , inspired by Pimple by Fabien Potencier : https://github.com/fabpot/Pimple

contact: mparaiso@free.Fr

#### status: beta

#### features:
+ AMD compatible

#### change log
- 2.0.0 API in sync with PHP version branch 2.X please check : https://github.com/fabpot/Pimple for changes
- 0.0.4 pimple can now be instanciated without new
- 0.0.3 api changed for shared,protected and extended services , see README.md
- 0.0.2 register method added

###Usage

Creating a container is a matter of instating the Pimple class


    var container = new Pimple();


As many other dependency injection containers, Pimple is able to manage two different kind of data: services and parameters.

####Defining Parameters


    // define some parameters
    container.set('cookie_name','SESSION_ID');
    $container.set('session_storage_class','SessionStorage');

####Defining Services

A service is an object that does something as part of a larger system. Examples of services: Database connection, templating engine, mailer. Almost any object could be a service.

Services are defined by anonymous functions that return an instance of an object

    // define some services
    container.set('session_storage',function (c) {
        return new c.session_storage_class(c.cookie_name);
    });
    
    container.set('session',function (c) {
        return new Session(c.session_storage);
    });

Notice that the anonymous function has access to the current container instance, allowing references to other services or parameters.

As objects are only created when you get them, the order of the definitions does not matter, and there is no performance penalty.

Using the defined services is also very easy

    // get the session object in browsers that support property descriptors
    var session = container.session;
    //or in old browsers
    session = container.get('session');
    
    // the above call is roughly equivalent to the following code:
    // storage = new SessionStorage('SESSION_ID');
    // session = new Session($storage);

####Protecting Parameters

Because Pimple sees anonymous functions as service definitions, you need to wrap anonymous functions with the protect() method to store them as parameter

    container.set('random',container.protect(function () { return Math.random(); }));

####Modifying services after creation

In some cases you may want to modify a service definition after it has been defined. You can use the extend() method to define additional code to be run on your service just after it is created

    container.set('mail',function (c) {
        return new \Mail();
    });

    container.extend('mail', function(mail, c) {
        mail.setFrom(c.mail.default_from);
        return mail;
    });

The first argument is the name of the object, the second is a function that gets access to the object instance and the container.

Fetching the service creation function

When you access an object, Pimple automatically calls the anonymous function that you defined, which creates the service object for you. If you want to get raw access to this function, you can use the raw() method

    container.set('session', function (c) {
        return new Session(c.session_storage);
    });

    var sessionFunction = container.raw('session');

####Extending a Container

If you use the same libraries over and over, you might want to reuse some services from one project to the other; package your services into a provider;

    var provider = {
        register:function(container){
            // register some services and parameters
            // on pimple
        }
    }

Then, the provider can be easily registered on a Container:

    container.register(provider);

####Defining Factory Services

    By default, each time you get a service, Pimple returns the same instance of it. If you want a different instance to be returned for all calls, wrap your anonymous function with the factory() method

    container.factory('session',function (c) {
            return new Session(c.session_storage);
    });
