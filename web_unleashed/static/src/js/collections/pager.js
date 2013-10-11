openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var PagerController = base.utils('Pager'),
        _superPager = PagerController.prototype;
    
    var PagerCollection = PagerController.extend(_super);
    
    var Pager = PagerCollection.extend({
        model_name: null,
    
        initialize: function(data, options){
            _super.initialize.apply(this, arguments);
            _superPager.initialize.apply(this, [options]);
        },  
            
        update: function(search){
            return this.fetch(this.search());
        },
        
        count: function(search){
            return this.sync('count', this, this.search());
        },
        
        search: function(){
            return _superPager.search.apply(this, arguments);
        }
    });

    base.collections('Pager', Pager);

});