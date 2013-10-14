# -*- encoding: utf-8 -*-
##############################################################################

from openerp.osv import osv, fields

class demo_todo(osv.osv):
    
    _name = "demo.todo"
    _description = "Todo"

    _columns = {
        'name': fields.char('Name', required=True),
        'description': fields.text('Description'),
        'priority': fields.selection(
                    ((1,'high'), (2,'medium'), (3,'low')), 
                    'Priority'
                    ),
    }

demo_todo()

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:

