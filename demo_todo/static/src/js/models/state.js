openerp.unleashed.module('demo_todo', function(todo, _, Backbone, base){
    
    var State = base.models('State'),
        _super = State.prototype;
    
    /*
     * @class
     * @module      demo_todo
     * @name        State
     * @classdesc   manage the state of a view, useful to keep the state persistent by using URL parameters
     * @mixes       Base.State
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */
    var TodoState = State.extend({
        
        defaults: {
            action: null,
            menu_id: null,
            model: null,
            view_type: null,
            limit: 5,
            page: 0
        },
        
        
        link: function(options){
            this.collection = options.collection;
            this.bind();
        },
        
        bind: function(){
            this.collection.on('change', this.pagerChanged, this);
        },
        
        pagerChanged: function(){
            this.set({
                limit: this.collection.pager.limit,
                page: this.collection.pager.page 
            });
        },
        
        configPager: function(){
            this.collection.pager.limit = this.get('limit');
            this.collection.pager.page = this.get('page');
        },
        
        unbind: function(){
            this.collection.off(null, null, this);
        },
        
        process: function(){
            //this.set($.bbq.getState());
            //this.push();
            return $.when(this.configPager());
        }
    });

    todo.models('State', TodoState);
});