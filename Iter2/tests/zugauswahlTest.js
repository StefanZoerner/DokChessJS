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

"use strict";

var elemente = require("./../elemente.js");
var Stellung = elemente.Stellung;

var zugauswahl = require("./../zugauswahl.js");
var EinfacheZugauswahl = zugauswahl.EinfacheZugauswahl;

exports['EinfacheZugauswahl.ermittleZug Anfang'] = function (test) {
    var stellung = new Stellung(),
        zug;

    zug = EinfacheZugauswahl.ermittleZug(stellung);
    test.ok(zug !== undefined);

    test.done();
};