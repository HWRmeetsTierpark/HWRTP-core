var util = {};

util.call = function (callback, param) {
    if(typeof callback === "function"){
        if(param != null){
            callback(param);
        }else{
            callback();
        }
    }
};

module.exports = util;