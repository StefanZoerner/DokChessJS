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

process.stdin.resume();
process.stdin.setEncoding('utf8');

var elemente = require("./elemente.js");

var Stellung = elemente.Stellung;
var Zug = elemente.Zug;

var zugauswahl = require("./zugauswahl.js");
var EinfacheZugauswahl = zugauswahl.EinfacheZugauswahl;


var stellung = new Stellung();

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
            zug = EinfacheZugauswahl.ermittleZug(stellung);
            console.log('move ' + zug);
            stellung = stellung.fuehreZugAus(zug);
        }
    }
});