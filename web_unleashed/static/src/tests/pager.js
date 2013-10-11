openerp.unleashed.module('web_unleashed').ready(function(instance, base, _, Backbone){
    
    var Pager = base.collections('Pager'); 
        
    openerp.testing.section('Pager Collection', function (test) {
    
        
        var Connector = base.utils('Connector');
        var connection = null;
        var sync = function(method, model, options){
            return Connector[method].apply(Connector, [model, options, connection]);
        };
        var List = Pager.extend({
            model_name: 'unit.test',
            sync: sync,
        });
            
        test('fetch', {templates: false, rpc: 'mock', asserts: 68 }, function (instance, $fixture, mock) {
         
            connection = instance.web.Model;
        
            var nb_records = 123;
            
            //fake response to JSON-RPC call
            mock('/web/dataset/search_read', function (call) {
                var result = [],
                    nb_before = call.params.offset,
                    nb_next = nb_records - nb_before,
                    limit = nb_next < call.params.limit ? nb_before + nb_next : nb_before + call.params.limit; 
                
                for(var i= nb_before + 1 ; i <= limit ; i++){
                    result.push({id: i, name: 'item ' + i});
                } 
    
                return { records: result };
            });
            
            mock('/web/dataset/call_kw', function (call) {
                console.log('/web/dataset/call_kw', arguments);
                return nb_records;
            });
            
            
            var list = new List();
            
            
            //helper to call deferred in a chain 
            var stack = {
                current: 0,
                obj: list,
                calls: [],
                def: $.Deferred(),
                add: function(method, params, callback){
                    this.calls.push({
                        method: method,
                        params: typeof params == 'function' ? [] : params,
                        callback: typeof params == 'function' ? params : (callback || function(){})
                    });
                    return this;
                },
                exec: function(){
                    this.next();
                    return this.def.promise();
                },
                next: function(){
                    var call = stack.calls.shift();
                    if(call){
                        var def = list[call.method].apply(list, call.params);
                        def.done(function(){
                            call.callback.apply(this, [call.method]);
                        });
                        def.done(stack.next);    
                    }
                    else {
                        stack.def.resolve();
                    }
                }
            };
            
            list.load().done(function(){
                
                strictEqual(list.pager.page, 0, 'init: page number is correct');
                strictEqual(list.pager.total, nb_records, 'init: total number of item is correct');
                strictEqual(list.pager.nb_pages, 2, 'init: number of pages is correct');
                strictEqual(list.length, 100, 'init: number of items in the collection is correct');
    
                strictEqual(list.hasPrevious(), false, 'init: pager has no previous');
                strictEqual(list.hasNext(), true, 'init: pager has next');
    
                strictEqual(list.at(0).get('name'), 'item 1', 'init: first item is correct');
                strictEqual(list.at(99).get('name'), 'item 100', 'init: last item is correct');
    
                
                list.on('change', function(){
                    list.off('change');
                    strictEqual(true, true, 'init: change page trigged');
                });
                list.on('change:next', function(){
                    list.off('change:next');
                    strictEqual(true, true, 'init: change:next page trigged');
                });
                
                
                stack.add('next', function(method){
                    strictEqual(list.pager.page, 1, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 2, method + ': number of pages is correct');
                    strictEqual(list.length, 23, method + ': number of items in the collection is correct');
    
                    strictEqual(list.at(0).get('name'), 'item 101', method + ': first item is correct');
                    strictEqual(list.at(22).get('name'), 'item 123', method + ': last item is correct');
        
                    strictEqual(list.hasPrevious(), true, method + ': pager has no previous');
                    strictEqual(list.hasNext(), false, method + ': pager has next');
    
                });
                
                
                stack.add('changeLimit', [10], function(method){
                    strictEqual(list.pager.page, 0, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 13, method + ': number of pages is correct');
                    strictEqual(list.length, 10, method + ': number of items in the collection is correct');
        
                    strictEqual(list.at(0).get('name'), 'item 1', method + ': first item is correct');
                    strictEqual(list.at(9).get('name'), 'item 10', method + ': last item is correct');
        
                    strictEqual(list.hasPrevious(), false, method + ': pager has no previous');
                    strictEqual(list.hasNext(), true, method + ': pager has next');
                });
                
                stack.add('last', function(method){
                    strictEqual(list.pager.page, 12, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 13, method + ': number of pages is correct');
                    strictEqual(list.length, 3, method + ': number of items in the collection is correct');
        
                    strictEqual(list.hasPrevious(), true, method + ': pager has no previous');
                    strictEqual(list.hasNext(), false, method + ': pager has next');
        
                    strictEqual(list.at(0).get('name'), 'item 121', method + ': first item is correct');
                    strictEqual(list.at(2).get('name'), 'item 123', method + ': last item is correct');
        
                });
 
                stack.add('previous', function(method){
                    strictEqual(list.pager.page, 11, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 13, method + ': number of pages is correct');
                    strictEqual(list.length, 10, method + ': number of items in the collection is correct');
        
                    strictEqual(list.at(0).get('name'), 'item 111', method + ': first item is correct');
                    strictEqual(list.at(9).get('name'), 'item 120', method + ': last item is correct');
        
                    strictEqual(list.hasPrevious(), true, method + ': pager has no previous');
                    strictEqual(list.hasNext(), true, method + ': pager has next');
                });
        
                var changed = false;
                stack.add('first', function(method){
                    strictEqual(list.pager.page, 0, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 13, method + ': number of pages is correct');
                    strictEqual(list.length, 10, method + ': number of items in the collection is correct');
        
                    strictEqual(list.at(0).get('name'), 'item 1', method + ': first item is correct');
                    strictEqual(list.at(9).get('name'), 'item 10', method + ': last item is correct');
        
                    strictEqual(list.hasPrevious(), false, method + ': pager has no previous');
                    strictEqual(list.hasNext(), true, method + ': pager has next');
                
                    //listen for next stack call
                    list.on('change', function(){
                        list.off('change');
                        changed = true; 
                    });
                    list.on('change:previous', function(){
                        list.off('change:previous');
                        changed = true; 
                    });
                });
                
                stack.add('previous', function(method){
                    strictEqual(changed, false, method + ': has not affected the pager');
                    
                    strictEqual(list.pager.page, 0, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 13, method + ': number of pages is correct');
                    strictEqual(list.length, 10, method + ': number of items in the collection is correct');
        
                    strictEqual(list.at(0).get('name'), 'item 1', method + ': first item is correct');
                    strictEqual(list.at(9).get('name'), 'item 10', method + ': last item is correct');
        
                    strictEqual(list.hasPrevious(), false, method + ': pager has no previous');
                    strictEqual(list.hasNext(), true, method + ': pager has next');
                
                    //listen for next stack call
                    list.on('change', function(){
                        list.off('change');
                        changed = true; 
                    });
                    list.on('change:previous', function(){
                        list.off('change:previous');
                        changed = true; 
                    });
                });
                
                stack.add('last').add('previous', function(method){
                    strictEqual(changed, true, method + ': has affected the pager');
                    
                    strictEqual(list.pager.page, 11, method + ': page number is correct');
                    strictEqual(list.pager.total, nb_records, method + ': total number of item is correct');
                    strictEqual(list.pager.nb_pages, 13, method + ': number of pages is correct');
                    strictEqual(list.length, 10, method + ': number of items in the collection is correct');
        
                    strictEqual(list.at(0).get('name'), 'item 111', method + ': first item is correct');
                    strictEqual(list.at(9).get('name'), 'item 120', method + ': last item is correct');
        
                    strictEqual(list.hasPrevious(), true, method + ': pager has no previous');
                    strictEqual(list.hasNext(), true, method + ': pager has next');
                });
                                
                
                stack.exec();
            });
            
            return stack.def.promise();
            
        });
    
    });    
    
});
