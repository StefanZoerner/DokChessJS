/* Copyright 2010, 2011, 2012 Stefan Zoerner
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

process.stdin.resume();
process.stdin.setEncoding('utf8');

var elemente = require("./elemente.js");

var Stellung = elemente.Stellung;
var Zug = elemente.Zug;
var FigurenArt = elemente.FigurenArt;
var Feld = elemente.Feld;
var Farbe = elemente.Farbe;

var stellung = new Stellung();

function findeBauernZugMitEinemFeldFrei(stellung) {
    var farbe, i, figur, zeile, spalte, dy, ziel;

    for (i = 0; i < 64; i += 1) {
        if (!stellung.istFrei(i)) {
            figur = stellung.brett[i];
            if (figur.farbe === stellung.amZug && figur.art === FigurenArt.BAUER) {
                zeile = Feld.zeile(i);
                spalte = Feld.spalte(i);

                dy = (farbe === Farbe.WEISS) ? -1 : 1;
                ziel = Feld.ausKoordinaten(zeile + dy, spalte);
                if (stellung.istFrei(ziel)) {
                    return new Zug(i, ziel);
                }
            }
        }
    }
}

function quit() {
    process.exit();
}

function xboard() {
    console.log('');
}

process.stdin.on('data', function (text) {
    var zug;

    if (text === 'xboard\n') {
        xboard();
    }

    if (text === 'quit\n') {
        quit();
    }

    if (text === 'new\n') {
        stellung = new Stellung();
    }

    zug = Zug.ausZeichenkette(text);
    if (zug !== undefined) {
        stellung = stellung.fuehreZugAus(zug);

        zug = findeBauernZugMitEinemFeldFrei(stellung);

        console.log('move ' + zug);

        stellung = stellung.fuehreZugAus(zug);

    }

});

