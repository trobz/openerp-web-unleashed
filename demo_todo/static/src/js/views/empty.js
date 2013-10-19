/*
 * Item View, display one Todo item,
 * see MarionnetteJS documentation for more details: https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.itemview.md
 */
openerp.unleashed.module('demo_todo',function(todo, _, Backbone, base){
 
    var View = Backbone.View,
        _super = View.prototype;

    var Empty = View.extend({
        template: 'DemoTodo.empty',
        
        render: function(){
            this.$el.html(base.render(this.template));
        }
    });

    todo.views('Empty', Empty);

});