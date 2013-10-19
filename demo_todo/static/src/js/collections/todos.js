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
        model: Todo
    });

    todo.collections('Todos', Todos);

});