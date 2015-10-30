# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed - Todo Demo',
    'version': '1.0',
    'author': 'Trobz',
    'website': 'https://github.com/trobz/openerp-web-unleashed',
    'category': 'Demo',
    'description': """
Demo of a simple todo list, powered by the web unleashed core.

feature in demo:

- module initialization
- data access Backbone and the JSON-RPC API
- layout definition based on Marionette
- native OpenERP search widget support
    """,
    'depends': [
        'web_unleashed_extra',
    ],
    'data': [
        # view
        'view/demo_todo_view.xml',

        # menu
        'menu/todo.xml',

         # JS/CSS Assets files
        'views/demo_todo.xml',
    ],
    'qweb' : [
        'static/src/templates/*.xml',
    ],
    'demo': [],
    'application': False,
    'sequence': -99,
    'installable': True,
    'active': False,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
