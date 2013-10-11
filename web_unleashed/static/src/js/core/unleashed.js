(function(openerp){
    //FIXME: current BackboneJS version is 0.9.2 on OpenERP, to get the latest features from Backbone 1.0, a local version is used there under Backbone
    //       can be removed when BackboneJs will be updated on OpenERP...
    var LatestBackbone = Backbone.noConflict();
    var LatestUnderscore = _.noConflict();      
    
    // will get the web object defined by OpenERP
    var web = {};
    
    // AttributeHolder access
    var AttributeAccess = {
        add: function(namespace, name, obj){
            
            this.Class = this.Class || {}; 
            this.Class[namespace] = this.Class[namespace] || {}; 
            
            if(obj){
                this.Class[namespace][name] = obj;
            }
            
            return AttributeAccess.get.apply(this, [namespace, name]);
        },
        
        get: function(namespace, name){
            var obj = this.Class && this.Class[namespace] && this.Class[namespace][name] ?  this.Class[namespace][name] : null; 
            if(!obj){
                throw new Error('"' + namespace + '.' + name + '" can not be found in module "' + this.name + '"');
            }
            return obj;
        },
    };
      
      
      
    var getModule = function(module_name, base_module){
        var module = null;
        if(this[module_name]){
            module = this[module_name];
        }
        else {
            var def = $.Deferred();
            
            module =  _.extend({
                // manage Class, to be able to split the architecture in many files and keep all organized in 
                // on object
                Class: {},
            
                name: module_name,
                
                models: function(name, obj){
                    return AttributeAccess.add.apply(this, ['Models', name, obj]);
                },
                
                collections: function(name, obj){
                    return AttributeAccess.add.apply(this, ['Collections', name, obj]);
                },
                
                views: function(name, obj){
                    return AttributeAccess.add.apply(this, ['Views', name, obj]);
                },
                
                utils: function(name, obj){
                    return AttributeAccess.add.apply(this, ['Utils', name, obj]);
                },
                
                ready: function(call){
                    def.done(call);
                },
                
                isReady: function(){
                    return def.state() === 'resolved';
                }, 
                // provide OpenERP instance.web object if available
                web: function(){ return web; }
            }, LatestBackbone.Events);
            
            openerp[module_name] = function(instance){
                def.resolveWith(module, [instance, module, LatestUnderscore, LatestBackbone, base_module || null]);
            };
            
            this[module_name] = module;
        }
        
        return module;
    };



    /*
     * Initialize a  Unleashed JS namespace, with Backbone MVC architecture and JSON-RPC connection support.
     */
    
    // null until the web_unleashed is initialized...
    var sync = null;
    
    var unleashed = openerp.unleashed = {
        module: function(module_name, call){
            
            var base_module = getModule.apply(this, ['web_unleashed']);
            var module = getModule.apply(this, [module_name, base_module]);
            
            if(typeof call == 'function'){
                call.apply(openerp, [module, LatestUnderscore, LatestBackbone, base_module]);
            }
            
            return module;
        },
        
        sync: function(method, model, options){
            if(!sync){
                throw new Error('Model ' + model + ' can not be sync (' + method + ') yet, waiting for OpenERP module initalization...');
            }
            else {
                return sync.apply(this,[ method, model, options ]);
            }
        }  
    };
    
    
    
    /*
     * prepare OpenERP translation methods on Backbone, only available when the base module is initialized 
     */
   
    

    unleashed.module('web_unleashed').ready(function(instance, _, Backbone){
        // link instance.web object and provide it to each modules
        web = instance.web; 
        
        // setup the connection with JSON-RPC API for Backbone
        
        var connection = instance.web.Model;
        var Connector = unleashed.module('web_unleashed').utils('Connector');
        
        debug = connection;
        /*
         * Backbone Sync method adapted for OpenERP JSON-RPC connection
         * see: http://doc.openerp.com/trunk/developers/web/rpc/
         */
        sync = function(method, model, options){
            return Connector[method].apply(Connector, [model, options, connection]);
        };
        
        
        // setup the rendering method for Backbone.Marionette
        
        var QWeb = instance.web.qweb;
        
        Marionette.Renderer.render = function( templateName, data ) {
            return QWeb.render(templateName, data);
        };
    
        // display console.debug message only in debug mode
        console = console || {};
        var console_debug = console.debug;
        
        console.debug = function(){
            if(instance.session.debug){
                console_debug.apply(console, arguments);
            }
        };
         
        
    });
    
    
    
})(openerp)