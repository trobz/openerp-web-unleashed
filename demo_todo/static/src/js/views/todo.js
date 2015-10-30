/*
 * Item View, display one Todo item,
 * see MarionnetteJS documentation for more details:
 * http://marionettejs.com/docs/v2.4.3/marionette.itemview.html
 */
odoo.unleashed.module('demo_todo',function(todo, require, _, Backbone, base){

    var ItemView = Backbone.Marionette.ItemView,
        _super = ItemView.prototype;

    var TodoView = ItemView.extend({

        template: 'DemoTodo.item',

        events: {
            'click .remove-todo': 'removeTodo'
        },

        /* Keep a reference to the collection */
        initialize: function(){
            this.collection = this.model.collection;
        },

        /**
         * when user click on delete button,
         * remove to-do model from collection
         * and refresh the view.
         **/
        removeTodo: function(e){
            e.preventDefault();
            var self = this;
            this.model.destroy().then(function() {
                // reload the collection, refresh the layout
                self.collection.load();
            })
        },

        /**
         * define data passed to the template
         */
        serializeData: function(){

            // make a call to super
            var data = _super.serializeData.apply(this, arguments);

            // change priority number into a label and a specific class name
            var priorities = [
                { label: 'high', cls: 'danger' },
                { label: 'medium', cls: 'warning' },
                { label: 'low', cls: 'success' }
            ];

            data.priority = $.isNumeric(data.priority)
                ? parseInt(data.priority)
                : data.priority;

            if(data.priority && data.priority >= 0 && priorities.length >= data.priority){
                data.priority = priorities[data.priority-1];
            }

            return data;
        }
    });

    todo.views('Todo', TodoView);
});
