/**
 * Created with JetBrains WebStorm.
 * User: StefanZ
 * Date: 01.10.12
 * Time: 21:41
 * To change this template use File | Settings | File Templates.
 */

var contains = function (array, obj) {
    var i = 0;

    for (i = 0; i < array.length; i += 1) {
        if (array[i] === obj) {
            return true;
        }
    }

    return false;
};

var forEach = function (array, action) {
    var i = 0;

    for (i = 0; i < array.length; i += 1) {
        action(array[i]);
    }
};

if (typeof module !== 'undefined' && module.exports) {
    exports.forEach = forEach;
    exports.contains = contains;
}