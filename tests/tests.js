/**
UNIT TESTS
**/
// créer un module.
// setup sera executé avant chaque test du module
// @note @js tester javascript avec qunit
// @see http://msdn.microsoft.com/en-us/magazine//gg749824.aspx
// @see http://net.tutsplus.com/tutorials/javascript-ajax/how-to-test-your-javascript-code-with-qunit/
// @see http://qunitjs.com/cookbook/#automating_unit_testing
module("Pimple",{
  setup:function(){
    this.Engine = function(){
      this.name ="X-egine";
    };
    this.Bike = function(engine){
      this.name ="default";
      this.engine = engine;
    };
    this.pimple = new Pimple();
    this.obj= {a:1,b:2,c:3};
    this._function=function(){
      return {a:1,b:2,c:3};
    };
    this.pimple.set('obj',this._function);
    this.pimple.set('some_tring',"astring");
  }
});

test("Pimple.set",function(){
  var engine,bike,_this=this;
  ok(this.pimple.get('obj')!==null,"obj is not null");

  this.pimple.set("engine",function(){
    var engine = new _this.Engine();
    engine.name = "Z-engine";
    return engine;
  });
  this.pimple.set("bike",function(pimple){
    var bike = new _this.Bike(pimple.get("engine"));
    return bike;
  });

  deepEqual(this.pimple.get('obj') ,this.obj ,"execute fonction returns an object");
  ok(this.pimple.get('some_tring')==="astring","returns an string");
  ok(this.pimple['bike'].name=="default",'getter working');
  ok(this.pimple.bike.engine.name=="Z-engine",'dependency injection works as expected');
});

test("Pimple.share",function(){
  var car,Car,_this=this;
  Car=function (){
    this.color = "blue";
    this.brand = "GM";
    this.price = "$15000";
  };
  this.pimple.share("car",function(){
    return new Car();
  });
  car = this.pimple.get("car");
  car.color= "red";
  car.price= "$20000";
  car.brand= "Volvo";
  deepEqual(this.pimple.get('car'),car,'shared function executed only once');
  this.pimple.get("car").color="green";
  ok(this.pimple.get("car").color==="green","shared function allows shared object");
  ok(this.pimple.car.brand=="Volvo",'getter working and shared');
  throws(function(){_this.pimple.share('error','error');},"throws error , cant use scalars with Pimple.share");
});

test("Pimple.protect",function(){
  var sayHello;
  sayHello = function(message){
    return message || "Hi";
  };
  this.pimple.protect('sayhello',sayHello);
  ok(sayHello()=="Hi");
  ok(sayHello("Bonjour")=="Bonjour");
  ok(this.pimple.sayhello()=="Hi","function protected, using getter");
  ok(this.pimple.sayhello("Bonjour")=="Bonjour","function protected , using getter");
  ok(this.pimple.get('sayhello')("Salut")=="Salut","function protected, using Pimple.get");
  throws(function(){_this.pimple.protect('error',"error");},"throws an error : cant use protect with a scalar");
});

test("Pimple.raw",function(){
  this.pimple.set('image',function(pimple){
    return new Image();
  });
  this.pimple.set('scalar',"hello");
  ok(this.pimple.raw("image") instanceof Function);
  ok(this.pimple.raw('scalar')==="hello");
});

test("Pimple.extend",function(){
  this.pimple.set('engine',function(){
    return {engine:"diesel"};
  });
  this.pimple.set("car",function(){
    return {color:'blue',seats:'4',engine:'oil'};
  });
  this.pimple.set('car',this.pimple.extend("car",function(car,pimple){
    car.color = 'red';
    car.engine = pimple.get('engine').engine;
    return car;
  }));
  ok(this.pimple.get("car").color==="red","object definition extended");
  ok(this.pimple.get('car').engine==="diesel","pimple container injected properly");
});

