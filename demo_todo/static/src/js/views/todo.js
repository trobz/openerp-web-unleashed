/*
 * Item View, display one Todo item,
 * see MarionnetteJS documentation for more details: https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md
 */
openerp.unleashed.module('demo_todo',function(todo, _, Backbone, base){
 
    var View = Backbone.Marionette.ItemView,
        _super = View.prototype;

    var Todo = View.extend({
        
        template: 'DemoTodo.item',
        
        events: {
            'click .remove-todo': 'removeTodo'
        },
        
        /*
         * Keep a reference to the collection
         */
        initialize: function(){
            this.collection = this.model.collection;
        },
        
        removeTodo: function(e){
            e.preventDefault();
            
            this.model.destroy({ silent: true }).done(_.bind(function(){
                //reload the collection : refresh the layout
                this.collection.load();
            }, this));
        },
        
        /*
         * define data passed to the template
         */
        serializeData: function(){
            var data = this.model.toJSON();
            
            // change priority number into a label and a specific class name
            var priorities = [
                { label: 'high', cls: 'danger' }, 
                { label: 'medium', cls: 'warning' }, 
                { label: 'low', cls: 'success' }
            ];
            
            data.priority = $.isNumeric(data.priority) ? parseInt(data.priority) : data.priority;
            if(data.priority && data.priority >= 0 && priorities.length >= data.priority){
                data.priority = priorities[data.priority-1];
            }
            
            return data;
        }
    });

    todo.views('Todo', Todo);

});