/**
 * Created with JetBrains WebStorm.
 * User: StefanZ
 * Date: 11.06.13
 * Time: 23:10
 * To change this template use File | Settings | File Templates.
 */

process.stdin.resume();
process.stdin.setEncoding('utf8');

var schachdomaene = require("./elemente.js");

var Stellung = schachdomaene.Stellung;
var Zug = schachdomaene.Zug;
var FigurenArt = schachdomaene.FigurenArt;
var Feld = schachdomaene.Feld;
var Farbe = schachdomaene.Farbe;

var stellung = new Stellung();

function findeBauernZugMitEinemFeldFrei(stellung) {
    var farbe, i, figur, zeile, spalte, dy, ziel;

    for (i = 0; i < 64; i += 1) {
        if (! stellung.istFrei(i)) {
            figur = stellung.brett[i];
            if ( figur.farbe === stellung.amZug && figur.art === FigurenArt.BAUER) {
                zeile = Feld.zeile(i);
                spalte = Feld.spalte(i);

                dy = (farbe === Farbe.WEISS) ? -1 : 1;
                ziel = Feld.ausKoordinaten(zeile + dy, spalte);
                if (stellung.istFrei(ziel)) {
                    return new Zug(i, ziel);
                }
            }
        }
    }
}

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

        zug = findeBauernZugMitEinemFeldFrei(stellung);

        console.log('move ' + zug.nachZeichenkette());

        stellung = stellung.fuehreZugAus(zug);

    }

});

