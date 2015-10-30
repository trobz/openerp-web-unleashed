[![Build Status](https://travis-ci.org/trobz/openerp-web-unleashed.png?branch=master)](https://travis-ci.org/trobz/openerp-web-unleashed)

With Odoo version prior to version 9, the web part of OpenERP is really not easy, the documentation is minimalist and the architecture is hard to understand.

Although Odoo keep improving overtime with code re-organization and documentation on their website but it does not seem enough. 

This is a pure web module with one objective: providing good bases to build rich web application in Odoo.


## Features

- clear MVC pattern, based on Backbone and Marionnette... with all their documentations ! 
- new namespace to organize and get access to your objects
- full-featured Backbone Models with Odoo JSON-RPC API support
- QWeb rendering for Marionette views
- base objects to build custom views (Pager, Grouped Collection, Extended Odoo View, State manager...)
- unit tests for basic functionalities
- load/configuration commonly used libraries (momentjs, numeraljs, awesome-font,...) 


## Example

Checkout the [demo_todo module](https://github.com/trobz/openerp-web-unleashed/tree/master/demo_todo), it's a full featured example with comments. 

### Features

- module initialization
- Backbone data access with JSON-RPC API
- layout definition based on Marionette
- native Odoo search widget support
- pagination support
- custom 'todo' view type

# Architecture

## Files organization

A good architecture start with a good file organization. A common practice is to separate each object in one file and organize objects in logical folder.

A module build with Web Unleashed will look like:

```
- static
  - lib/               // all external lib dependencies
  - src/
    - js/
      - models/
      - collections/
      - views/
      - utils/         // any useful lib
      - my_module.js   // the web module entry point
    - templates/       // QWeb templates
    - tests/           // jsunit tests
    - images/
    - css/
    - ...
```

Note:
- This is a basic organization, ``js`` sub-folder can have specific folders to organize your module code logically.

## Unleashed namespace

`odoo.unleashed`

This namespace is a Marionette Application, each Odoo web module that uses 
Unleashed are sub-modules of this Application.

A module object has few helpers to set/get object in his namespace:
```js
// basic getter/setter
odoo.unleashed.module('my_module').set(namespace, name, object)
odoo.unleashed.module('my_module').get(namespace, name)

// helpers
odoo.unleashed.module('my_module').routers(router_name, object)
odoo.unleashed.module('my_module').controllers(controller_name, object)
odoo.unleashed.module('my_module').views(view_name, object)
odoo.unleashed.module('my_module').collections(collection_name, object)
odoo.unleashed.module('my_module').models(model_name, object)
odoo.unleashed.module('my_module').behaviors(behavior_name, object)
odoo.unleashed.module('my_module').utils(name, object)
```

Notes: 

- You never have to call the full namespace path, the module object is always passed to your module scope when you have declare a new object, see [object declaration](#object-declaration) for details 
- With Odoo version 9, the module name doesn't have to be the technical name of your Odoo module but it's best to keep the convention as prior versions.

### Module initialization

In Odoo web, to create a new module file, normally you need to do somethings as bellow:

```js
odoo.define("my_module", function(require){
    //odoo is ready to do stuff for your module !
});
```

### Object declaration

To be able to split object in different files, and keep the code organization in the global scope,  you have to use the module scope.

In this scope, you have access to the module object, the base module object,  the latest Underscore (from Odoo) and Backbone version.

Notes:

- Backbone is already included in Odoo, but they are using **old** version. Unleashed includes the latest version of this library in noConflict mode.
- Unleashed also includes latest version of Marionette which is a Backbone extension helps to build application with robust views and architecture solutions, and can be accessed via `Backbone.Marionette`,

**create a new object**

```js
odoo.unleashed.module('my_module', function(my_module, require, _, Backbone, base){
    var _super = Backbone.View.prototype;

    // create your own view with Backbone
    var GreatView = Backbone.View.extend({
        initialize: function(){
        }
    });

    // cache the view on module namespace for later use
    my_module.views('GreatView', GreatView);
});
```

In this example, a new view extend the basic Backbone View and is added to ```my_module``` namespace with the name "GreatView".

Now you have access to this object from anywhere by simply using the name you used to declare it:

```js
    ...
    // call the same method without 2nd parameter 
    // to get what has been cached before
    var GreatView = my_module.views('GreatView'),
        view = new GreatView();
    ...
```

## Base module

Unleashed provide some useful Backbone extension:

### JSON-RPC API Model support

By using the ```BaseModel``` and ```BaseCollection``` from the base module, the JSON-RPC API is automatically implemented.

**create a new "JSON-RPC API ready" collection**

```js
odoo.unleashed.module('my_module', function(my_module, require, _, Backbone, base){
    
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var Employees = BaseCollection.extend({
        model_name: 'hr.employee',
        // your classic backbone code here !
    });

    // cache the collection
    my_module.collections('Employees', Employees);
});
```

Now, you are ready to use this model, somewhere else, you can do:

```js
odoo.unleashed.module('my_module', function(my_module, require, _, Backbone, base){
    // get the collection you has cached
    var Employees = my_module.collections('Employees'),
        employees = new Employees();

    employees.fetch({
        filter: [['name', 'like', 'toto']]
    });
    
    employees.done(function(){
        //employees.length = nb employee in db with like '%toto%'
    });
});
```

- ```employees``` is a Backbone Collection, populated with Backbone Model, with all what it imply !
- you can pass to ```fetch``` method all JSON-RPC API js client options:      
`filter`, `order`, `limit`, `offset`, `context`, `fields`
 

### Collection with `group_by` lazy loading support

When you fetch your collection with a `group_by` option, the collection is populated 
with special `GroupQuery` models.

These special Models are able to get the result of each groups, allowing to list the group first 
in the interface and lazy load each of them after an action.

To get the result of each of them, you simply have to call `fetch` on them, the `GroupQuery` 
will make an instance of the Collection his coming from and populate it with the groupment result.


Notes:
- if a grouped collection is fetched without a `group_by` query later, 
the collection will be populated with "normal" model again.
- the Pager collection support `group_by` queries too, the pagination 
is simply disabled during grouping queries.

**example**

```js
var BaseCollection = base.collections('BaseCollection'),
    BaseModel = base.models('BaseModel'),
    GroupQuery = base.models('GroupQuery');

var CustomGroupQuery = GroupQuery.extend({
    some_method: function(){...}
});

var CustomModel = BaseModel.extend({
    model_name: 'your.model'
});

var CustomCollection = BaseCollection.extend({
    model_name: 'your.model',
    model: CustomModel,
    
    /*  you can define the GroupQuery to use when a collection is 
     *  fetched with a group_by query, useful to add specific methods 
     *  on group themself,
     *  otherwise GroupQuery Model is used instead 
     */
    group_model: CustomGroupQuery
});


// create a new instance of collection
var collection = new CustomCollection();

var promise = collection.fetch({
    group_by: ['type']
});

promise.done(function(){
    /*
     * the collection is populated with GroupQuery model
     */

    // collection.length == your.model grouped by type
  
    // collection.grouped() == true
    
    var group_query = collection.at(0);
    
    // group_query instanceof CustomGroupQuery
    // group_query.get('value') == type group name
    // group_query.get('length') == number of element in the group
    
    // collection where will be set group results
    var list = group_query.group;
    
    // list instanceof CustomCollection
        
    // get all grouped items
    var group_promise = group_query.fetch():
    
    group_promise.done(function(){
    
        /*
         * the group is populated with Model
         */
    
        // list.length == group_query.get('length') 
    
        var model = list.at(0);
        
        // model instanceof CustomModel
    });
});
```


### Unleashed View

Odoo View has been extended to add some default behavior/features.

**instantiation**

```js
odoo.unleashed.module('my_module').ready(function(my_module, require, _, Backbone, base) {

    var UnleashedView = base.views('Unleashed');

    instance.web.views.add('foo', 'instance.my_module.FooView');
    instance.booking_chart.FooView = UnleashedView.extend({
        
        display_name: base._lt('Foo'),
        template: "Foo",
        view_type: 'foo',
        
        /*
         * You can redefine views and models used by UnleashedView, 
         * specially for the State, usually each view has his own way 
         * to keep the view state persistent.
         *
         * Check comment on State and Panel objects for more details.
         */
        Panel: base.views('Panel'),
        State: base.models('State'),
        
        /*
         * Configure the state before processing it 
         * the state is processed after "start" and before "ready" execution.
         *
         * Depending of your state model, you will certainly have to configure it 
         * before his processing, usually by linking some objects and listening 
         * events to update the state.
         *  
         * An example is available in "demo_todo" module.
         */
        stateConfig: function(){
        },
        
        /*
         * Executed by Odoo before view loading, usual place to instantiate
         * your views and models.
         */
        start: function(){
        },

        /*
         * Pre configure the view before state processing
         *
         *  @param {Object} data
         *    View configuration object:
         *    - arch: Object
         *    - field_parent: Boolean
         *    - fields: Object
         *    - model: String
         *    - name: String
         *    - toolbar: Object
         *    - type: String
         *    - view_id: Integer
         */
        configure: function(data){
        },
        
        /*
         * The view is ready to be used, called by a listener on  
         * Odoo View "view_loaded" event
         *
         *  @param {Object} data
         *    View configuration object:
         *    - arch: Object
         *    - field_parent: Boolean
         *    - fields: Object
         *    - model: String
         *    - name: String
         *    - toolbar: Object
         *    - type: String
         *    - view_id: Integer
         */
        ready: function(data){
            /*
             * A Marionette Panel is available, 
             * with all Odoo part defined as Region:
             * - this.panel.buttons
             * - this.panel.pager
             * - this.panel.sidebar
             * - this.panel.body
             */
        }
    });
});
```

Features automatically handled by the Unleashed View:

- the State of the view is managed by a Model, automatically pushed into the URL at state 
  modification, you can extend the state model to had your own state logic.
- add a Marionette Panel to manage all elements available in an Odoo view:   
  `buttons`, `sidebar`, `pager`, `body` regions. 

Checkout the [demo_todo module](https://github.com/trobz/openerp-web-unleashed/tree/master/demo_todo) for more details.

**custom view type**

To support custom `view_type` in `ir.ui.view` model and to have specific view 
description (use `arch` config,...), you have to extend the python `irUiView` model 
and specify your new view.

You can add `arch` validation and build highly configurable view in the same way 
than standard Odoo views.
  
A simple example of a custom type declaration is available here:             
https://github.com/trobz/openerp-web-unleashed/blob/master/demo_todo/view/todo.py

### Pager

Provide everything to have a pagination on your collection, similar than the Odoo one but without dependencies.

- Paginated collection
- A pager view, with the same layout than the native Odoo pager

Checkout the [demo_todo module](https://github.com/trobz/openerp-web-unleashed/tree/master/demo_todo) for more details.

### Iterator

A Backbone collection with selectable model, this collection implement several methods like:    
`next`, `previous`, `first`, `last`, `select`,... 

## Extra module

`web_unleashed_extra` module contain all libraries and widget not necessary 
useful for all modules that uses unleashed.

- momentjs / numeraljs libraries
- fontawesome library
- extra base model
  - period model: used to manage a period of time as a Backbone Model

# Libraries

## **libraries in base module**

- [Backbone 1.2.3](http://backbonejs.org)
- [Marionnette 2.4.3](https://github.com/marionettejs/backbone.marionette/)

## **Libraries in extra module**

- [MomentJS 2.10.6](http://momentjs.com)
- [MomentJS Twix Plugin 1.9.3](https://github.com/icambron/twix.js)
- [NumeralJS 1.5.3](http://adamwdraper.github.com/Numeral-js/)
- [Font Awesome 4.4.0](http://fontawesome.io)
