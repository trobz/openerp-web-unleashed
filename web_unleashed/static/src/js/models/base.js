openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
	var _super = Backbone.Model.prototype;
	
    var BaseModel = Backbone.Model.extend({
        sync: openerp.unleashed.sync,
        
        fetch: function(){
            return _super.fetch.apply(this, [this.search()]);
        },

        specific_fetch: function (query) {
            return _super.fetch.apply(this, [query]);
        },

        search: function(){
            var filter = [];
            if(this.has('id')){
                filter.push(['id', '=', this.get('id')]);
            }
            
            return {
                filter: filter,
                type: 'first'  
            };
        }
    });

    base.models('BaseModel', BaseModel);
});