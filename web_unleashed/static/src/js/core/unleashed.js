(function(openerp){
    //FIXME: current BackboneJS version is 0.9.2 on OpenERP, to get the latest features from Backbone 1.0, a local version is used there under Backbone
    //       can be removed when BackboneJs will be updated on OpenERP...
    var LatestBackbone = Backbone.noConflict(),
        LatestUnderscore = _.noConflict(),
        Marionette = LatestBackbone.Marionette;
    

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
                throw new Error('"' + namespace + '.' + name + '" can not be found in module "' + this.moduleName + '"');
            }
            return obj;
        },
    };
       
    _.extend(Marionette.Module.prototype, {
        /*
         * wrap a module initializer and pass useful object to the callback
         */
        ready: function(callback){
            this.addInitializer(function(options){
                var instance = options.instance;
                callback.apply(this, [instance, this, LatestUnderscore, LatestBackbone, this.app.module('web_unleashed')])
            });
        },
        
        get: function(namespace, name){
            // handle no namespace definition
            if(!name){
                name = namespace;
                namespace = 'Misc';
            }
            return AttributeAccess.get.apply(this, [namespace, name]);
        },
        
        set: function(namespace, name, obj){
            // handle no namespace definition
            if(!obj){
                obj = name; 
                name = namespace;
                namespace = 'Misc';
            }
            return AttributeAccess.add.apply(this, [namespace, name, obj]);
        },
        
        // helpers
        
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
        }
    });   
    

    // add some specific method to Marionette.Module 
    var moduleCreate = Marionette.Module.create;
    _.extend(Marionette.Module, {

        // manage Class, to be able to split the architecture 
        // in many files and keep all organized in on object
        Class: {},

        /*
         * override the create module to autostart it when OpenERP is ready
         */
        create: function(app, moduleNames, moduleDefinition){
            var module = moduleCreate.apply(this, arguments);
            
            openerp[moduleNames] = function(instance){
                module.start({
                    instance: instance
                });
            };
            
            return module; 
        }
    });  
       
       
    /*
     * Initialize a  Unleashed JS namespace, with Backbone MVC architecture and JSON-RPC connection support.
     */
    
    // null until the web_unleashed is initialized...
    var sync = null;
    
    var Unleashed = openerp.unleashed = new Marionette.Application();
    
    Unleashed.addInitializer(function(options){
        var module = this.module,
            app = this;
        
        // override the module creation function to have all modules in startWithParent false mode
        this.module = function(name, callback){
            var call = function(){
                this.startWithParent = false;
                if(callback){
                    callback.apply(this, [this, LatestUnderscore, LatestBackbone, this.app.module('web_unleashed')])
                }
            };
            return module.apply(app, [name, call]);
        };
        
        // sync method used by Backbone Models to access to OpenERP data by the JSON-RPC API
        this.sync = function(method, model, options){
            if(!sync){
                throw new Error('Model ' + model + ' can not be sync (' + method + ') yet, waiting for OpenERP module initalization...');
            }
            else {
                return sync.apply(this,[ method, model, options ]);
            }
        };    
    });
    
    // start the app
    Unleashed.start();
    
    
    
    /*
     * prepare OpenERP translation methods on Backbone, only available when the base module is initialized 
     */
   
    Unleashed.module('web_unleashed').ready(function(instance, base, _, Backbone){
        // link instance.web object and provide it to each modules
        web = instance.web; 
        
        // setup the connection with JSON-RPC API for Backbone
        
        var connection = instance.web.Model;
        var Connector = base.utils('Connector');
        
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