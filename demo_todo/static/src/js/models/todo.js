/*
 * Model for a Todo Item
 */
openerp.unleashed.module('demo_todo', function(todo, _, Backbone, base){
    
    var BaseModel = base.models('BaseModel'),
        _super = BaseModel.prototype;
    
    var Todo = BaseModel.extend({
        // OpenERP model name, allow auto-binding by using the JSON-RPC API
        model_name: 'demo.todo'
    });

    todo.models('Todo', Todo);

});