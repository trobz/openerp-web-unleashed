/*
 * Model for a Todo Item
 */
odoo.unleashed.module('demo_todo', function(todo, require, _, Backbone, base){
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Todo = BaseModel.extend({
        // OpenERP model name, allow auto-binding with JSON-RPC API
        model_name: 'demo.todo'
    });

    todo.models('Todo', Todo);
});
