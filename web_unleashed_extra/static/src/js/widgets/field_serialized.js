openerp.unleashed.module('web_unleashed_extra').ready(function(instance){
    
    
    var FieldSerialized = instance.web.form.AbstractField.extend(instance.web.form.ReinitializeFieldMixin, {
        
        template: 'FieldSerialized',
    
        events: {
            'click .switch-mode': 'switch_mode'
        },
    
        initialize_content: function() {
        
            this.changed = false;
            var self = this;
            var options = {
                mode: 'view',
                error: function (err) {
                    console.error(err.toString());
                },
                change: function(){
                    self.changed = true;
                    self.store_dom_value();
                }
            };
            this.jsoneditor = new jsoneditor.JSONEditor(this.$el.get(0), options);
            
            
            if (! this.get("effective_readonly")) {
                this.jsoneditor.setMode('tree');
                this.add_switch_mode_button('code');
            }
            else {
                this.$el.find('.menu').hide();
            }
        },
        
        add_switch_mode_button: function(mode){
            var $switch_button = $('<button title="Swith to code mode" class="switch-mode">'); 
            this.$el.removeClass('code').removeClass('tree');
            
            if(mode == 'code') {
                this.$el.addClass('tree');
                $switch_button.text('');
            }
            else {
                this.$el.addClass('code');
                $switch_button.text('');
            }
            
            $switch_button.addClass(mode);
            this.$el.find('.outer').prepend($switch_button);
        },
        
        switch_mode: function(e){
            e.preventDefault();
            var $switch_button = $(e.currentTarget);
            
            if($switch_button.hasClass('code')){
                this.jsoneditor.setMode('code');
                this.add_switch_mode_button('tree');
            }
            else {
                this.jsoneditor.setMode('tree');
                this.add_switch_mode_button('code');
            }
        },
        
        commit_value: function () {
            if (! this.get("effective_readonly") && this.jsoneditor && this.changed) {
                this.changed = false;
                this.store_dom_value();
            }
            return this._super();
        },
        
        store_dom_value: function () {
            try {
                var json = this.jsoneditor.get();
                this.internal_set_value(json || {});
                this.remove_error();
            }
            catch(e){
                this.report_error(e);
            }
        },
        
        report_error: function(e){
            var $pre = this.$el.find('.json-error');
            if($pre.length <= 0){
                $pre = $('<pre class="json-error">');
            }
            
            this.$el.append($pre.empty().append($('<code>').text(e.message)));
        },
        
        remove_error: function(){
            this.$el.find('.json-error').remove();
        },
        
        render_value: function() {
            this.jsoneditor.set(this.get('value'));
        },
        
        set_dimensions: function (height, width) {
            this._super(height, width);
            if (!this.get("effective_readonly") && this.jsoneditor) {
                this.$el.css({
                    width: width,
                    minHeight: height
                });
            }
        },
    });

    instance.web_unleashed_extra.FieldSerialized = FieldSerialized;
    instance.web.form.widgets.add('serialized', 'openerp.web_unleashed_extra.FieldSerialized');
});
        
