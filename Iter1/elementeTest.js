/**
 * Created with JetBrains WebStorm.
 * User: StefanZ
 * Date: 10.06.13
 * Time: 22:18
 * To change this template use File | Settings | File Templates.
 */

var dokchess = require("./elemente.js");

var Farbe = dokchess.Farbe;
var Figur = dokchess.Figur;
var FigurenArt = dokchess.FigurenArt;
var Feld = dokchess.Feld;
var Stellung = dokchess.Stellung;
var Zug = dokchess.Zug;

exports['Farbe'] = function (test) {
    test.equal(Farbe.andere(Farbe.WEISS), Farbe.SCHWARZ);
    test.equal(Farbe.alsBuchstabe(Farbe.WEISS), 'w');

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