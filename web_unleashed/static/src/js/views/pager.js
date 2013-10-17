openerp.unleashed.module('web_unleashed', function(base, _, Backbone){


    var PagerController = base.controllers('Pager');
    
    var Renderer = Backbone.Marionette.Renderer,
        BaseView = base.views('BaseView'),
        _super = BaseView.prototype;


    /*
     * @class
     * @module      web_unleashed
     * @name        PagerView
     * @classdesc   Display a Pager, similar than the OpenERP default pager on list
     * @mixes       BaseView
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */    
    var PagerView = BaseView.extend({
        
        /*
         * @property {String} className the class used to create the main pager DOM Element
         */
        className:  'unleashed-pager',
        
        
        /*
         * @property {Object} events DOM listeners
         */
        events: {
            'click .prev-page': 'previous',
            'click .next-page': 'next',
            'click .range-page': 'range',
            'change .range-selector': 'rangeChanged'
        },
        
        /*
         * Set the model to work on
         * 
         * @param {Object} options pass the model to work on
         */
        initialize: function(options){
            // TODO: check because extending views are using options.model instead of options.collection (see dashboard/widgets/pager), 
            // should not be done because of a specific pager view... 
            this.data = this.data ? this.data : options.collection;
            _super.initialize.apply(this, arguments);    
        },
        
        /*
         * Bind model event to update the pager view
         */
        bind: function(){
            this.data.on('sync', this.render, this);
        },
        
        /*
         * Unbind model listener
         */
        unbind: function(){
            this.data.off(null, null, this);
        },
        
        /*
         * Render the view, hide the pager navigation if there's only one page
         */
        render: function(){
            return this.$el.html(Renderer.render('UnleashedBase.Pager', {
                ranges: this.data.pager.ranges,
                info: this.data.info(),
                current_range: this.data.pager.limit
            }));    
    
            if(this.data.pager.nb_pages <= 1){
                this.$el.find('.oe_pager_group').hide();    
            }
        },
        
        // UI event

        /*
         * Go to previous page on the model
         */
        previous: function(){
            this.data.prev();
        },
        
        /*
         * Go to next page on the model
         */
        next: function(){
            this.data.next();
        },
        
        /*
         * Render the pager limit selector
         */
        range: function(e){
            var $range = $(e.currentTarget), collection = this.data;
            $range.html(Renderer.render('UnleashedBase.Pager.range', {
                ranges: this.data.pager.ranges,
                current_range: this.data.pager.limit
            }));
        },
        
        /*
         * Change the pager limit
         */
        rangeChanged: function(e){
            var $selector = $(e.currentTarget);
            this.data.changeLimit($selector.val());
        }
    });

    base.views('Pager', PagerView);
});
