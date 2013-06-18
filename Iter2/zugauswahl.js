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

var regeln = require("./spielregeln.js");
var Spielregeln = regeln.Spielregeln;

var bewertung = require("./bewertung.js");
var MaterialBewertung = bewertung.MaterialBewertung;

var EinfacheZugauswahl = {

    ermittleZug: function (stellung) {
        var zuege,
            ausgewaehlterZug,
            neueStellung,
            wert,
            besterWert,
            i;

        zuege = Spielregeln.ermittelGueltigeZuege(stellung);
        besterWert = -Number.MAX_VALUE;

        for (i = 0; i < zuege.length; i += 1) {
            neueStellung = stellung.fuehreZugAus(zuege[i]);
            wert = MaterialBewertung.bewerteStellung(neueStellung, stellung.amZug);
            if (wert > besterWert) {
                besterWert = wert;
                ausgewaehlterZug = zuege[i];
            }
        }
        return ausgewaehlterZug;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    exports.EinfacheZugauswahl = EinfacheZugauswahl;
}