/*
 * Module initialization, ready function is called when OpenERP framework is ready
 */
openerp.unleashed.module('demo_todo').ready(function(instance, todo, _, Backbone, base) {

    var UnleashedView = base.views('Unleashed');

    // standard way to add a view in OpenERP 
    instance.web.views.add('todo', 'instance.demo_todo.TodoView');
    
    /*
     * object instanciated by OpenERP when the "todo" view is called
     */
    instance.demo_todo.TodoView = UnleashedView.extend({
        
        template: "DemoTodo",
        view_type: 'todo',
    
        State: todo.models('State'),    
        
        stateConfig: function(){
            this.state.link({
                collection: this.collection
            });
        },
        
        /*
         * executed when the View is started
         */
        start: function(){
            var Pager = base.views('Pager'),
                TodosCollection = todo.collections('Todos'),
                TodosView = todo.views('Todos');

            // instanciation of main MVC components
            this.collection = new TodosCollection();
            this.view = new TodosView({
                collection: this.collection
            });
            this.pager = new Pager({
                collection: this.collection
            });
            
            return this._super();
        },
        
        /*
         * executed when the View is rendered
         */
        ready: function(data){
            
            //hide and wait the first collection loading
            this.pager.$el.hide();
            this.view.$el.hide();
            
            // inject views in regions
            this.panel.pager.show(this.pager);
            this.panel.body.show(this.view);
            
        },
        
        do_search: function(domain, context){
            // apply the search from the OpenERP search widget
            this.collection.load({
                filter: domain,
                context: context,
                persistent: true
            })
            .done(_.bind(function(){
                //collection loaded, at least for the first time, time to show or views !
                this.pager.$el.show();
                this.view.$el.show();
            }, this));
        } 
    });
});
