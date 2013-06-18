/**
 * Created with JetBrains WebStorm.
 * User: StefanZ
 * Date: 14.06.13
 * Time: 00:00
 * To change this template use File | Settings | File Templates.
 */

var bewertung = require("./../bewertung.js");
var elemente = require("./../elemente.js");

var Stellung = elemente.Stellung;
var Farbe = elemente.Farbe;

var MaterialBewertung = bewertung.MaterialBewertung;

exports['MaterialBewertung.bewerteStellung Anfang'] = function (test) {
    var stellung = new Stellung();

    var weissWert = MaterialBewertung.bewerteStellung(stellung, Farbe.WEISS);
    var schwarzWert = MaterialBewertung.bewerteStellung(stellung, Farbe.SCHWARZ);

    test.equal(weissWert, 0);
    test.equal(schwarzWert, 0);

    test.done();
};

exports['MaterialBewertung.bewerteStellung DameMehr'] = function (test) {
    var stellung = new Stellung("7Q/7K/8/8/8/3k4/8/8 w - - 0 1");

    var weissWert = MaterialBewertung.bewerteStellung(stellung, Farbe.WEISS);
    test.ok(weissWert > 0);

    test.done();
};