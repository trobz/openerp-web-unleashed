openerp.unleashed.module('web_unleashed', function(base, _, Backbone){

    
 /*
  * Connector object, interface to manage the sync of data between a Backbone.Model and the OpenERP JSON-RPC API.
  * Support all CRUD method.
  * 
  * @module      web_unleashed
  * @name        Connector
  * 
  * @author Michel Meyer <michel[at]zazabe.com>
  */ 
  var Connector = {
    
        /*
         * Direct call to the Python method accessible by an API call 
         * 
         * @param {Backbone.Model} model  the model who implement the custom method 
         * @param {Object} options         parameters to pass to the Python method accessible by an API call
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
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
        
        /*
         * Read model data by using the API
         *  
         * @param {Backbone.Model} model  the model to read 
         * @param {Object} options        query parameters
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
        read: function(model, options, connection){
            if(options && !options.type){
                options.type = 'all';
            } 
            return this.search(model, options, connection);
        },
        
        /*
         * Count model data by using the API
         *  
         * @param {Backbone.Model} model  the model to count 
         * @param {Object} options        query parameters
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
        count: function(model, options, connection){
            options = _.extend(options || {}, {
                type: 'count'
            });
            return this.search(model, options, connection);
        },
        
        /*
         * Read API wrapper, process the options parameters to create a API client Query
         *  
         * @param {Backbone.Model} model  the model to count 
         * @param {Object} options        query parameters
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
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
                q = $.isArray(options.order) ? q.order_by.apply(q, options.order) : q.order_by(options.order);
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
            
            
            //TODO: change the way group_by is implemented and avoid auto queries each QueryGroup...
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
        
        /*
         * Create a model by using the API
         * 
         * @param {Backbone.Model} model  the model to create 
         * @param {Object} options        query parameters
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
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
        
        /*
         * Update a model by using the API
         * 
         * @param {Backbone.Model} model  the model to update 
         * @param {Object} options        query parameters
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
        update: function(model, options, connection){
            var q = new connection(model.model_name);
            return q.call('write', [ [ model.get('id') ], model.attributes ], {context: q.context(options.context) }).done(function(id, status){
                if(status != "success"){
                    throw new Error('failed to save model ' + model.model_name);    
                }
                console.debug('sync updated');
            });
        },
        
        /*
         * Delete a model by using the API
         * 
         * @param {Backbone.Model} model  the model to delete 
         * @param {Object} options        query parameters
         * @param {Object} connection     OpenERP JSON-RPC API Client
         * @returns {jQuery.Deferred.promise}
         */
        "delete": function(model, options, connection){
            console.debug('delete called', model.get('id'));
            var q = new connection(model.model_name);
            return q.call('unlink', [ model.get('id') ], {context: q.context(options.context) }).done(function(){console.debug('sync delete', arguments)});
        },
    };
    
    base.utils('Connector', Connector);    
});