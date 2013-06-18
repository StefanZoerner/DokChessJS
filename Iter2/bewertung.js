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

var FigurenArt = elemente.FigurenArt;

var MaterialBewertung = {

    bewerteStellung: function(stellung, ausSicht) {
        var feld, figur, richtung, bewertung = 0;

        for (feld = 0; feld < 64; feld += 1) {
            figur = stellung.aufFeld(feld);
            if (figur !== undefined) {
                richtung = figur.farbe === ausSicht ? 1 : -1;
                switch (figur.art) {
                    case FigurenArt.BAUER:
                        bewertung += richtung;
                        break;
                    case FigurenArt.SPRINGER:
                    case FigurenArt.LAEUFER:
                        bewertung += richtung * 3;
                        break;
                    case FigurenArt.TURM:
                        bewertung += richtung * 5;
                        break;
                    case FigurenArt.DAME:
                        bewertung += richtung * 9;
                        break;
                }
            }
        }
        return bewertung;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    exports.MaterialBewertung = MaterialBewertung;
}

