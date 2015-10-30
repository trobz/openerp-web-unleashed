/*
 * Item Empty View, view will be displayed
 * when there is no todo left
 */
odoo.unleashed.module("demo_todo", function(todo, require, _, Backbone, base){

    var View = Backbone.View,
        _super = View.prototype;

    var Empty = View.extend({

        template: "DemoTodo.empty",

        render: function(){
            this.$el.html(base.render(this.template));
        }
    });

    todo.views("Empty", Empty);
});
