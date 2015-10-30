(function(odoo){

    /**
     * use latest version from Backbone
     **/
    var LatestBackbone = Backbone.noConflict(),
        Marionette = LatestBackbone.Marionette;

    /**
     * `require` adapter allow to access Odoo services
     **/
    var require_adapter = function(service_name) {
        // not a good way to locate service
        return odoo.__DEBUG__.services[service_name];
    }

    /**
     * basic services used by unleashed application
     **/
    var Core = require_adapter('web.core'),
        Model = require_adapter("web.Model"),
        Translation = require_adapter('web.translation');

    /**
     * Setup the QWeb rendering method for Backbone.Marionette
     **/
    Marionette.Renderer.render = function(templateName, data) {
        return Core.qweb.render(templateName, data);
    };

    /**
     * Utilities allow to get and set specific resource
     * to specific storage type using name-space
     **/
    var AttributeAccess = {

        get: function(namespace, name){
            var obj = this.Class && this.Class[namespace]
                      && this.Class[namespace][name]
                    ? this.Class[namespace][name] : null;
            if(!obj){
                throw this.error(
                    '"%s.%s" can not be found in module "%s"',
                    namespace, name, this.moduleName
                );
            }
            return obj;
        },
        set: function(namespace, name, obj){
            this.Class = this.Class || {};
            this.Class[namespace] = this.Class[namespace] || {};
            if(obj){
                this.Class[namespace][name] = obj;
            }
            return AttributeAccess.get.apply(this, [namespace, name]);
        }
    };

    /**
     * Extend functionality of module to hold standard custom assets such as:
     * routers, controllers, models, collections, views, behaviors
     *
     * other assets can be stored in utils storage
     **/
    _.extend(Marionette.Module.prototype, {

        // getter to get resource from specific storage
        get: function(namespace, name){
            // handle no name-space definition
            if(!name){
                name = namespace; namespace = 'Misc';
            }
            return AttributeAccess.get.apply(this, [namespace, name]);
        },

        // setter to store resource in specific storage
        set: function(namespace, name, obj){
            // handle no name-space definition
            if(!obj){
                obj = name; name = namespace; namespace = 'Misc';
            }
            return AttributeAccess.set.apply(this, [namespace, name, obj]);
        },

        // backbone router storage
        routers: function(name, obj) {
            return AttributeAccess.set.apply(this, ['Routers', name, obj]);
        },

        // backbone models storage
        models: function(name, obj){
            return AttributeAccess.set.apply(this, ['Models', name, obj]);
        },

        // backbone collections storage
        collections: function(name, obj){
            return AttributeAccess.set.apply(this, ['Collections', name, obj]);
        },

        // backbone & marionette views storage
        views: function(name, obj){
            return AttributeAccess.set.apply(this, ['Views', name, obj]);
        },

        // marionette controllers storage
        controllers: function(name, obj){
            return AttributeAccess.set.apply(this, ['Controllers', name, obj]);
        },

        // marionette behaviors storage
        behaviors: function(name, obj) {
            return AttributeAccess.set.apply(this, ['Behaviors', name, obj]);
        },

        // utility storage
        utils: function(name, obj){
            return AttributeAccess.set.apply(this, ['Utils', name, obj]);
        },

        error: function(ErrorObject, message){
            var args = _.toArray(arguments),
                msg = message,
                Err = ErrorObject;

            if(_.isString(ErrorObject)) {
                msg = ErrorObject;
                Err = Error;
                args.splice(0, 1);
            }
            else {
                args.splice(0, 2);
            }
            return new Err(
                _.str.sprintf.apply(_.str, [msg].concat(args))
            );
        },

        // translation shortcut
        _t: Translation._t,
        _lt: Translation._lt,

        // renderer shortcut
        render: Marionette.Renderer.render
    });

    /**
     * each module should have it own resource storage
     * stored under module's Class attribute
     **/
    _.extend(Marionette.Module, { Class: {} });

    // null until web_unleashed module is initialized...
    var sync = null;

    // create the Unleashed Marionette.Application used to organize modules
    var Unleashed = odoo.unleashed = new Marionette.Application();

    // called at Unleashed start
    Unleashed.addInitializer(function(require){
        var module = this.module, app = this;
        this.module = function(name, callback){
            var call = function(){
                if(callback){
                    /**
                     * Callback function to create new module
                     * should follow the following order (where require
                     * is a common way to get access to ODOO internal services)
                     *
                     * odoo.unleashed.module(
                     *     'your-module', function(your_module, require, _, Backbone, base) {
                     *          // module definition
                     *      }
                     * )
                     **/
                    callback.apply(this, [
                        this,
                        require_adapter,
                        _,
                        LatestBackbone,
                        this.app.module("web_unleashed")
                    ]);
                }
            };
            return module.apply(app, [name, call]);
        };

        this.sync = function(method, model, options) {
            if(!sync) {
                throw module.error(
                    "Model %s can not be sync (%s) yet, waiting for OpenERP module initialization...",
                    model, method
                );
            }
            else {
                return sync.apply(this, [method, model, options ]);
            }
        };
    });

    // start the Unleashed Application
    Unleashed.start();

    // initialize web_unleashed module
    Unleashed.module("web_unleashed", function(unleashed, require, _, Backbone, base) {

        /**
         * Setup Connector with Odoo API
         */
        sync = function(method, model, options){
            if(!model.model_name){
                throw unleashed.error(
                    "'model_name' is not defined on Backbone Model/Collection."
                );
            }
            options = options || {};
            var Connector = unleashed.utils("Connector");

            // instantiate a JSON-RPC model object to communicate with Odoo by JSON-RPC
            var connection = new Model(
                model.model_name,
                options.context || {},
                options.domain || []
            );

            return Connector[method](model, options, connection);
        };

        /**
         * Setup debugger console
         * Display console.debug message only when Odoo debug mode is on
         */
        console = console || {};

        var console_debug   = console.debug     || function(){},
            console_time    = console.time      || function(){},
            console_timeEnd = console.timeEnd   || function(){};

        if(!odoo.debug){
            console.debug = console.time = console.timeEnd = function(){};
        }
        else {
            console.debug = function(){
                console_debug.apply(console, arguments);
            };
            console.time = function(){
                console_time.apply(console, arguments);
            };
            console.timeEnd = function(){
                console_timeEnd.apply(console, arguments);
            };
        }
    });

})(odoo);
