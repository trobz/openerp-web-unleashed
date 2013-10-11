openerp.unleashed.module('web_unleashed', function(base, _, Backbone){

    var _super = Backbone.View.prototype;

    var BaseView = Backbone.View.extend({
        
        initialize: function(){
            if(this.options && this.options.ref){
                this.ref = this.options.ref;
            }
            
            this.ready = $.Deferred();
            this.ready.done($.proxy(this.start,this));
            
            this.bind();
            
            _super.initialize.apply(this, arguments);    
        },
        
        start: function(){
            
        },
        
        bind: function(){
        },
        
        unbind: function(){
        },
        
        resetElement: function(){
            this.setElement.apply(this, arguments);
            this.ready.resolveWith(this);
        },
        
        destroy: function(){
            this.unbind();
            this.undelegateEvents();
            this.$el.removeData().unbind(); 
            this.remove();  
        }
    });

    base.views('BaseView', BaseView);

});