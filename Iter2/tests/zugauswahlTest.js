/**
 * Created with JetBrains WebStorm.
 * User: StefanZ
 * Date: 14.06.13
 * Time: 00:00
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var elemente = require("./../elemente.js");
var Stellung = elemente.Stellung;

var zugauswahl = require("./../zugauswahl.js");
var EinfacheZugauswahl = zugauswahl.EinfacheZugauswahl;

exports['EinfacheZugauswahl.ermittleZug Anfang'] = function (test) {
    var stellung = new Stellung(),
        zug;

    zug = EinfacheZugauswahl.ermittleZug(stellung);
    test.ok(zug !== undefined);

    test.done();
};