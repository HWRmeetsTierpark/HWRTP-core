/**
 * some utils
 */

var util = {};

util.errors = {
    callbackNotAFunction : new Error("Invalid Argument: callback is not a function")
};

util.const = {
    minEntryTime : 30
};

/**
 * checks if callback is function and call it
 * @param callback
 * @param param
 * @returns {*}
 */
util.call = function (callback, param) {
    if(typeof callback === "function"){
        if(param != null){
            return callback.call(this, param);
        }else{
            return callback();
        }
    }
};

util.isFunction = function (callback) {
    return typeof callback === "function";
};


module.exports = util;