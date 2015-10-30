# -*- encoding: utf-8 -*-
from openerp import models, fields

TODO_SELECTION = ((1, 'high'), (2, 'medium'), (3, 'low'))


class demo_todo(models.Model):

    _name = "demo.todo"

    _description = "Todo"

    name = fields.Char(string='Name', required=True)

    description = fields.Text(string='Description')

    priority = fields.Selection(selection=TODO_SELECTION, string='Priority')

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
