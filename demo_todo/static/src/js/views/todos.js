/*
 * Component View, display the Todo list,
 * see MarionnetteJS documentation for more details: https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.conpositeview.md
 */

openerp.unleashed.module('demo_todo',function(todo, _, Backbone, base){
 
    // get the Todo Model constructor, used to save new Toto item
    var TodoModel = todo.models('Todo');
 
    var Todo = todo.views('Todo'),
        View = Backbone.Marionette.CompositeView,
        _super = View.prototype;

    var Todos = View.extend({
        
        type: 'list',
        className: 'list',
        
        template: 'DemoTodo.list',
        
        itemViewContainer: '.todos',
        
        itemView: Todo,
   
        events: {
            'click .save-todo': 'addTodo'
        },
        
        /*
         * save todo event listener
         */
        addTodo: function(e){
            e.preventDefault();
            var $el = $(e.currentTarget),
                $btn = $el.find('span'),
                $form = $el.parent().prev().find('form');
                
                
            var data = $form.serializeObject(),
                todo = new TodoModel(data);    
        
            $btn.empty().attr('class', 'icon-refresh icon-spin');

            // create the Todo item            
            var promise = todo.save(),
                view = this;    
            
            // handle success/error from the Todo save deferrer  
            promise
                .done(function(){
                    view.alert('Todo item saved successfully', 'success');  
                    // reload the collection -> list view refreshed
                    view.collection.fetch();
                })
                .fail(function(){
                    view.alert('Failed to save the todo item', 'danger');    
                })
                .always(function(){
                    $('#todoModal').modal('hide');
                    $btn.text('Save').attr('class', '');
                    $form.reset();
                });
        },
        
        /*
         * display an alert message in the Todo List view
         * @param {String} message to display
         * @param {String} type of message: success|warning|danger
         */
        alert: function(message, type){
            var $alert = $('<div>').attr('class', 'alert alert-' + type).text(message);
            this.$el.append($alert);        
            
            _.delay(function(){
                $alert.fadeOut(500, function(){
                    $alert.remove();
                });
            }, 2000);
                    
        }
    });

    todo.views('Todos', Todos);

});