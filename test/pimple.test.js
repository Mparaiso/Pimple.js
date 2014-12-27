/**
 * Pimple tests
 * @copyright mparaiso <mparaiso@online.fr>
 */
var assert = require("assert");

describe('Pimple',function(){
    var Pimple = require('../pimple');
    var definitions = {
        param:"value",
        paramGetter:function(pimple){return pimple['param'];},
        paramGetter2:function(pimple){return pimple.get('param');}
    }
    var container = new Pimple(definitions);
    it("should be instanciated properly",function(){
        assert.equal(container.param,definitions.param);
        assert.equal(container.get('param'),definitions.param);
        assert.equal(container.get('paramGetter'),definitions.param);
        assert.equal(container.get('paramGetter2'),definitions.param);
        assert.equal(container.paramGetter2,definitions.param);
    });
    it('raw should return service definition',function(){
        assert.ok(container.raw('paramGetter') instanceof Function);
        assert.ok(container.raw('paramGetter2') instanceof Function);
    });
    it('should support factories',function(){
        container.set('i','foo');
        container.factory('f',function(container){
            assert.equal(container.get('i'),'foo');
            return new Date;
        })
        assert.ok(container.get('f')!==container.get('f'));
        assert.ok(container.f instanceof Date);
    });
    it('should support shared services',function(){
        container.set("shared",function(){
            return new Date();
        });
        container.set("shared2",function(){
            return {
                param:this.param
            };
        });
        assert.equal(container.shared,container.shared);
        assert.equal(container.shared2,container.shared2);
    });
    it("should support protected services",function(){
        container.set('protected',container.protect(function(){
            return 5;
        }))
        assert.ok(container.protected instanceof Function);
        assert.equal(container.protected(),5);
    });
    it('should throw exception when trying to extend definition that not exists', function () {
        try {
            container.extend('params', function (params, container) {
                return params;
            });
            assert.fail('Expected exception');
        } catch (e) {
            assert(e instanceof Error);
            assert.equal(e.message, 'Identifier "params" is not defined.');
        }
    });
    it(('should support definition extension'),function(){
        container.set('params',function(){
            return {
                param1:1
            }
        });
        container.extend('params',function(params,container){
            params.param2=2;
            container.set('param3',3);
            return params;
        });
        assert.equal(container.params.param2,2);
        assert.equal(container.params.param1,1);
        assert.equal(container.param3,3);
    });
    it('should support definition registration',function(){
        container.register(function(container){
            container.set('param4',4);
            container.set('param5',function(container){
                return container.param4+1;
            });
        });
        assert.equal(container.param4,4);
        assert.equal(container.param5,5);
    });
});
