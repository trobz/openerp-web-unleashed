# Introduction

By default, the web part of OpenERP is not easy, the documentation is minimalist and the architecture is hard to understand.

The module is a pure web module with one objective: providing good bases to build rich web application in OpenERP.

## Features

- new namespace to organize and get access to your objects
- native support of latest Backbone / Marionnette version, and all their relative documentations ! 
- auto-binding of Backbone Model with the OpenERP JSON-RPC API
- load/configuration of commonly used lib (momentjs, numeraljs, awesome-font,...) 

# Architecture

## Files organization

A good architecture start with a good file organization. A common practice is to separate each object in one file
and organize objects in logical folder.

A module build with Web Unleashed will look like:


- static
  - lib/       
    _all external lib dependencies_
  - src/
    - js/
      - models/
      - collections/
      - views/
      - utils/  
        _any useful lib_
      - my\_module.js    
        _the web module entry point_
    - templates/      
      _QWeb templates_
    - tests/      
      _jsunit tests_
    - images/
    - css/
    - ...

This is a basic organization, ```js``` subfolder can have specific folders to organize your module code logically.

## Unleashed namespace

`openerp.unleashed`

This namespace will contain all modules using Web Unleashed. 

Each module will dynamically create a new namespace in unleashed to store his own object.

A module object has few helpers to set/get object in his namespace:

```js
openerp.unleashed.my_module.views(view_name, object)
openerp.unleashed.my_module.collections(collection_name, object)
openerp.unleashed.my_module.models(model_name, object)
openerp.unleashed.my_module.utils(name, object)
```

Notes: 
- you never have to call the full namespace path, the module object is always passed to your module scope when you have declare a new object, see [object declaration](#object-declaration) for details 
- the module name has to be the technical name of your OpenERP module

### module initialization

In OpenERP web, you need to define a method on openerp namespace to know when OpenERP is ready to process your code, like this:
```js
openerp.my_module = function(instance){
    //openerp is ready to do stuff for your module !
};
```


With Unleashed, you can declare a ready method as many time as you want, and from anywhere, Unleashed will ensure that OpenERP is ready to execute your code.
In addition to ensure that OpenERP is fully loaded, some useful arguments are passed to the function, like the base module object, the latest Backbone, Underscore version, and the current module object.
```js
openerp.unleashed.module('my_module').ready(function(instance, my_module, _, Backbone, base_module) {
    //openerp is ready, and you can benefit from the lastest Backbone and Underscore version here !
});
```

### object declaration

To be able to split object in different files, and keep the code organization in the global scope, you have to use the module scope.
In this scope, you have access to module object, the base module object, the latest Underscore and Backbone version.

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

In this example, a new view extend the basic Backbone View and is added to ```my_module``` namespace with the name "GreatView".

After, you have access to this object from any other files by simply using the name you use to declare it:

```js
    ...
    var GreatView = my_module.views('GreatView'),
        view = new GreatView();
    ...
```

Note:
- because OpenERP is not using an AMD/module loader system like requirejs, you have to ensure that your files are loaded in the correct order in ```__openerp__.py``` file.    
We are working on requirejs support for OpenERP, it's planned for the next release of unleashed.



### the base module

Unleash provide some useful Backbone extension:

### support of JSON-RPC API

By using the ```BaseModel``` and ```BaseCollection``` from the base module, the JSON-RPC API is automatically implemented.

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

- ```employees``` is a Backbone Collection, populated with Backbone Model, with all what it's imply !
- you can pass to ```fetch``` method all JSON-RPC API js client options:      
filter, order, limit, offset, context, fields  
 

#### Pager

Provide everything to have a pagination on any collection, similar than the OpenERP one but without any depends

- Paginated collection
- A pager view, with the same layout than the native OpenERP pager

#### Iterator

A Backbone collection with selectable model, this collection implement several methods like: 
next, previous, first, last, select,... 


# Libraries

- [Backbone 1.0.0](http://backbonejs.org)
- [Underscore 1.4.4](http://underscorejs.org)
- [Marionnette 1.0.0](https://github.com/marionettejs/backbone.marionette/)
- [MomentJS 2.0.0](http://momentjs.com)
- [NumeralJS 1.4.9](http://adamwdraper.github.com/Numeral-js/)
- [Font Awesome 3.2.1](http://fontawesome.io)
- [Bootstrap 3.0.0](http://getbootstrap.com)    
note: all css selector are scoped with the class ```.bootstrap_scope``` to avoid css conflict.

