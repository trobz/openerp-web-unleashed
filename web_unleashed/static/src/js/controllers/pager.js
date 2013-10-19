openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var Controller = Marionette.Controller,
        _super = Controller.prototype;
    
    /*
     * @class
     * @module      web_unleashed
     * @name        PagerController
     * @classdesc   Abtracted Pager Controller, usable by any object able to implement the count and update methods
     * @mixes       Marionette.Controller
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */
    var PagerController = Controller.extend({
        
        /*
         * Initialize the pagination
         * 
         * @param {Object} options used to define the pager behavior
         * @default 
         * {
         *     ranges: [10, 50, 100, 200, 'All'], // range available, used only by the default pager view
         *     page: 0, // current page (first page is 0)
         *     limit: 100, // number of item by page
         *     total: 0, // count of all pages, automatically updated at init call
         *     nb_pages: 0, // number of pages, automatically updated at init call
         * }
         * 
         * be careful to call it from the parent if the object that extend this 
         * controller take other parameters at initialization...
         */
        initialize: function(options){
            this.pager = _.extend({
                ranges: [10, 50, 100, 200, base._lt('All')],
                page: 0,
                limit: 100,
                total: 0,
                nb_pages: 0,
            }, options);
        },  
        
        /*
         * This method is called when items have to be refreshed, return a deferrer
         * 
         * @abstract
         * @param {Object} query a search query
         * @returns {jQuery.Deferred.promise}
         */
        update: function(query){
            throw new Error('abstract object, you should implement here the way to get paginated data')
        },
        
        /*
         * This method has to return a deferrer with the count of element in parameter
         * 
         * @abstract
         * @param {Object} query a search query
         * @returns {jQuery.Deferred.promise}
         */
        count: function(query){
            throw new Error('abstract object, you should implement here the way to get count data')
        },
        
        /*
         * Internal update method, should never be called directly (use abstract method)
         *
         * @private 
         * @param {Object} query a search query
         * @returns {jQuery.Deferred.promise}
         */
        _update: function(query){
            return this.update(this.search(query));
        },
        
        /*
         * Internal count method, should never be called directly (use abstract method)
         *
         * @private 
         * @param {Object} query a search query
         * @returns {jQuery.Deferred.promise}
         */
        _count: function(query){
            return this.count(this.search(query));
        },
        
        /*
         * Initialize the pager by counting the nb of element to paginate
         * Note: after promise resolving, the pagination is still not populated with elements
         *
         * @param {Object} query search query  
         * @fires ready
         * @returns {jQuery.Deferred.promise}
         */
        init: function(query){
            query = query || {};
             
            var def = new $.Deferred();
                
            this._count(query).done(_.bind(function(nb_models){
                this.changeCount(nb_models).refresh().trigger('ready');
                def.resolveWith(this);
            }, this));
            
            return def.promise();
        },
        
        /*
         * Init and load the current page
         *
         * @param {Object} query search query  
         * @returns {jQuery.Deferred.promise}
         */
        load: function(query){
            var def = $.Deferred();
            
            this.init(_.clone(query)).done(function(){
               this._update(_.clone(query)).done(function(){
                   def.resolve();
               }); 
            });
            
            return def.promise();
        },
        
        /*
         * Refresh pager parameters, based on the current count and limit
         * 
         * @returns {PagerController}
         */
        refresh: function(){
            this.pager.nb_pages = Math.ceil(this.pager.total / this.pager.limit);
            
            if(this.pager.page >= this.pager.nb_pages){
                this.pager.page = this.pager.nb_pages - 1 >= 0 ? this.pager.nb_pages - 1 : 0;
            }
                
            return this;
        },
        
        /*
         * Reset the number of element to paginate
         * 
         * @param {Number} nb_models element count to paginate 
         * @returns {PagerController}
         */
        changeCount: function(nb_models){
            this.pager.total = nb_models;
            this.trigger('change change:count', this, this.pager);    
            return this;
        },
        
        /*
         * Change the current limit and update the pager
         * 
         * @param {Number} limit number of element by page
         * @param {Object} options {silent: true/false}, if silent option, no pager update automatically done 
         * @fires change, change:limit
         * @returns {jQuery.Deferred.promise}
         */
        changeLimit: function(limit, options){
            options = options || {};
            var promise;
            
            if($.isNumeric(limit)){
                limit = parseInt(limit);
            }
            else {
                limit = this.pager.total;
            }
            this.pager.page = 0;
            this.pager.limit = limit;
            
            this.trigger('change change:limit', this, this.pager);    
                
            this.refresh();
            
            if(options.silent){
                promise = $.when();
            }
            else {
                promise = this._update();
            }
            
            return promise;
        },
        
        /*
         * Get the number of pages
         * 
         * @returns {Number} nb_pages
         */
        nbPages: function(){
            return this.pager.nb_pages; 
        },
        
        /*
         * Check if the pager has a previous page
         * @returns {Boolean}
         */
        hasPrevious: function(){
            return this.refresh().pager.page > 0;
        },
        
        /*
         * Check if the pager has a next page
         * 
         * @returns {Boolean}
         */
        hasNext: function(){
            return this.refresh().pager.page + 1 < this.nbPages();
        },
        
        /*
         * Load the last page
         * 
         * @fires change, change:last
         * @returns {jQuery.Deferred.promise}
         */
        last: function(){
            var def = null;
            if(this.pager.page  != this.pager.nb_pages - 1){
                this.pager.page = this.pager.nb_pages - 1;
                this.trigger('change change:last', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        /*
         * Load the first page
         * 
         * @fires change, change:first
         * @returns {jQuery.Deferred.promise}
         */
        first: function(){
            var def = null;
            if(this.pager.page != 0){
                this.pager.page = 0;
                this.trigger('change change:first', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        /*
         * Load the previous page
         * 
         * @fires change, change:previous
         * @returns {jQuery.Deferred.promise}
         */
        prev: function(){
            var def = null;
            if(this.hasPrevious()){
                this.pager.page -= 1;
                this.trigger('change change:previous', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        /*
         * Load the next page
         * 
         * @fires change, change:next
         * @returns {jQuery.Deferred.promise}
         */
        next: function(){
            var def = null;
            if(this.hasNext()){
                this.pager.page += 1;    
                this.trigger('change change:next', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        /*
         * Define the search query according to the current page
         * 
         * @returns {Object} 
         */
        search: function(query){
            return _.extend(query || {}, {
                reset: true,
                limit: this.pager.limit,
                offset: this.pager.page * this.pager.limit
            });
        },
        
        
        /*
         * Get a textual representation of the pager state
         * 
         * @returns {String} 
         */
        info: function(){
            
            var pager = this.pager,
                nb_before = pager.page * pager.limit,
                nb_next = pager.total - nb_before,
                limit = nb_next < pager.limit ? nb_before + nb_next : nb_before + pager.limit; 
            
            return (nb_before + 1) + ' - ' + limit + ' / ' + pager.total;
        }

    });

    base.controllers('Pager', PagerController);

});