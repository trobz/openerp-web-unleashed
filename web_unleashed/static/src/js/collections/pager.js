openerp.unleashed.module('web_unleashed', function(base, _, Backbone){
    
    var BaseCollection = base.collections('BaseCollection'),
        _superCollection = BaseCollection.prototype;
    
    var PagerController = base.controllers('Pager'),
        _superPager = PagerController.prototype;
    
    
    /*
     * @class
     * @module      web_unleashed
     * @name        PagerCollection
     * @classdesc   Paginated collection, use JSON-RPC API to navigate between pages 
     * @mixes       BaseCollection, PagerController
     * 
     * @author Michel Meyer <michel[at]zazabe.com>
     */
   
    /*
     * inherit from BaseCollection and extends PagerController and BaseCollection prototypes
     */
    MixedPagerCollection = function(){
        BaseCollection.apply(this, arguments);
    };
    
    MixedPagerCollection.prototype = _.extend(
        Object.create(_superPager),
        Object.create(_superCollection)
    );
    
    MixedPagerCollection.prototype.constructor = MixedPagerCollection;
    MixedPagerCollection.extend = BaseCollection.extend;    

    var PagerCollection = MixedPagerCollection.extend({
    
        /*
         * - initialize all extended objects
         */
        initialize: function(data, options){
            _superCollection.initialize.apply(this, arguments);
            _superPager.initialize.apply(this, [options]);
            
            this.on('remove add', function(){
                this.load();
            }, this);
        },
               
       /*
        * Proxy between pager controller update method and base collection fetch
        */
        update: function(){
            return _superCollection.fetch.apply(this, arguments);
        },
       
        /*
         * Get the search query, depending of the current page
         * 
         * @see PagerController.search
         */    
        search: function(query){
            query = _superCollection.search.apply(this, [query]);
            return _superPager.search.apply(this, [query]);
        }
    });

    base.collections('Pager', PagerCollection);

});