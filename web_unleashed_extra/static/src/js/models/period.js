openerp.unleashed.module('web_unleashed_extra', function(base_extra, _, Backbone, base){
    
    /*
     * @class
     * @module      web_unleashed
     * @name        Period
     * @classdesc   Period of time, use momentjs
     * @mixes       Backbone.Model
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */ 
    var Period = Backbone.Model.extend({
    
        /*
         * Check if a date is in the period
         * 
         * @param {moment} date the date to check
         * @returns {Boolean}
         */
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
        
        /*
         * Get the duration of the period
         * 
         * @param {String} type unit used to calculate the duration (days,weeks,months,years)
         * @returns {Number} duration
         */
        duration: function(type){
            return this.end().diff(this.start(), type || 'days') + 1;
        },
        
        /*
         * Get/Format the period start
         * 
         * @param {String} format momentjs formatter, use "s" has format to get the default format 'YYYY-MM-DD', no parameters to get the momentjs Object
         * @return {String|moment} 
         */
        start: function(format){
            var val = this.get('start');
            return format ? val.format(format == 's' ? 'YYYY-MM-DD' : format) : val;
        },
        
        /*
         * Get/Format the period end
         * 
         * @param {String} format momentjs formatter, use "s" has format to get the default format 'YYYY-MM-DD', no parameters to get the momentjs Object
         * @return {String|moment} 
         */
        end: function(format){
            var val = this.get('end');
            return format ? val.format(format == 's' ? 'YYYY-MM-DD' : format) : val;
        },
        
        /*
         * Check if the period is valid, = has a valid start and end date
         * 
         * @returns {Boolean}
         */
        isValid: function(){
            return ( !!this.start() && this.start().isValid() ) && ( !!this.end() && this.end().isValid() );  
        },
        
        /*
         * Destroy the period by properties reset
         */
        destroy: function(){
            this.options = null;
            this.attributes = null;
        }    
    });

    base.models('Period', Period);

});