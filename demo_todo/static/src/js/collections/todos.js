/*
 * Collection of Todo Item
 */
openerp.unleashed.module('demo_todo', function(todo, _, Backbone, base){
    
    var Todo = todo.models('Todo'),
        BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var Todos = BaseCollection.extend({
        // OpenERP model name, allow auto-binding by using the JSON-RPC API
        model_name: 'demo.todo',
        model: Todo
    });

    todo.collections('Todos', Todos);

});