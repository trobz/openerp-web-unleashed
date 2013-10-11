openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var BaseCollection = base.collections('BaseCollection');
    var Iterator = base.models('Iterator'),
        _super = BaseCollection.prototype;
    
    var Iterators = BaseCollection.extend({

        model: Iterator,
        model_name: null,
        
        initialize: function(){
            this.current_index = null;
            this.bind();
            
            _super.initialize.apply(this, arguments);
        },
        
        bind: function(){
            this.on('select', this.select, this);
        },
        
        unbind: function(){
            this.off(null, null, this);
        },
        
        select: function(model){
            var index = this.indexOf(model);
            if(index < 0){
                throw new Error('model can not be found in the collection');
            }
            this.current_index = index;
            
            var previous_selected = this.where({selected: true});
            if(previous_selected.length > 0){
                _.each(previous_selected, function(model_selected){
                    model_selected.set({selected: false});
                });
            }
            model.set({selected: true});
        },
        
        index: function(val){
            if(val != null){
                if(!this.at(val)){
                    throw new Error('no item at index ' +  val);
                }
                this.current_index = val;
            }
            if(this.current_index == null){
               throw new Error('no item have been selected yet.');
            }
            return this.current_index;
            
        },
        
        first: function(){
            return this.at(0);
        },
        
        last: function(){
            return this.length > 0 ? this.at(this.length - 1) : null;
        },
        
        current: function(){
            return this.current != null ? this.at(this.index()) : null; 
        },
        
        // return next model or the beginning if at the end
        next: function() {
            return this.at((this.index() + 1) % _.size(this));
        },
    
        // return the previous model or the end if at the beginning 
        prev: function() {
            var index = this.index() - 1;
            return this.at(index > -1 ? index : _.size(this) - 1);
        },
        
        ids: function(){
            return this.map(function(model){
                return model.get('id');
            });
        }
        
    });

    base.collections('Iterators', Iterators);

});