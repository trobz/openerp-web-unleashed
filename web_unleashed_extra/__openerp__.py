# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed - Extra',
    'version': '1.0',
    'category': 'Hidden',
    
    'description': """
Extra components for unleashed module:

- Twitter bootstrap 3.0, prefixed with a `bootstrap-scoped` css class: http://getbootstrap.com/
- jQuery Transit (css3 animation): http://ricostacruz.com/jquery.transit/
- NumeralJs lib: https://numeraljs.com/
- MomentJs lib: http://momentjs.com/
- Font Awesome lib: http://fortawesome.github.io/Font-Awesome/
- Additional base models: period
- Additional widgets for OpenERP: serialized

    """,
    
    'author': 'Trobz',
    'website': 'http://trobz.com',
    
    'depends': [
        'web_unleashed'
    ],
    
     "update_xml" : [
     ],
    
    'qweb' : [
        'static/src/templates/*.xml',
    ],
    
    'css' : [
        #bootstrap css
        'static/lib/bootstrap-scoped/bootstrap-reset-openerp.css',
        'static/lib/bootstrap-scoped/bootstrap-scoped.css',
        
        #font awesome
        'static/lib/font-awesome/css/font-awesome.min.css', 
        
        # serialized widget
        'static/lib/jsoneditor/jsoneditor.css',
        'static/src/css/field_serialized.css',
    ],
       
    'js': [
        
        # boostrap libs
        'static/lib/bootstrap-scoped/bootstrap.min.js',
        
        # momentjs
        'static/lib/moment/moment.js',
        
        # numeraljs
        'static/lib/numeral/numeral.js',

        # jquery transit
        'static/lib/jquery-transit/jquery.transit.min.js',

        # models
        'static/src/js/models/period.js',
        
        # serialized widget
        'static/lib/jsoneditor/jsoneditor.js',
        'static/lib/jsoneditor/lib/jsonlint/jsonlint.js',
        'static/src/js/widgets/field_serialized.js',

    ],
    
    'test': [
    ]
}
