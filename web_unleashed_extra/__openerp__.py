# -*- coding: utf-8 -*-
{
    'name': 'Web Unleashed - Extra',
    'version': '1.0',
    'category': 'Hidden',
    
    'description': """

Extra components for unleashed module:
======================================
    
- Font Awesome (CSS):
    - version: 4.4.0
    - http://fortawesome.github.io/Font-Awesome/

- jQuery Transit (css3 animation):
    - version: 0.9.12
    - http://ricostacruz.com/jquery.transit/

- jQuery Validation:
    - version: 1.14.0
    - http://jqueryvalidation.org/

- Modernizr:
    - version: 3.0.0-alpha.4
    - https://modernizr.com/

- NumeralJs (languages support): 
    - version: 1.5.3
    - https://numeraljs.com/

- Additional base models: 
    - period
    """,
    
    'author': 'Trobz',
    'website': 'http://trobz.com',
    
    'depends': [
        'web_unleashed'
    ],

    'data': [
        # JS/CSS Assets files
        'views/web_unleashed_extra.xml',
    ],

    'qweb': [
        'static/src/templates/*.xml',
    ],
    
    'test': [
    ]
}
