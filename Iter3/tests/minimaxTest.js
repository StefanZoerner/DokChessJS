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

var regeln = require("./../spielregeln.js");
var Spielregeln = regeln.Spielregeln;

var bewertung = require("./../bewertung.js");
var MaterialBewertung = bewertung.MaterialBewertung;

var minimax = require("./../minimax.js");
var MinimaxAlgorithmus = minimax.MinimaxAlgorithmus;

exports['MinimaxAlgorithmus.Anfangsstellung'] = function (test) {
    var algorithmus,
        stellung,
        zug;

    stellung = new Stellung();
    algorithmus = new MinimaxAlgorithmus(Spielregeln, MaterialBewertung, 4);

    zug = algorithmus.ermittleZug(stellung);

    test.ok(zug !== undefined);
    test.done();
};