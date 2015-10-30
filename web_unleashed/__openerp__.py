# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed',
    'version': '1.0',
    'category': 'Hidden',
    
    'description': """
Core Unleashed Web Module:

- improve code architecture and organization
- add support of Backbone and Marionette frameworks
- native support of JSON-RPC API for Backbone

+ libraries version:
  - Backbone: v1.2.3
  - Marionette: v2.4.3
  - Underscorejs: v1.8.3
    """,
    
    'author': 'Trobz',
    'website': 'https://github.com/trobz/openerp-web-unleashed',
    
    'depends': [
        'web'
    ],

    'data': [
        # JS/CSS Assets files
        'views/web_unleashed.xml',
    ],

    'qweb' : [
        'static/src/xml/*.xml',
    ],

    'test': [
        'static/src/tests/group.js',
        'static/src/tests/pager.js',
        'static/src/tests/connector.js',
    ]
}
