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
var Zug = elemente.Zug;

var regeln = require("./../spielregeln.js");
var Spielregeln = regeln.Spielregeln;

var bewertung = require("./../bewertung.js");
var MaterialBewertung = bewertung.MaterialBewertung;

var minimax = require("./../minimax.js");
var MinimaxAlgorithmus = minimax.MinimaxAlgorithmus;

exports['MinimaxAlgorithmus.gabelTest'] = function (test) {
    var algorithmus,
        stellung,
        zug;

    stellung = new Stellung('2q1k3/8/8/8/4N3/8/K7/8 w - - 0 1');
    algorithmus = new MinimaxAlgorithmus(Spielregeln, MaterialBewertung, 4);

    zug = algorithmus.ermittleZug(stellung);
    test.deepEqual(zug, new Zug('e4d6'));

    test.done();
};