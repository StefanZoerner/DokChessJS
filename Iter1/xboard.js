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

/**
 * Liefert den ersten gueltigen Bauernzug (Bauer 1 vor) fuer den Spieler am Zug, falls vorhanden.
 *
 * @param {Stellung} stellung
 * @returns {Zug}
 */
function findeBauernZugMitEinemFeldFrei(stellung) {
    var feld, figur,
        zeile, spalte,
        richtung,
        ziel;

    for (feld = 0; feld < 64; feld += 1) {
        if (!stellung.istFrei(feld)) {
            figur = stellung.brett[feld];
            if (figur.farbe === stellung.amZug && figur.art === FigurenArt.BAUER) {
                zeile = Feld.zeile(feld);
                spalte = Feld.spalte(feld);

                richtung = (figur.farbe.amZug === Farbe.WEISS) ? -1 : 1;
                ziel = Feld.ausKoordinaten(zeile + richtung, spalte);
                if (stellung.istFrei(ziel)) {
                    return new Zug(feld, ziel);
                }
            }
        }
    }
}

/**
 * Einfache Implmenetierung des xboard-Protokolls.
 */
process.stdin.on('data', function (text) {
    var zug, zeilen, zeile, i;

    zeilen = text.split('\n');

    for (i = 0; i < zeilen.length; i += 1) {
        zeile = zeilen[i];

        if (zeile === 'xboard') {
            console.log('');
        }

        if (zeile === 'quit') {
            process.exit();
        }

        if (zeile === 'new') {
            stellung = new Stellung();
        }

        zug = Zug.ausZeichenkette(zeile);
        if (zug !== undefined) {
            console.log('# Eingegangener Zug: ' + zug);
            stellung = stellung.fuehreZugAus(zug);
            zug = findeBauernZugMitEinemFeldFrei(stellung);
            console.log('move ' + zug);
            stellung = stellung.fuehreZugAus(zug);
        }
    }
});

