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

var regeln = require("./spielregeln.js");
var Spielregeln = regeln.Spielregeln;

var bewertung = require("./bewertung.js");
var MaterialBewertung = bewertung.MaterialBewertung;

var minimax = require("./minimax.js");
var MinimaxAlgorithmus = minimax.MinimaxAlgorithmus;


var stellung = new Stellung();
var algorithmus = new MinimaxAlgorithmus(Spielregeln, MaterialBewertung, 4);

function quit() {
    process.exit();
}

function xboard() {
    console.log('');
}

process.stdin.on('data', function (text) {
    var zug, zeilen, zeile, i;

    zeilen = text.split('\n');
    for (i = 0; i < zeilen.length; i += 1) {
        zeile = zeilen[i];
        console.log('# (DokChess) line: ['  + zeile + ']');

        if (zeile === 'xboard') {
            console.log('');
        }

        if (zeile === 'quit') {
            process.exit();
        }

        if (zeile === 'new') {
            stellung = new Stellung();
        }

        if (zeile === 'white') {
            console.log('# (DokChess) weiss am Zug');
            zug = algorithmus.ermittleZug(stellung);
            console.log('move ' + zug);
            stellung = stellung.fuehreZugAus(zug);
            console.log('# (DokChess) Brett nach ' + zug + ': [' + stellung + ']');
        }

        zug = Zug.ausZeichenkette(zeile);
        if (zug !== undefined) {
            console.log('# (DokChess) Eingegangener Zug: ' + zug);
            stellung = stellung.fuehreZugAus(zug);
            console.log('# (DokChess) Brett nach ' + zug + ': [' + stellung + ']');

            zug = algorithmus.ermittleZug(stellung);
            console.log('move ' + zug);
            stellung = stellung.fuehreZugAus(zug);
            console.log('# (DC Iter 3) Brett nach ' + zug + ': [' + stellung + ']');
        }
    }
});