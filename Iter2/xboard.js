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
        zug = EinfacheZugauswahl.ermittleZug(stellung);
        console.log('move ' + zug);
        stellung = stellung.fuehreZugAus(zug);
    }
});