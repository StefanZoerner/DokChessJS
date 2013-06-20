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

var dokchess = require("./../elemente.js");

var Farbe = dokchess.Farbe;
var Figur = dokchess.Figur;
var FigurenArt = dokchess.FigurenArt;
var Feld = dokchess.Feld;
var Stellung = dokchess.Stellung;
var Zug = dokchess.Zug;

exports['Farbe'] = function (test) {
    test.equal(Farbe.andere(Farbe.WEISS), Farbe.SCHWARZ);
    test.done();
};

exports['FigurenArt'] = function (test) {

    test.equal(FigurenArt.ausBuchstabe('p'), FigurenArt.BAUER);
    test.equal(FigurenArt.ausBuchstabe('P'), FigurenArt.BAUER);
    test.equal(FigurenArt.ausBuchstabe('r'), FigurenArt.TURM);
    test.equal(FigurenArt.ausBuchstabe('K'), FigurenArt.KOENIG);

    test.done();
};

exports['Figur'] = function (test) {

    var weisserBauer = new Figur(Farbe.WEISS, FigurenArt.BAUER);

    var schwarzerTurm = Figur.ausBuchstabe('r');
    test.equal(schwarzerTurm.art, FigurenArt.TURM);
    test.equal(schwarzerTurm.farbe, Farbe.SCHWARZ);

    test.done();
};

exports['Zug'] = function (test) {

    var zug = new Zug("e2e4");

    test.done();
};

exports['Stellung.anfang'] = function (test) {

    var anfang = new Stellung();
    test.equal(anfang.amZug, Farbe.WEISS);

    var weisserBauer = new Figur(Farbe.WEISS, FigurenArt.BAUER);
    var schwarzerTurm = Figur.ausBuchstabe('r');

    test.deepEqual(anfang.aufFeld(Feld.nameNachNr("e2")), weisserBauer);
    test.deepEqual(anfang.aufFeld(Feld.nameNachNr("a8")), schwarzerTurm);

    test.done();
};

exports['Stellung.fuehreZugAus'] = function (test) {

    var weisserBauer = new Figur(Farbe.WEISS, FigurenArt.BAUER);
    var zug = new Zug(Feld.nameNachNr('e2'), Feld.nameNachNr('e4'));

    var anfang = new Stellung();
    var neueStellung = anfang.fuehreZugAus(zug);

    test.equal(neueStellung.amZug, Farbe.SCHWARZ);
    test.deepEqual(neueStellung.aufFeld(Feld.nameNachNr("e2")), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.nameNachNr("e4")), weisserBauer);

    test.done();
};


exports['Feld.nameNachNr'] = function (test) {

    test.equal(Feld.nameNachNr('a8'), 0);
    test.equal(Feld.nameNachNr('h8'), 7);
    test.equal(Feld.nameNachNr('a1'), 56);
    test.equal(Feld.nameNachNr('h1'), 63);

    test.done();
};