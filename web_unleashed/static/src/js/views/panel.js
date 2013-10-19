openerp.unleashed.module('web_unleashed',function(base, _, Backbone, base){
    
    var Region = Backbone.Marionette.Region,
        _superRegion = Region.prototype;
    
    /*
     * @class
     * @module      web_unleashed
     * @name        OpenRegion
     * @classdesc   Marionette Region build with existing jQuery element
     * @mixes       Marionette.Region
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */
    var OpenRegion = Region.extend({
        
        /*
         * Set the region element based on $el parameter
         * 
         * @param {Object} options Region option, options.$el is required 
         */
        initialize: function(options){
            if(this.el instanceof jQuery && this.el.length == 1){
                this.$el = this.el;
            }
        }
    });



    var Layout = Backbone.Marionette.Layout,
        _superLayout = Layout.prototype;

    /*
     * @class
     * @module      web_unleashed
     * @name        PanelLayout
     * @classdesc   give Marionette.Layout access to all OpenERP view elements
     * @mixes       Marionette.Layout
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */
    var PanelLayout = Layout.extend({
        
        /*
         * Setup regions based on options parameters
         * 
         * @param {Object} options Layout option, pass all elements used by to build regions 
         */
        initialize: function(options){
            _superLayout.initialize.apply(this, arguments);
            
            if(options.regions){
                _(options.regions).each(function($element, name){
                    if($element instanceof jQuery && $element.length == 1){
                        this.addRegion(name, new OpenRegion({
                            el: $element
                        }));
                    }
                }, this);
            }
        }
    });

    base.views('Panel', PanelLayout);
});