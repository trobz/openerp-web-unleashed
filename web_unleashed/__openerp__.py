# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed',
    'version': '1.0',
    'category': 'Hidden',
    
    'description': """
Core Web Module:
- improve code architecture and organization
- add support of Backbone and Marionnette frameworks
- native support of JSON-RPC API for Backbone
    """,
    
    'author': 'Trobz',
    'website': 'http://trobz.github.io/openerp-web-unleashed',
    
    'depends': [
        'web'
    ],
    
     "update_xml" : [
     ],
    
    'qweb' : [
        'static/src/templates/*.xml',
    ],
    
    'css' : [
        'static/lib/font-awesome/css/font-awesome.min.css', 
   
        'static/lib/lightbox/css/lightbox.css',
        'static/lib/jsoneditor/jsoneditor.css',
        
        'static/src/css/field_serialized.css',
        'static/src/css/image_viewer.css',
        
        'static/lib/bootstrap-scoped/bootstrap-reset-openerp.css',
        'static/lib/bootstrap-scoped/bootstrap-scoped.css',
        'static/lib/colorbox/colorbox.css',
        'static/src/css/progress_bar_enhanced.css',
    ],
       
    'js': [
        # version 1.0 used in no conflict mode, see `unleashed.js` for more details
        'static/lib/underscore/underscore.js',
        'static/lib/backbone/backbone.js',
        
        # backbone.marionette dependencies
        'static/lib/marionette/public/javascripts/backbone.augment.js',
        'static/lib/marionette/public/javascripts/backbone.wreqr.js',
        'static/lib/marionette/public/javascripts/backbone.babysitter.js',
    
        # backbone.marionette 1.0.3
        'static/lib/marionette/src/build/marionette.core.js',
        'static/lib/marionette/src/marionette.helpers.js',
        'static/lib/marionette/src/marionette.triggermethod.js',
        'static/lib/marionette/src/marionette.domRefresh.js',
        'static/lib/marionette/src/marionette.bindEntityEvents.js',
        'static/lib/marionette/src/marionette.callbacks.js',
        'static/lib/marionette/src/marionette.controller.js',
        'static/lib/marionette/src/marionette.region.js',
        'static/lib/marionette/src/marionette.regionManager.js',
        'static/lib/marionette/src/marionette.templatecache.js',
        'static/lib/marionette/src/marionette.renderer.js',
        'static/lib/marionette/src/marionette.view.js',
        'static/lib/marionette/src/marionette.itemview.js',
        'static/lib/marionette/src/marionette.collectionview.js',
        'static/lib/marionette/src/marionette.compositeview.js',
        'static/lib/marionette/src/marionette.layout.js',
        'static/lib/marionette/src/marionette.approuter.js',
        'static/lib/marionette/src/marionette.application.js',
        'static/lib/marionette/src/marionette.module.js',
        
        
        'static/lib/numeral/numeral.js', 
        'static/lib/moment/moment.js',

		# language of momentjs
		'static/lib/moment/lang/fr.js',
		'static/lib/moment/lang/vi.js',

        'static/lib/lightbox/js/lightbox.js',
        'static/lib/colorbox/jquery.colorbox-min.js',

        'static/lib/jsoneditor/jsoneditor.js',
        'static/lib/jsoneditor/lib/jsonlint/jsonlint.js',
        
        'static/lib/jquery-transit/jquery.transit.min.js',
        
        # boostrap libs
        'static/lib/bootstrap-scoped/bootstrap.min.js',
        
        # addons for libs
        'static/lib/jquery-addons/jquery.when_all.js',
        'static/lib/jquery-addons/jquery.serialize_object.js',
        'static/lib/jquery-addons/jquery.form_reset.js',
        'static/lib/underscore-addons/underscore.deep_extend.js',
        'static/lib/underscore-addons/underscore.find_index_where.js',
        
        # manage object instanciation and sync support for backbone models
        'static/src/js/core/unleashed.js',
        
        # utils
        'static/src/js/utils/connector.js',
        
        # controller
        'static/src/js/controller/pager.js',
        
        # backbone base models
        'static/src/js/models/base.js',
        'static/src/js/models/iterator.js',
        'static/src/js/models/period.js',
        
        # backbone base collections
        'static/src/js/collections/base.js',
        'static/src/js/collections/pager.js',
        'static/src/js/collections/iterators.js',

        # backbone base views
        'static/src/js/views/base.js',
        'static/src/js/views/pager.js',
        
    ],
    
    'test': [
        'static/src/tests/connector.js',
        'static/src/tests/pager.js'
    ]
}
