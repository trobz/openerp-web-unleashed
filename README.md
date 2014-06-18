[![Build Status](https://travis-ci.org/trobz/openerp-web-unleashed.png?branch=master)](https://travis-ci.org/trobz/openerp-web-unleashed)

By default, the web part of OpenERP is not easy, the documentation is minimalist and the architecture is hard to understand.

This is a pure web module with one objective: providing good bases to build rich web application in OpenERP.


## Features

- clear MVC pattern, based on Backbone and Marionnette... with all their documentations ! 
- new namespace to organize and get access to your objects
- full-featured Backbone Models with OpenERP JSON-RPC API support
- QWeb rendering for Marionette views
- base objects to build custom views (Pager, Grouped Collection, Extended OpenERP View, State manager...)
- unit tests for basic functionalities
- load/configuration commonly used libraries (momentjs, numeraljs, awesome-font,...) 


## Exemple

Checkout the [demo_todo module](https://github.com/trobz/openerp-web-unleashed/tree/master/demo_todo), it's a full featured example with comments. 

### Features

- module initialization
- Backbone data access with JSON-RPC API
- layout definition based on Marionette
- native OpenERP search widget support
- pagination support
- custom 'todo' view type

# Architecture

## Files organization

A good architecture start with a good file organization. A common practice is to 
separate each object in one fileand organize objects in logical folder.

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
- this is a basic organization, ```js``` subfolder can have specific folders 
to organize your module code logically.

## Unleashed namespace

`openerp.unleashed`

This namespace is a Marionette Application, each web OpenERP module that uses 
Unleashed are submodules of this Application.

A module object has few helpers to set/get object in his namespace:

```js
// basic getter/setter
openerp.unleashed.module('my_module').set(namespace, name, object)
openerp.unleashed.module('my_module').get(namespace, name)
// helpers
openerp.unleashed.module('my_module').views(view_name, object)
openerp.unleashed.module('my_module').collections(collection_name, object)
openerp.unleashed.module('my_module').models(model_name, object)
openerp.unleashed.module('my_module').utils(name, object)
```

Notes: 

- you never have to call the full namespace path, the module object is always 
passed to your module scope when you have declare a new object, 
see [object declaration](#object-declaration) for details 
- the module name has to be the technical name of your OpenERP module

### Module initialization

In OpenERP web, you need to define a method on openerp namespace to know 
when OpenERP is ready to process your code, like this:

```js
openerp.my_module = function(instance){
    //openerp is ready to do stuff for your module !
};
```

With Unleashed, you can declare a ready method as many time as you want, 
and from anywhere, Unleashed will ensure that OpenERP is ready to execute your code.

In addition to ensure that OpenERP is fully loaded, some useful arguments 
are passed to the function, like the base module object, the latest Backbone and Underscore version, 
and the current module object.

```js
openerp.unleashed.module('my_module').ready(function(instance, my_module, _, Backbone, base_module) {
    // openerp is ready and you can benefit from 
    // the lastest Backbone and Underscore version here !
});
```

Notes:

- Backbone and Underscore are already included in OpenERP, but they are using old version. Unleashed
include the latest version of these libraries in noConflict mode.

### Object declaration

To be able to split object in different files, and keep the code organization in the global scope, 
you have to use the module scope.

In this scope, you have access to the module object, the base module object, 
the latest Underscore and Backbone version.


**create a new object**

```js
openerp.unleashed.module('my_module', function(my_module, _, Backbone, base){
    var _super = Backbone.View.prototype;
    var GreatView = Backbone.View.extend({
        
        initialize: function(){
        }
    });

    my_module.views('GreatView', GreatView);
});
```

In this example, a new view extend the basic Backbone View and is added 
to ```my_module``` namespace with the name "GreatView".

Now you have access to this object from anywhere by simply using the name you used to declare it:

```js
    ...
    var GreatView = my_module.views('GreatView'),
        view = new GreatView();
    ...
```

Note:
- because OpenERP is not using an AMD/module loader system like RequireJS, you have 
to ensure that your files are loaded in the correct order in ```__openerp__.py``` file.    
We are working on requirejs support for OpenERP, it's planned for the next release of unleashed.



## Base module

Unleash provide some useful Backbone extension:

### JSON-RPC API Model support

By using the ```BaseModel``` and ```BaseCollection``` from the base module, 
the JSON-RPC API is automatically implemented.

**create a new "JSON-RPC API ready" collection**

```js
openerp.unleashed.module('my_module', function(my_module, _, Backbone, base){
    
    var BaseCollection = base.collections('BaseCollection'),
        _super = BaseCollection.prototype;
    
    var Employees = BaseCollection.extend({
        model_name: 'hr.employee',
        // your classic backbone code here !
    });

    my_module.collections('Employees', Employees);
});
```

Now, you are ready to use this model, somewhere else, you can do:

```js
openerp.unleashed.module('my_module', function(my_module, _, Backbone, base){
    
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
     */ otherwise GroupQuery Model is used instead 
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

OpenERP View has been extended to add some default behavior/features.

**instanciation**

```js
openerp.unleashed.module('my_module').ready(function(instance, my_module, _, Backbone, base) {

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
         * Executed by OpenERP before view loading, usual place to instanciate 
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
         * OpenERP View "view_loaded" event
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
             * with all OpenERP part defined as Region:
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
- add a Marionette Panel to manage all elements available in an OpenERP view:   
  `buttons`, `sidebar`, `pager`, `body` regions. 

Checkout the [demo_todo module](https://github.com/trobz/openerp-web-unleashed/tree/master/demo_todo) for more details.

**custom view type**

To support custom `view_type` in `ir.ui.view` model and to have specific view 
description (use `arch` config,...), you have to extend the python `irUiView` model 
and specify your new view.

You can add `arch` validation and build highly configurable view in the same way 
than standard OpenERP views.
  
A simple example of a custom type declaration is available here:             
https://github.com/trobz/openerp-web-unleashed/blob/master/demo_todo/view/todo.py

### Pager

Provide everything to have a pagination on your collection, similar than the OpenERP 
one but without dependencies.

- Paginated collection
- A pager view, with the same layout than the native OpenERP pager

Checkout the [demo_todo module](https://github.com/trobz/openerp-web-unleashed/tree/master/demo_todo) for more details.

### Iterator

A Backbone collection with selectable model, this collection implement several methods like:    
`next`, `previous`, `first`, `last`, `select`,... 

## Extra module

`web_unleashed_extra` module contain all libraries and widget not necessary 
useful for all modules that uses unleashed.

- momentjs / numeraljs libraries
- fontawesome library
- twitter bootstrap, scoped with 'bootstrap-scoped' css class
- extra base model
  - period model: used to manage a period of time as a Backbone Model


# Libraries

- [Backbone 1.1.0](http://backbonejs.org)
- [Underscore 1.5.2](http://underscorejs.org)
- [Marionnette 1.1.0](https://github.com/marionettejs/backbone.marionette/)

**Libraries in extra module**

- [MomentJS 2.0.0](http://momentjs.com)
- [MomentJS Twix Plugin 0.3](https://github.com/icambron/twix.js)
- [NumeralJS 1.4.9](http://adamwdraper.github.com/Numeral-js/)
- [Font Awesome 3.2.1](http://fontawesome.io)
- [Bootstrap 3.0.0](http://getbootstrap.com)    
note: all css selector are scoped with the class ```.bootstrap_scope``` to avoid css conflict.

