# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed - Todo Demo',
    'version': '1.0',
    'author': 'trobz',
    'website': 'http://trobz.com',
    'category': 'Demo',
    'description': """
Demo of a simple todo list, powered by the web unleashed core.

feature in demo:
- module initialization
- data access Backbone and the JSON-RPC API
- layout definition based on Marionnette
- native OpenERP search widget support 
    """,
    
    'depends': [
        'web_unleashed',
    ],
    
    'data': [
        'menu/todo.xml'
    ],
    
    'qweb' : [
        'static/src/templates/*.xml',
    ],
    
    'js': [
        'static/src/js/models/todo.js',
        'static/src/js/collections/todos.js',
        'static/src/js/views/todo.js',
        'static/src/js/views/todos.js',
        'static/src/js/todo.js',
    ],
    
    'css': [
        'static/src/css/todo.css'
    ],
    
    'demo': [],
    
    'application': False,
    'sequence': -99,
    'installable': True,
    'active': False,
    'post_objects': [],
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
