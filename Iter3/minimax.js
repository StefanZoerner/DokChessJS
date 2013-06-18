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

var elemente = require("./elemente.js");
var Farbe = elemente.Farbe;

var regeln = require("./spielregeln.js");
var Spielregeln = regeln.Spielregeln;

var bewertung = require("./bewertung.js");
var MaterialBewertung = bewertung.MaterialBewertung;

function MinimaxAlgorithmus(spielregeln, bewertung, tiefe) {
    this.spielregeln = spielregeln;
    this.bewertung = bewertung;
    this.tiefe = tiefe;
}

MinimaxAlgorithmus.prototype.ermittleZug = function (stellung) {

    var ausgewaehlterZug,
        zuege,
        neueStellung,
        wert,
        besterWert,
        besterZug,
        i;

    zuege = this.spielregeln.ermittelGueltigeZuege(stellung);
    besterWert = -Number.MAX_VALUE;

    for (i = 0; i < zuege.length; i += 1) {
        neueStellung = stellung.fuehreZugAus(zuege[i]);
        wert = this.ermittleZugRekursiv(neueStellung, 1, stellung.amZug);
        if (wert > besterWert) {
            besterWert = wert;
            ausgewaehlterZug = zuege[i];
        }
    }
    return ausgewaehlterZug;
};

MinimaxAlgorithmus.prototype.ermittleZugRekursiv = function (stellung, aktuelleTiefe, spielerFarbe) {

    var zuege,
        max,
        min,
        neueStellung,
        wert,
        feldMitKoenig,
        i;

    if (aktuelleTiefe === this.tiefe) {
        return this.bewertung.bewerteStellung(stellung, spielerFarbe);
    } else {
        zuege = this.spielregeln.ermittelGueltigeZuege(stellung);
        if (zuege.length === 0) {
            feldMitKoenig = stellung.findeKoenig(stellung.amZug);
            if (this.spielregeln.istFeldAngegriffen(stellung, feldMitKoenig, Farbe.andere(stellung.amZug))) {
                // Matt
                if (stellung.amZug === spielerFarbe) {
                    return -(10000 - aktuelleTiefe);
                } else {
                    return (10000 - aktuelleTiefe);
                }
            } else {
                // Patt
                return 0;
            }
        } else {
            if (aktuelleTiefe % 2 === 0) {
                // Max
                max = -Number.MAX_VALUE;
                for (i = 0; i < zuege.length; i += 1) {
                    neueStellung = stellung.fuehreZugAus(zuege[i]);
                    wert = this.ermittleZugRekursiv(neueStellung, aktuelleTiefe + 1, spielerFarbe);
                    if (wert > max) {
                        max = wert;
                    }
                }
                return max;
            } else {
                // Min
                min = Number.MAX_VALUE;
                for (i = 0; i < zuege.length; i += 1) {
                    neueStellung = stellung.fuehreZugAus(zuege[i]);
                    wert = this.ermittleZugRekursiv(neueStellung, aktuelleTiefe + 1, spielerFarbe);
                    if (wert < min) {
                        min = wert;
                    }
                }
                return min;
            }
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    exports.MinimaxAlgorithmus = MinimaxAlgorithmus;
}