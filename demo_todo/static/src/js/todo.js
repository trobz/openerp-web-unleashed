/*
 * Module initialization, ready function is called when OpenERP framework is ready
 */

openerp.unleashed.module('demo_todo').ready(function(instance, todo, _, Backbone, base) {
    
    var _t = instance.web._t,
       _lt = instance.web._lt;

    var Marionnette = Backbone.Marionnette;
    
    // standard way to add a view in OpenERP 
    instance.web.views.add('todo', 'instance.demo_todo.TodoView');
    
    /*
     * object instanciate by OpenERP when the "todo" view is called
     * 
     * instance.web.View is a OpenERP View, used only to initialize our main Models and Views.
     * some specific method from the OpenERP view are useful (and not well documented...):
     * 
     * - view_loading: function(data): call when the template has been rendered in the main OpenERP view
     * - do_search: function(domain, context, group_by): if the OpenERP search widget is available, you can get the domain and process it with Backbone Models 
     * - destroy: used to remove all instances, listener and DOM element, with Marionnette, you just have to close the region :)
     * 
     */
    instance.demo_todo.TodoView = instance.web.View.extend({
        
        
        template: "DemoTodo",
        
        // select an OpenERP view type, required but has no effect because web unleashed is abstracted from all 
        // the OpenERP web architecture... 
        view_type: 'tree',
        
        start: function(){
            var TodosCollection = todo.collections('Todos'),
                TodosView = todo.views('Todos');

            // instanciation of main MVC components
            
            this.collection = new TodosCollection();
            
            this.view = new TodosView({
                collection: this.collection
            });
            
            this.region = new Marionette.Region({
                el: '.todo-list'
            });
            
            return this._super();
        },
        
        view_loading: function(data){
            
            // when the TodoView has been rendered, inject the view in the region
            this.region.show(this.view);
            
            // only fetch the collection after the view rendering, 
            // to avoid issue when model are injected  as item view in a not rendered component view
            this.collection.fetch();
            
            return this._super(data);
        },
        
        do_search: function(domain, context){
            // apply the search from the OpenERP search widget
            this.collection.fetch({
                filter: domain,
                context: context
            });
        },
        
        destroy: function() {
            // region.close() will automatically remove all DOM elements and unbind all event listeners
            // avoiding memory leaks
            if(this.region){
                this.region.close();
            }
            this._super();
        }
   });
    
});