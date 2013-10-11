openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var BaseModel = base.models('BaseModel');
    var BaseCollection = Backbone.Collection.extend({
        
        sync: openerp.unleashed.sync,
        model: BaseModel,
        
        update: function(){
            return this.fetch(this.search());
        },
        
        search: function(){
            return {};
        }
    });
    base.collections('BaseCollection', BaseCollection);
});