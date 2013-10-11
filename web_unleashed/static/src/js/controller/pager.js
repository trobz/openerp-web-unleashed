openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var Controller = Marionette.Controller,
        _super = Controller.prototype;
    
    var Pager = Controller.extend({
        
        /*
         * be careful to call it from the parent if the object that extend this 
         * controller take other parameters at initialization...
         */
        initialize: function(options){
            this.pager = _.extend({
                ranges: [10, 50, 100, 200, base.web()._t('All')],
                page: 0,
                limit: 100,
                total: 0,
                nb_pages: 0,
                first_index: 0,
                last_index: 0,
            }, options);
        },  
        
        /*
         * this method is called when items have to be refreshed, return a deferrer
         */
        update: function(search){
            throw new Error('abstract object, you should implement here the way to get paginated data')
        },
        
        /*
         * this method has to return a deferrer with the count of element in parameter
         */
        count: function(search){
            throw new Error('abstract object, you should implement here the way to get count data')
        },
        
        /*
         * internal count and update method
         */
        
        _update: function(){
            return this.update(this.search());
        },
        
        _count: function(options){
            var search = this.search();
            delete search.reset;
            delete search.limit;
            delete search.offset;
            
            return this.count(_.extend(options || {}, search));
        },
        
        /*
         * pager code...
         */
        
        init: function(options){
            var self = this, def = new $.Deferred();
                
            this._count(options).done(function(nb_models){
                self.changeCount(nb_models);
                self.trigger('ready');
                def.resolveWith(self);
            });
            
            return def.promise();
        },
        
        load: function(options){
            var def = $.Deferred();
            
            this.init(options).done(function(){
               this._update(options).done(function(){
                   def.resolve();
               }); 
            });
            
            return def.promise();
        },
        
        refresh: function(){
            this.pager.page = 0;
            this.pager.nb_pages = Math.ceil(this.pager.total / this.pager.limit);
            return this;
        },
        
        changeCount: function(nb_models){
            this.pager.total = nb_models;
            this.refresh();
            this.trigger('change change:count', this, this.pager);    
        },
        
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
        
        nbPages: function(){
            return this.pager.nb_pages; 
        },
        
        hasPrevious: function(){
            return this.pager.page > 0;
        },
        
        hasNext: function(){
            return this.pager.page + 1 < this.nbPages();
        },
        
        last: function(){
            var def = null;
            if(this.pager.page  != this.pager.nb_pages - 1){
                this.pager.page = this.pager.nb_pages - 1;
                this.trigger('change change:last', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        first: function(){
            var def = null;
            if(this.pager.page != 0){
                this.pager.page = 0;
                this.trigger('change change:first', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        prev: function(){
            var def = null;
            if(this.hasPrevious()){
                this.pager.page -= 1;
                this.trigger('change change:previous', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        next: function(){
            var def = null;
            if(this.hasNext()){
                this.pager.page += 1;    
                this.trigger('change change:next', this, this.pager);    
                def = this._update();
            }
            return $.when(def); 
        },
        
        
        search: function(){
            return {
                reset: true,
                limit: this.pager.limit,
                offset: this.pager.page * this.pager.limit
            };
        },
        
        
        info: function(){
            
            var pager = this.pager,
                nb_before = pager.page * pager.limit,
                nb_next = pager.total - nb_before,
                limit = nb_next < pager.limit ? nb_before + nb_next : nb_before + pager.limit; 
            
            return (nb_before + 1) + ' - ' + limit + ' / ' + pager.total;
        }

    });

    base.utils('Pager', Pager);

});