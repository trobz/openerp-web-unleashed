openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var Period = Backbone.Model.extend({
    
        has: function(date){
            if(!date.isValid()){
                throw new Error('compare a no moment object with the period');
            }
            
            var period_start = this.get('start'),
                period_end = this.get('end'),
                period_diff = Math.round(period_end.diff(period_start, 'days', true)),
                start_diff = Math.round(date.diff(period_start,'days', true)),
                end_diff = Math.round(date.diff(period_end, 'days', true));
         
            return start_diff <= period_diff && start_diff >= 0 && end_diff <= 0;
        },
        
        duration: function(type){
            return this.end().diff(this.start(), type || 'days') + 1;
        },
        
        start: function(format){
            var val = this.get('start');
            return format ? val.format(format == 's' ? 'YYYY-MM-DD' : format) : val;
        },
        
        end: function(format){
            var val = this.get('end');
            return format ? val.format(format == 's' ? 'YYYY-MM-DD' : format) : val;
        },
        
        isValid: function(){
            return ( !!this.start() && this.start().isValid() ) && ( !!this.end() && this.end().isValid() );  
        },
        
        destroy: function(){
            this.options = null;
            this.attributes = null;
        }    
    });

    base.models('Period', Period);

});