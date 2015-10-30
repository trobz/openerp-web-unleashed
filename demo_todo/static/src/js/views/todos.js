/*
 * Component View, display the Todo list,
 * see MarionnetteJS documentation for more details:
 * http://marionettejs.com/docs/v2.4.3/marionette.compositeview.html
 */
odoo.unleashed.module('demo_todo',function(todo, require, _, Backbone, base){

    var TodoModel = todo.models('Todo');

    var EmptyTodoView = todo.views('Empty'),
        TodoView = todo.views('Todo');

    var CompositeView = Backbone.Marionette.CompositeView,
        _super = CompositeView.prototype;

    var TodosView = CompositeView.extend({

        type: "list",

        className: "list",

        template: "DemoTodo.list", // template will be used to render this view

        childViewContainer: ".todos", // where to inject all children view

        childView: TodoView, // class represent each child view

        emptyView: EmptyTodoView, // class represent empty view

        ui: {
            modal: "#todoModal",
            btn_modal: ".add-todo",
            todo_form: ".todo-form",
            button_save_todo: ".save-todo"
        },

        events: {
            "click @ui.btn_modal": "openModalForm",
            "click @ui.button_save_todo": "addTodo",
            "submit @ui.todo_form": "addTodo"
        },

        collectionEvents: {
            "sync change remove": "render"
        },

        initialize: function(options){
            $(document).bind(
                "keypress.todo", _.bind(this.openModalForm, this)
            );
        },

        /**
         * when this view is destroy, remove event listener
         **/
        onDestroy: function(){
            $(document).unbind("keypress.todo");
        },

        /**
         * focus on the name field when the modal is shown
         */
        onRender: function(){
            var $name = this.ui.todo_form.find("#name").focus();
            this.ui.modal.on("shown.bs.modal", function(){
                $name.get(0).focus();
            });
        },

        /**
         * open the modal form at "+" key down
         */
        openModalForm: function(e){
            if(e.type == "click" || e.keyCode == 43 /* + */){
                this.ui.modal.modal("show");
            }
        },

        /**
         * save todo event listener
         */
        addTodo: function(e){

            e.preventDefault();

            var self = this;

            var $btn = this.ui.button_save_todo.find("span"),
                $form = this.ui.todo_form;

            var data = $form.serializeObject(),
                todo = new TodoModel(data);

            $btn.empty().attr("class", "icon-refresh icon-spin");

            // create the Todo item
            var promise = todo.save(), view = this;

            // handle success/error from the Todo save deferrer
            promise
                .done(function(){
                    view.alert("Todo item saved successfully", "success");
                    // reload the collection -> list view refreshed
                    view.collection.load();
                })
                .fail(function(){
                    view.alert("Failed to save the todo item", "danger");
                })
                .always(function(){
                    self.ui.modal.modal("hide");
                    $btn.text("Save").attr("class", "");
                    $form.reset();
                });
        },

        /**
         * display an alert message in the Todo List view
         * @param {String} message to display
         * @param {String} type of message: success|warning|danger
         */
        alert: function(message, type){
            var $alert = $('<div>')
                .attr('class', 'alert alert-' + type).text(message);

            this.$el.append($alert);

            _.delay(function(){
                $alert.fadeOut(500, function(){
                    $alert.remove();
                });
            }, 2000);
        }
    });

    todo.views('Todos', TodosView);
});
