/*
 * Collection of Todo Item
 */
odoo.unleashed.module('demo_todo', function(todo, require, _, Backbone, base){

    var Todo = todo.models('Todo');

    var PagerCollection = base.collections('Pager'),
        _super = PagerCollection.prototype;

    var Todos = PagerCollection.extend({

        // Odoo model name, allow auto-binding with JSON-RPC API
        model_name: 'demo.todo',

        model: Todo,
    });

    todo.collections('Todos', Todos);
});
