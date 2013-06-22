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

var tools = require("./../tools.js");
var forEach = tools.forEach;
var contains = tools.contains;


var elemente = require("./../elemente.js");
var regeln = require("./../spielregeln.js");

var Stellung = elemente.Stellung;
var Zug = elemente.Zug;
var Farbe = elemente.Farbe;
var Spielregeln = regeln.Spielregeln;

function testeSpielregelnMitFEN(test, fen, erwarteteZuege) {
    var stellung = new Stellung(fen),
        zuege = Spielregeln.ermittelGueltigeZuege(stellung),
        i,
        j,
        zug,
        gefunden;

    test.equal(zuege.length, erwarteteZuege.length);

    for (i = 0; i < zuege.length; i += 1) {
        zuege[i] = zuege[i].toString();
    }

    forEach(erwarteteZuege, function (zug) {
        test.ok(contains(zuege, zug), "Wurde erwarteter Zug " + zug + " ermittelt?");
    });

    forEach(zuege, function (zug) {
        test.ok(contains(erwarteteZuege, zug), "Wurde ermittelter Zug " + zug + " erwartet?");
    });
}

exports['Spielregeln.ermittelGueltigeZuege.anfang'] = function (test) {
    var anfang = new Stellung(),
        zuege = Spielregeln.ermittelGueltigeZuege(anfang);
    test.equal(zuege.length, 20);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege.KoenigInOpposition'] = function (test) {
    var fen, stellung, zuege, i;

    // Schwarzer Koenig in Opposition, weiss am Zug
    fen = '8/3k4/8/3K4/8/8/8/8 w - - 1 1';
    stellung = new Stellung(fen);
    zuege = Spielregeln.ermittelGueltigeZuege(stellung);

    test.equal(zuege.length, 5);
    for (i = 0; i < zuege.length; i += 1) {
        zuege[i] = zuege[i].toString();
    }
    test.ok(!contains(zuege, "d5d6"));
    test.ok(contains(zuege, "d5e5"));

    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Bauernzuege R101'] = function (test) {
    var fen = "2k5/8/8/8/8/3p4/2P5/7K w - - 0 1",
        erwarteteZuege = ["c2c3", "c2c4", "c2d3", "h1g1", "h1g2", "h1h2"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Bauernzuege R102'] = function (test) {
    var fen = "k7/p7/2p5/4p1p1/5P2/8/8/K7 b - - 0 1",
        erwarteteZuege = ["a7a5", "a7a6", "a8b7", "a8b8", "c6c5", "e5e4", "e5f4", "g5f4", "g5g4"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Bauernzuege R103'] = function (test) {
    var fen = "4k3/8/8/3Pp3/8/8/8/K7 w - e6 0 1",
        erwarteteZuege = ["a1a2", "a1b1", "a1b2", "d5d6", "d5e6"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Bauernzuege R104'] = function (test) {
    var fen = "4k3/8/8/8/5pPp/8/8/7K b - g3 0 1",
        erwarteteZuege = ["e8d7", "e8d8", "e8e7", "e8f7", "e8f8", "f4f3", "f4g3", "h4g3", "h4h3"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Bauernzuege R105'] = function (test) {
    var fen = "3rk3/P3P3/8/8/8/8/8/K7 w - - 0 1",
        erwarteteZuege = ["a7a8q", "a7a8r", "a7a8b", "a7a8n", "e7d8q", "e7d8r", "e7d8b", "e7d8n", "a1a2", "a1b1", "a1b2"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Bauernzuege R106'] = function (test) {
    var fen = "k7/8/8/8/8/8/4p3/K2R1R2 b - - 0 1",
        erwarteteZuege = ["a8a7", "a8b7", "a8b8", "e2d1b", "e2d1n", "e2d1q", "e2d1r", "e2e1b", "e2e1n", "e2e1q",
            "e2e1r", "e2f1b", "e2f1n", "e2f1q", "e2f1r"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Springerzuege R201'] = function (test) {
    var fen = "k7/8/8/8/3p4/5N2/7P/7K w - - 0 1",
        erwarteteZuege = ["h2h3", "h2h4", "f3d2", "f3d4", "f3e1", "f3e5", "f3g1", "f3g5", "f3h4", "h1g1", "h1g2"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Springerzuege R202'] = function (test) {
    var fen = "k7/n7/8/1P6/8/8/8/7K b - - 0 1",
        erwarteteZuege = ["a7b5", "a7c6", "a7c8", "a8b7", "a8b8"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Laeuferzuege R301'] = function (test) {
    var fen = "k7/2p5/8/4B3/8/8/8/K7 w - - 0 1",
        erwarteteZuege = ["e5b2", "e5c3", "e5c7", "e5d4", "e5d6", "e5f4", "e5f6", "e5g3", "e5g7", "e5h2",
            "e5h8", "a1a2", "a1b1", "a1b2"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Laeuferzuege R302'] = function (test) {
    var fen = "k7/8/8/6b1/8/4P3/8/7K b - - 0 1",
        erwarteteZuege = ["g5d8", "g5e3", "g5e7", "g5f4", "g5f6", "g5h4", "g5h6", "a8a7", "a8b7", "a8b8"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Turmzuege R401'] = function (test) {
    var fen = "k7/3p4/8/8/8/8/3R4/3K4 w - - 0 1",
        erwarteteZuege = ["d2a2", "d2b2", "d2c2", "d2d3", "d2d4", "d2d5", "d2d6", "d2d7", "d2e2", "d2f2", "d2g2",
            "d2h2", "d1c1", "d1c2", "d1e1", "d1e2"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Turmzuege R402'] = function (test) {
    var fen = "k2r4/8/8/8/3r2P1/8/8/K2R4 b - - 0 1",
        erwarteteZuege = ["d4a4", "d4b4", "d4c4", "d4d1", "d4d2", "d4d3", "d4d5", "d4d6", "d4d7", "d4e4", "d4f4",
            "d4g4", "d8b8", "d8c8", "d8d5", "d8d6", "d8d7", "d8e8", "d8f8", "d8g8", "d8h8", "a8a7", "a8b7", "a8b8"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Damenzuege R501'] = function (test) {
    var fen = "1k6/1p6/2p3p1/8/4Q3/8/8/4K3 w - - 0 1",
        erwarteteZuege = ["e4a4", "e4b1", "e4b4", "e4c2", "e4c4", "e4c6", "e4d3", "e4d4", "e4d5", "e4e2", "e4e3",
            "e4e5", "e4e6", "e4e7", "e4e8", "e4f3", "e4f4", "e4f5", "e4g2", "e4g4", "e4g6", "e4h1", "e4h4", "e1d1",
            "e1d2", "e1e2", "e1f1", "e1f2"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Damenzuege R502'] = function (test) {
    var fen = "8/1k6/8/8/4q3/8/6P1/K3R3 b - - 0 1",
        erwarteteZuege = ["e4a4", "e4b1", "e4b4", "e4c2", "e4c4", "e4c6", "e4d3", "e4d4", "e4d5", "e4e1", "e4e2",
            "e4e3", "e4e5", "e4e6", "e4e7", "e4e8", "e4f3", "e4f4", "e4f5", "e4g2", "e4g4", "e4g6", "e4h4", "e4h7",
            "b7a6", "b7a7", "b7a8", "b7b6", "b7b8", "b7c6", "b7c7", "b7c8"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Koenigszuege R601'] = function (test) {
    var fen = "8/6k1/8/4r3/3KP3/8/8/8 w - - 0 1",
        erwarteteZuege = ["d4c3", "d4c4", "d4d3", "d4e3", "d4e5"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Koenigszuege R602'] = function (test) {
    var fen = "8/8/p7/k7/N7/8/8/7K b - - 0 1",
        erwarteteZuege = ["a5a4", "a5b4", "a5b5"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Koenigszuege R603'] = function (test) {
    var fen = "8/8/8/3k4/8/3K4/7p/8 w - - 0 1",
        erwarteteZuege = ["d3c2", "d3c3", "d3d2", "d3e2", "d3e3"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Koenigszuege R604'] = function (test) {
    var fen = "8/8/7R/3k4/8/3P4/7B/7K b - - 0 1",
        erwarteteZuege = ["d5d4", "d5c5"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Koenigszuege R605'] = function (test) {
    var fen = "7k/8/5pp1/8/7K/r7/8/8 w - - 0 1",
        erwarteteZuege = ["h4g4"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Rochade R701'] = function (test) {
    var fen = "8/8/8/8/8/4k3/P6P/R3K2R w K - 0 1",
        erwarteteZuege = ["a1b1", "a1c1", "a1d1", "a2a3", "a2a4", "e1d1", "e1f1", "e1g1", "h1f1", "h1g1", "h2h3", "h2h4"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Rochade R702'] = function (test) {
    var fen = "r3k2r/p6p/4K3/8/8/8/8/8 b q - 0 1",
        erwarteteZuege = ["a7a5", "a7a6", "a8b8", "a8c8", "a8d8", "e8c8", "e8d8", "e8f8", "h7h5", "h7h6",
            "h8f8", "h8g8"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Rochade R703'] = function (test) {
    var fen = "8/8/8/8/8/4k3/P6P/R3K1NR w KQ - 0 1",
        erwarteteZuege = ["a1b1", "a1c1", "a1d1", "a2a3", "a2a4", "e1c1", "e1d1", "e1f1", "g1e2", "g1f3", "g1h3",
            "h2h3", "h2h4"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege() Rochade R704'] = function (test) {
    var fen = "r3k2r/p6p/4K3/8/8/8/8/2Q5 b kq - 0 1",
        erwarteteZuege = ["a7a5", "a7a6", "a8b8", "a8c8", "a8d8", "e8d8", "e8f8", "e8g8", "h7h5", "h7h6", "h8f8",
            "h8g8"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Grundstellung R901'] = function (test) {
    var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        erwarteteZuege = ["a2a3", "a2a4", "b1a3", "b1c3", "b2b3", "b2b4", "c2c3", "c2c4", "d2d3", "d2d4", "e2e3",
            "e2e4", "f2f3", "f2f4", "g1f3", "g1h3", "g2g3", "g2g4", "h2h3", "h2h4"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};

exports['Spielregeln.ermittelGueltigeZuege(), Grundstellung R902'] = function (test) {
    var fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
        erwarteteZuege = ["a7a5", "a7a6", "b7b5", "b7b6", "b8a6", "b8c6", "c7c5", "c7c6", "d7d5", "d7d6", "e7e5",
            "e7e6", "f7f5", "f7f6", "g7g5", "g7g6", "g8f6", "g8h6", "h7h5", "h7h6"];
    testeSpielregelnMitFEN(test, fen, erwarteteZuege);
    test.done();
};