var util = {};

util.errors = {
    callbackNotAFunction : new Error("Invalid Argument: callback is not a function")
};

util.call = function (callback, param) {
    if(typeof callback === "function"){
        console.log(param);
        if(param != null && param instanceof Array){
                return callback.apply(this, param);
        }else{
            return callback();
        }
    }
};

util.isFunction = function (callback) {
    return typeof callback === "function";
};


module.exports = util;