openerp.unleashed.module('web_unleashed', function(base, _, Backbone){

    /*
     * Connector object manage the sync of data between a Backbone.Model and the OpenERP JSON-RPC API
     */
    var Connector = {
        call: function(model, options, connection){
            if(!model.model_name){
                throw new Error('the OpenERP "model_name" is not defined');
            }
            
            var qdef = new connection(model.model_name).call(options.method, options.args);
          
            qdef.done(function(result){
                if(_.isArray(result)){
                    console.debug('connector', 'call', options.method, result.length, 'result(s)', 'on', model.model_name);
                }
                else if(_.isNumber(result)){
                    console.debug('connector', 'call', options.method, result, 'count', 'on', model.model_name);
                }
                else if(_.isObject(result)){
                    console.debug('connector', 'call', options.method, result, 'object', 'on', model.model_name);
                }
                else {
                    console.debug('connector', 'call', options.method, 'unknown response...', 'on', model.model_name);
                }
            });
          
            return qdef;
        },
        
        read: function(model, options, connection){
            if(options && !options.type){
                options.type = 'all';
            } 
            return this.search(model, options, connection);
        },
        
        count: function(model, options, connection){
            options = _.extend(options || {}, {
                type: 'count'
            });
            return this.search(model, options, connection);
        },
        
        search: function(model, options, connection){
            
            if(!model.model_name){
                throw new Error('the OpenERP "model_name" is not defined for this model');
            }
            
            var q = new connection(model.model_name).query(options.fields || undefined);
            
            // handle options has with OpenERP JSON-RPC web methods
            if(options.filter){
                q = q.filter(options.filter);
            }
            if(options.order){
                q = q.order_by(options.order);
            }
            if(options.limit){
                q = q.limit(options.limit);
            }
            if(options.offset){
                q = q.offset(options.offset);
            }
            if(options.context){
                q = q.context(options.context);
            }
            
            
            var def = $.Deferred();
            
            if(options.group_by && options.group_by.length > 0 && options.type != 'count'){
                var group_result = [];
                var qdef = q.group_by(options.group_by);
                qdef.done(function(groups){
                    var defs = [];
                    _.each(groups, function(group){
                        var gdef = group.query(options.fields || undefined).all().done(function(result){
                            var name = group.attributes.value[1];
                            _.each(result, function(model){
                                group_result.push(
                                    _.extend(model, { group: name })
                                );    
                            });
                        });
                        defs.push(gdef);
                    });
                    
                    var gqdef = $.when.apply($, defs);
                    
                    gqdef.done(function(){
                        def.resolve(group_result);
                    });
                    gqdef.fail(function(){
                        def.reject.apply(def, _.toArray(arguments));
                    });
                });
                qdef.fail(function(){
                    def.reject.apply(def, _.toArray(arguments));
                });
            }
            else {
                var qdef = q[options.type]();
                qdef.done(function(result){
                    if(_.isArray(result)){
                        console.debug('connector', result.length, 'result(s)', 'on', model.model_name);
                    }
                    else if(_.isNumber(result)){
                        console.debug('connector', result, 'count', 'on', model.model_name);
                    }
                    else if(_.isObject(result)){
                        console.debug('connector', result, 'object', 'on', model.model_name);
                    }
                    else {
                        console.debug('connector', 'unknown response...', 'on', model.model_name);
                    }
                    def.resolve.apply(def, _.toArray(arguments));
                });
                qdef.fail(function(){
                    def.reject.apply(def, _.toArray(arguments));
                });
                
            }
   
            def.promise().then(options.success, options.error);
            return def.promise();
        },
        
        create: function(model, options, connection){
            var q = new connection(model.model_name);
            return q.call('create', [ model.attributes ], {context: q.context(options.context) }).done(function(id, status){
                if(status == "success"){
                    model.set({id: id});
                }
                else {
                    throw new Error('failed to save model ' + model.model_name);    
                }
                console.debug('sync create');
            });
        },
        
        update: function(model, options, connection){
            var q = new connection(model.model_name);
            return q.call('write', [ [ model.get('id') ], model.attributes ], {context: q.context(options.context) }).done(function(id, status){
                if(status != "success"){
                    throw new Error('failed to save model ' + model.model_name);    
                }
                console.debug('sync updated');
            });
        },
        
        "delete": function(model, options, connection){
            console.debug('delete called', model.get('id'));
            var q = new connection(model.model_name);
            return q.call('unlink', [ model.get('id') ], {context: q.context(options.context) }).done(function(){console.debug('sync delete', arguments)});
        },
    };
    
    base.utils('Connector', Connector);    
});