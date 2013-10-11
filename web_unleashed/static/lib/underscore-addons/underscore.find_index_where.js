(function(Underscore) {
    var _ = Underscore;
    var findIndexWhere = function(obj, find) {

        var index = null, name;
        _.each(obj, function(item, i) {
            var found = true;
            for(name in find){
                if(item[name] !== find[name]){
                    found = false;
                }
            }
            if(found){
                index = i;
            }
        });

        return obj;
    };

    Underscore.mixin({
        findIndexWhere : findIndexWhere
    });

})(_ || Underscore)