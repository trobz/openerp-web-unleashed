/**
 * Created with PyCharm.
 * User: chanhle
 * Date: 8/5/13
 * Time: 2:38 PM
 * To change this template use File | Settings | File Templates.
 */
openerp.unleashed.module('web_unleashed', function (base, _, Backbone) {

    var BaseModel = base.models('BaseModel'),
        BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;

    var DocumentPages = BaseCollection.extend({

        model: BaseModel,
        model_name: 'document.page',

        initialize: function (models, options) {
            this.ready = $.Deferred();
            _super.initialize.apply(this, arguments);
        },

        update: function () {
            var self = this;
            return this.fetch(this.search())
                .done(function () {
                    self.ready.resolve();
                });
        },

        search: function(){
            var search = {
                fields: [ 'name', 'model_id', 'model_name'],
                filter: [ ['model_id', '!=', false]]
            };
            return search;
        },


        bind: function () {
        },

        unbind: function () {
        }

    });

    base.collections('DocumentPages', DocumentPages);

});