/*
 * Module initialization, ready function is called when OpenERP framework is ready
 */
odoo.unleashed.module('demo_todo', function(todo, require, _, Backbone, base) {

    // make a reference to view registry
    var core = require('web.core');
    var UnleashedView = base.views('Unleashed');

    /**
     * object instantiated by OpenERP when the "todo" view is called
     */
    var TodoView = UnleashedView.extend({

        template: "DemoTodo",
        view_type: "todo",
        display_name: "Todo",
        icon: "fa fa-tasks",
        accesskey: "T",

        State: todo.models('State'),

        /**
         * link collection to state for state management
         **/
        stateConfig: function(){
            this.state.link({
                collection: this.collection
            });
        },

        /**
         * executed when the View is started
         */
        start: function(){

            var PagerView = base.views('Pager'),
                TodosView = todo.views('Todos'),
                TodosCollection = todo.collections('Todos');

            // create MVC components
            this.collection = new TodosCollection();
            this.view = new TodosView({
                collection: this.collection
            });
            this.pager = new PagerView({
                collection: this.collection
            });

            return this._super();
        },

        /**
         * apply search from OpenERP search widget
         **/
        do_search: function(domain, context, groupby){

            var self = this;

            var loaded = this.collection.load({
                filter: domain, context: context, persistent: true
            });

            loaded.then(function(){

                // show the main view & pager view
                self.panel.body.show(self.view);
                self.panel.pager.show(self.pager);

                // update application state
                self.state.trigger("change");
            });
        }
    });

     // standard way to add a view in Odoo
    core.view_registry.add('todo', TodoView);
});
