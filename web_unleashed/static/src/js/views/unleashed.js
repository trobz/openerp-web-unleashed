openerp.unleashed.module('web_unleashed').ready(function(instance, base, _, Backbone){

    var View = instance.web.View,
        _super = instance.web.View.prototype;
    
    /*
     * @class
     * @module      web_unleashed
     * @name        UnleashedView
     * @classdesc   Common operations simplifying the use of OpenERP Views
     * @mixes       instance.web.View
     * 
     * @author Michel Meyer <michel[at]zazabe.fr>
     */
    var UnleashedView = View.extend({
        
        /*
         * @property {Marionette.Module} mainly used as a event proxy, required to reset it
         */
        module: base,
        
        /*
         * @property {Marionette.Panel} default panel initialized
         */
        Panel: base.views('Panel'), 
        
        /*
         * @property {Backbone.Model} default state manager model, change it to support custom state in your app
         */
        State: base.models('State'),
        
        /*
         * Initialize the View, called by OpenERP ViewManager
         */
        init: function(parent, dataset, view_id, options) {
            this._super(parent, dataset, view_id, options);
            this.context = dataset.get_context().eval();
            this.on('view_loaded', this, this.ready);
        },

        /*
         * Pre configure the view before state processing
         * "arch" parameters passed in argument
         */
        configure: function(data){},
        
        /*
         * Implement this method to do some actions when the view is ready
         */
        ready: function(data){},
        
        /*
         * Configure the view state
         */
        stateConfig: function(){},
        
        /*
         * Executed when the Unleashed View has been injected in the DOM
         */
        view_loading: function(data){

            this.configure(data);

            this.panel = new this.Panel({
                el: $('.oe_application'),
                
                regions: {
                    pager: this.options.$pager,
                    buttons: this.options.$buttons,
                    sidebar: this.options.$sidebar,
                    body: this.$el
                }
            }); 
            
            var def = $.Deferred();
            $.when(this._super(data)).done(_.bind(function(){
                // setup the view state    
                this.stateInit().done(_.bind(function(){
                    this.stateChanged();
                    this.bindView();
                    def.resolve();
                }, this));
                
            }, this));
            
            return def.promise();
        },
        
        /*
         * Initialize the view state with current URL parameters and process it
         */
        stateInit: function(){
            var data = $.bbq.getState();
            _(data).each(function(val, name){
                data[name] = $.isNumeric(val) ? parseInt(val) : val;
            });
            this.state = new this.State(data);
            this.stateConfig();
            return this.state.process();    
        },
        
        /*
         * Bind some default events, managing state changes and redirection 
         */
        bindView: function(){
            this.module.on('do:action', this.do_action, this);
            this.module.on('open:record', this.openRecord, this);
            this.module.on('open:list', this.openList, this);
            this.module.on('state:change', this.stateChanged, this);
            this.state.on('change', this.stateChanged, this);
        },
        
        /*
         * Remove view listeners
         */
        unbindView: function(){
        	this.module.off(null, null, this);
        	this.state.off(null, null, this);
        },
        
        /*
         * Push state changes into the URL
         */
        stateChanged: function(){
            this.do_push_state(this.state.attributes);
        },
        
        
        /*
         * Redirect to a form view on a specific record
         * 
         * @param {String} model_name   record model name
         * @param {Integer} id          record id 
         */
        openRecord: function(model_name, id){
            this.do_action({
                type: 'ir.actions.act_window',
                res_model: model_name,
                res_id: id,
                views: [[false, 'form']],
                target: 'current',
                context: this.context,
            });
        },
        
        /*
         * Redirect to a list view on a specific model
         * 
         * @param {String} model_name   record model name
         */
        openList: function(model_name){
            this.do_action({
                type: 'ir.actions.act_window',
                res_model: model_name,
                views: [[false, 'form']],
                target: 'current',
                context: this.context,
            });
        },
        
        /*
         * Properly destroy the view by stopping regions in the panel layout
         */
        destroy: function() {
        	this.unbindView();
        
            if(this.panel && this.panel.regionManager){
                this.panel.regionManager.closeRegions();
            }
            return this._super();
        }
    });
    
    base.views('Unleashed', UnleashedView);
});