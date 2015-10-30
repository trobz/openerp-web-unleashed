odoo.unleashed.module('web_unleashed', function(base, require, _, Backbone){

    var PagerController = base.controllers('Pager');

    var ItemView = Backbone.Marionette.ItemView,
        _super = ItemView.prototype;

    /**
     * @class
     * @module      web_unleashed
     * @name        PagerView
     * @classdesc   Display a Pager, similar to the ODOO default pager on list
     *
     * @author Michel Meyer <michel[at]zazabe.fr>
     */
    var PagerView = ItemView.extend({

        template: 'Base.Pager',

        /**
         * @property {String}: the class used to create the main pager DOM Element
         */
        className:  'unleashed-pager',

        /**
         * @property {Object}: quick access UI components
         **/
        ui: {
            pager_text: ".oe_pager_value .status-text",
            pager_selection: ".oe_pager_value .range-selector",
            next_button: ".oe-pager-buttons .o_pager_next",
            prev_button: ".oe-pager-buttons .o_pager_previous"
        },

        /**
         * @property {Object}: events DOM listeners
         */
        events: {
            "click @ui.next_button": "next",
            "click @ui.prev_button": "previous",
            "click @ui.pager_text": "range",
            "change @ui.pager_selection": "rangeChanged"
        },

        /**
         * pager should work with either collection or model passed as options
         *
         * @param {Object} options.model: model to work with
         * @param {Object} options.collection: collection to work with
         */
        initialize: function(options){

            this.data = options.collection
                ? options.collection : ( options.model ? options.model : null);

            if(!this.data){
                throw base.error(
                    "The Pager view has to be initialized with a model or a collection."
                );
            }
        },

        /**
         * Listen to data event to render the pager,
         * when pager data is changed, should re-render pager view
         */
        onShow: function(){
            this.listenTo(
                this.data, "sync reset change", this.render, this
            );
        },

        /**
         * Serialize data to render pager view
         *
         * @returns {Object}
         */
        serializeData: function(){
            var disabled = this.data.pager.nb_pages <= 1 ? true : false;
            disabled = _.isFunction(this.data.grouped) ? this.data.grouped() : disabled;

            return {
                ranges: this.data.pager.ranges,
                current_range: this.data.pager.limit,

                firstIndex: this.data.firstIndex(),
                lastIndex: this.data.lastIndex(),
                total: this.data.pager.total,

                disabled: disabled,
                previous: this.data.hasPrevious(),
                next: this.data.hasNext(),
            };
        },

        // UI event

        /**
         * Go to previous page on the model
         */
        previous: function(){
            this.data.prev();
        },

        /**
         * Go to next page on the model
         */
        next: function(){
            this.data.next();
        },

        /**
         * Show pager limit selector
         */
        range: function(e){
            this.ui.pager_text.hide();
            this.ui.pager_selection.show();
        },

        /**
         * Change the pager limit
         */
        rangeChanged: function(e){
            this.data.changeLimit(e.currentTarget.value);
            this.data.trigger("change");
        }
    });

    base.views('Pager', PagerView);
});
