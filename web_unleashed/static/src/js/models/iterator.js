openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
     var BaseModel = base.models('BaseModel');
     var Iterator = BaseModel.extend({
        
        initialize: function(){
            this.set({selected: false});
        },
        
        select: function(force){
            if(!this.selected() || force){
                this.set({
                    selected: true
                });
                this.trigger('select', this);
            }
        },
        
        selected: function(){
            return this.get('selected') || false;
        }
        
    });

    base.models('Iterator', Iterator);
});