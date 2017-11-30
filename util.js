var util = {};

util.call = function (callback, param) {
    if(typeof callback === "function"){
        if(param != null && param instanceof Array){
                return callback.apply(this, param);
        }else{
            return callback();
        }
    }
};

module.exports = util;