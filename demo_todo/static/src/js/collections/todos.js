/*
 * Collection of Todo Item
 */
openerp.unleashed.module('demo_todo', function(todo, _, Backbone, base){
    
    var Todo = todo.models('Todo'),
        Pager = base.collections('Pager'),
        _super = Pager.prototype;
    
    var Todos = Pager.extend({
        // OpenERP model name, allow auto-binding by using the JSON-RPC API
        model_name: 'demo.todo',
        model: Todo,
        
        /*
         * - bind events
         */
        initialize: function(data, options){
            _super.initialize.apply(this, [options]);
            this.bind();
        },
        
        /*
         * Listen to collection events to update the pager
         */
        bind: function(){
            this.on('remove add', this.load, this);
        }
        
    });

    todo.collections('Todos', Todos);

});