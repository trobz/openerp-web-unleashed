openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
        
    openerp.testing.section('JSON-RPC Backbone Sync Connector', function (test) {

        var Connector = base.utils('Connector');
        var connection = null;
        var sync = function(method, model, options){
            return Connector[method].apply(Connector, [model, options, connection]);
        };
        
        test('fetch', {templates: false, rpc: 'mock', asserts: 2}, function (instance, $fixture, mock) {
            
            //fake response to JSON-RPC call
            mock('/web/dataset/search_read', function (call) {
                
                //return 100 items by default
                var result = [];
                for(var i=1 ; i <= 100 ; i++){
                    result.push({id: i, name: 'item ' + i});
                } 
    
                return { records: result };
            });
            
            connection = instance.web.Model;
            
            var List = Backbone.Collection.extend({
                sync: sync,
                model_name: 'unit.test',
            });
            
            var list = new List();            
            
            return list.fetch().done(function(results){
                strictEqual(list.length, 100, '100 should be fetched');
                strictEqual(list.get(42).get('name'), 'item 42', '42nd item should be named "item 42"');
            });
        });
    
        test('fetch with filter', {templates: false, rpc: 'mock', asserts: 6}, function (instance, $fixture, mock) {
            
            //fake response to JSON-RPC call
            mock('/web/dataset/search_read', function (call) {
                var offset = call.params.offset ? call.params.offset : 1;
                var limit = call.params.limit ? call.params.limit : 100;
                var reverse = !!(call.params.sort && call.params.sort != '');
                var domain = call.params.domain.length > 0 ? call.params.domain[0] : null;
                
                if(reverse){
                    var _offset = offset;
                    offset = limit;
                    limit = _offset; 
                }
                
                //return 100 items by default
                var result = [];
                    
                for(var i = offset ; (reverse ? i >= limit : i <= (offset + limit) - 1) ; (reverse ? i-- : i++)){
                    
                    if(!domain 
                    || domain && domain[1] == '=' && domain[2] == i 
                    || domain && domain[1] == '<=' && domain[2] >= i){
                        result.push({id: i, name: 'item ' + i});
                    }
                } 
                return { records: result };
            });
            
    
            connection = instance.web.Model;
            
            var List = Backbone.Collection.extend({
                sync: sync,
                model_name: 'unit.test',
            });
            
            var list = new List();            
            
            var t1 = list.fetch({ 
                filter: [['id', '=', '42']]
            })
            .done(function(results){
                strictEqual(list.length, 1, '1 item should be fetched');
                strictEqual(list.at(0).get('name'), 'item 42', 'first item should be named "item 42"');
            });
            
            var t2 = list.fetch({ 
                filter: [['id', '<=', '42']], 
                order: ['-id'] 
            }).done(function(results){
                strictEqual(list.length, 42, '42 items should be fetched');
                strictEqual(list.at(0).get('name'), 'item 42', 'first item should be named "item 42"');
            });
            
            var t3 = list.fetch({ 
                limit: 10, 
                offset: 42 
            }).done(function(results){
                strictEqual(list.length, 10, '10 items should be fetched');
                strictEqual(list.at(0).get('name'), 'item 42', 'first item should be named "item 42"');
            });
            
            return $.when(t1, t2, t3);    
        });
    });    
    
});
