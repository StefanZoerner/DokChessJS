/* Copyright 2013 Stefan Zoerner
 *
 * This file is part of DokChess.
 *
 * DokChess is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DokChess is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DokChess.  If not, see <http://www.gnu.org/licenses/>.
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