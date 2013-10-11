openerp.unleashed.module('web_unleashed', function(base, _, Backbone){


    var PagerController = base.utils('Pager');
    
    var Renderer = Marionette.Renderer,
        BaseView = base.views('BaseView'),
        _super = BaseView.prototype;

    var Pager = BaseView.extend({
        
        className:  'unleashed-pager',
        
        events: {
            'click .prev-page': 'previous',
            'click .next-page': 'next',
            'click .range-page': 'range',
            'change .range-selector': 'rangeChanged'
        },
        
        initialize: function(options){
            options = options || {};
            // use collection or model for the pagination
            if(options.collection && options.collection instanceof PagerController){
                this.data = options.collection;
                this.listener = 'sync';
            }
            else if(options.model && options.model instanceof PagerController){
                this.data = options.model;
                this.listener = 'change';
            }
            else {
                throw new Error('you have to pass an model or a collection to the pager view, and this object has to inherit from a Pager Controller')
            }
            _super.initialize.apply(this, arguments);    
        },
        
        // render
        
        bind: function(){
            this.data.on(this.listener, this.render, this);
        },
        
        unbind: function(){
            this.data.off(null, null, this);
        },
        
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

        previous: function(){
            this.data.prev();
        },
        
        next: function(){
            this.data.next();
        },
        
        range: function(e){
            var $range = $(e.currentTarget), collection = this.data;
            $range.html(Renderer.render('UnleashedBase.Pager.range', {
                ranges: this.data.pager.ranges,
                current_range: this.data.pager.limit
            }));
        },
        
        rangeChanged: function(e){
            var $selector = $(e.currentTarget);
            this.data.changeLimit($selector.val());
        }
    });

    base.views('Pager', Pager);

});
