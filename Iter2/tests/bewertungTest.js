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

var bewertung = require("./../bewertung.js");
var elemente = require("./../elemente.js");

var Stellung = elemente.Stellung;
var Farbe = elemente.Farbe;

var MaterialBewertung = bewertung.MaterialBewertung;

exports['MaterialBewertung.bewerteStellung Anfang'] = function (test) {
    var stellung = new Stellung();

    var weissWert = MaterialBewertung.bewerteStellung(stellung, Farbe.WEISS);
    var schwarzWert = MaterialBewertung.bewerteStellung(stellung, Farbe.SCHWARZ);

    test.equal(weissWert, 0);
    test.equal(schwarzWert, 0);

    test.done();
};

exports['MaterialBewertung.bewerteStellung DameMehr'] = function (test) {
    var stellung = new Stellung("7Q/7K/8/8/8/3k4/8/8 w - - 0 1");

    var weissWert = MaterialBewertung.bewerteStellung(stellung, Farbe.WEISS);
    test.ok(weissWert > 0);

    test.done();
};