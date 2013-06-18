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
    test.equal(zug.von, Feld.nameNachNr("e2"));
    test.equal(zug.nach, Feld.nameNachNr("e4"));
    test.equal(zug.umwandlung, undefined);

    zug = new Zug("a7a8Q");
    test.equal(zug.von, Feld.nameNachNr("a7"));
    test.equal(zug.nach, Feld.nameNachNr("a8"));
    test.equal(zug.umwandlung, FigurenArt.DAME);

    test.done();
};

exports['Stellung.ausFEN'] = function (test) {
    var fen = "4k3/8/8/3Pp3/8/8/8/K7 w - e6 0 1";
    var stellung = new Stellung(fen);

    test.equal(stellung.amZug, Farbe.WEISS);
    test.equal(stellung.enPassant, Feld.nameNachNr("e6"));


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

exports['Stellung.findeKoenig'] = function (test) {

    var anfang = new Stellung();

    var koenigWeiss = anfang.findeKoenig(Farbe.WEISS);
    var koenigSchwarz = anfang.findeKoenig(Farbe.SCHWARZ);

    test.equal(koenigWeiss, Feld.nameNachNr("e1"));
    // test.equal(koenigSchwarz, Feld.nameNachNr("e8"));

    test.done();
};

exports['Stellung.fuehreZugAus.e2e4'] = function (test) {

    var weisserBauer = new Figur(Farbe.WEISS, FigurenArt.BAUER),
        zug = new Zug(Feld.e2, Feld.e4),
        anfang = new Stellung(),
        neueStellung = anfang.fuehreZugAus(zug);

    test.equal(neueStellung.amZug, Farbe.SCHWARZ);
    test.deepEqual(neueStellung.aufFeld(Feld.e2), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.e4), weisserBauer);
    test.equal(neueStellung.enPassant, Feld.e3);

    test.done();
};

exports['Stellung.fuehreZugAus.rochadeSchwarzKurz'] = function (test) {

    var schwarzerKoenig = new Figur(Farbe.SCHWARZ, FigurenArt.KOENIG),
        schwarzerTurm = new Figur(Farbe.SCHWARZ, FigurenArt.TURM),
        zug = new Zug(Feld.e8, Feld.g8),
        anfang = new Stellung("r3k2r/p6p/4K3/8/8/8/8/2Q5 b kq - 0 1"),
        neueStellung = anfang.fuehreZugAus(zug);

    test.equal(neueStellung.amZug, Farbe.WEISS);
    test.deepEqual(neueStellung.aufFeld(Feld.e8), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.g8), schwarzerKoenig);
    test.deepEqual(neueStellung.aufFeld(Feld.h8), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.f8), schwarzerTurm);

    test.equal(neueStellung.rochadeRechte, '-');

    test.done();
};

exports['Stellung.fuehreZugAus.rochadeWeissKurz'] = function (test) {

    var weisserKoenig = new Figur(Farbe.WEISS, FigurenArt.KOENIG),
        weisserTurm = new Figur(Farbe.WEISS, FigurenArt.TURM),
        zug = new Zug(Feld.e1, Feld.g1),
        anfang = new Stellung("8/8/8/8/8/4k3/P6P/R3K2R w K - 0 1"),
        neueStellung = anfang.fuehreZugAus(zug);

    test.equal(neueStellung.amZug, Farbe.SCHWARZ);
    test.deepEqual(neueStellung.aufFeld(Feld.e1), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.g1), weisserKoenig);
    test.deepEqual(neueStellung.aufFeld(Feld.h1), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.f1), weisserTurm);

    test.equal(neueStellung.rochadeRechte, '-');

    test.done();
};

exports['Stellung.fuehreZugAus.rochadeRechteTurm'] = function (test) {

    var zug = new Zug(Feld.a8, Feld.b8),
        anfang = new Stellung("r1bqkbnr/pppppppp/2n5/3N4/8/8/PPPPPPPP/R1BQKBNR b KQkq - 0 1"),
        neueStellung = anfang.fuehreZugAus(zug);

    test.equal(neueStellung.amZug, Farbe.WEISS);
    test.deepEqual(neueStellung.aufFeld(Feld.a8), undefined);
    test.deepEqual(neueStellung.aufFeld(Feld.b8), new Figur(Farbe.SCHWARZ, FigurenArt.TURM));
    test.equal(neueStellung.rochadeRechte, 'KQk');

    test.done();
};



exports['Feld.nameNachNr'] = function (test) {

    test.equal(Feld.nameNachNr('a8'), 0);
    test.equal(Feld.nameNachNr('h8'), 7);
    test.equal(Feld.nameNachNr('a1'), 56);
    test.equal(Feld.nameNachNr('h1'), 63);

    test.done();
};

exports['Feld.ausBewegung'] = function (test) {

    var e2 = Feld.nameNachNr('e2');
    test.equal(Feld.ausBewegung(e2, 0, -1), Feld.nameNachNr('e3'));

    test.done();
};