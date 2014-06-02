# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed',
    'version': '1.0',
    'category': 'Hidden',
    
    'description': """
Core Web Module:

- improve code architecture and organization
- add support of Backbone and Marionette frameworks
- native support of JSON-RPC API for Backbone
    """,
    
    'author': 'Trobz',
    'website': 'https://github.com/trobz/openerp-web-unleashed',
    
    'depends': [
        'web'
    ],
    
    'qweb' : [
        'static/src/xml/*.xml',
    ],
    
    'css' : [
        'static/src/css/pager.css',
        'static/src/css/fix_form.css'
    ],
       
    'js': [
        # backbone 1.1.0 and underscore 1.5.2 used in no conflict mode, see `unleashed.js` for more details
        'static/lib/underscore/underscore.js',
        'static/lib/backbone/backbone.js',
        
        # backbone.marionette 1.1.0
        'static/lib/marionette/marionette.js',
                
        # addons for libs
        'static/lib/jquery-addons/jquery.font_size.js',
        'static/lib/jquery-addons/jquery.when_all.js',
        'static/lib/jquery-addons/jquery.serialize_object.js',
        'static/lib/jquery-addons/jquery.form_reset.js',
        'static/lib/underscore-addons/underscore.deep_extend.js',
        'static/lib/underscore-addons/underscore.find_index_where.js',
        'static/lib/underscore-addons/underscore.parse.js',

        # manage object instanciation and sync support for backbone models
        'static/src/js/core/unleashed.js',
        
        # utils
        'static/src/js/utils/holder.js',
        'static/src/js/utils/connector.js',
        
        # controller
        'static/src/js/controllers/pager.js',
        
        # backbone base models
        'static/src/js/models/base.js',
        'static/src/js/models/query.js',
        'static/src/js/models/iterator.js',
        'static/src/js/models/state.js',
        
        # backbone base collections
        'static/src/js/collections/base.js',
        'static/src/js/collections/pager.js',
        'static/src/js/collections/group.js',
        'static/src/js/collections/iterator.js',

        # backbone base views
        'static/src/js/views/view.js',
        'static/src/js/views/base.js',
        'static/src/js/views/region.js',
        'static/src/js/views/pager.js',
        'static/src/js/views/panel.js',
        'static/src/js/views/unleashed.js',
    ],
    
    'test': [
        'static/src/tests/group.js',
        'static/src/tests/pager.js',
        'static/src/tests/connector.js',
    ]
}
