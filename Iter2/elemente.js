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

/**
 * Spielerfarbe im Schach, schwarz oder weiss.
 *
 * @enum {string}
 */
var Farbe = {

    WEISS: 'w',
    SCHWARZ: 'b',

    /**
     * Liefert die jeweils andere Farbe zurueck
     *
     * @param {Farbe} f
     * @returns {Farbe}
     * @static
     */
    andere: function (f) {
        return f === Farbe.WEISS ? Farbe.SCHWARZ : Farbe.WEISS;
    }
};

/**
 * Figurenarten im Schach, davon gibt es sechs.
 *
 * @enum {string}
 */
var FigurenArt = {

    BAUER:    'p',
    SPRINGER: 'n',
    LAEUFER:  'b',
    TURM:     'r',
    DAME:     'q',
    KOENIG:   'k',

    ausBuchstabe: function (c) {
        var result,
            cLower = c.toLowerCase();
        if ('pnbrqk'.indexOf(cLower) >= 0) {
            result = cLower;
        }
        return result;
    }
};

var RochadeRecht = {
    WEISS_KURZ: 'K',
    WEISS_LANG: 'Q',
    SCHWARZ_KURZ: 'k',
    SCHWARZ_LANG: 'q'
};

function Figur(farbe, art) {
    this.farbe = farbe;
    this.art = art;
}

Figur.ausBuchstabe = function (c) {
    var art = FigurenArt.ausBuchstabe(c),
        farbe = (c === c.toUpperCase()) ? Farbe.WEISS : Farbe.SCHWARZ;
    return new Figur(farbe, art);
};

var Feld = {

    a8: 0,
    b8: 1,
    c8: 2,
    d8: 3,
    e8: 4,
    f8: 5,
    g8: 6,
    h8: 7,
    a7: 8,
    b7: 9,
    c7: 10,
    d7: 11,
    e7: 12,
    f7: 13,
    g7: 14,
    h7: 15,
    a6: 16,
    b6: 17,
    c6: 18,
    d6: 19,
    e6: 20,
    f6: 21,
    g6: 22,
    h6: 23,
    a5: 24,
    b5: 25,
    c5: 26,
    d5: 27,
    e5: 28,
    f5: 29,
    g5: 30,
    h5: 31,
    a4: 32,
    b4: 33,
    c4: 34,
    d4: 35,
    e4: 36,
    f4: 37,
    g4: 38,
    h4: 39,
    a3: 40,
    b3: 41,
    c3: 42,
    d3: 43,
    e3: 44,
    f3: 45,
    g3: 46,
    h3: 47,
    a2: 48,
    b2: 49,
    c2: 50,
    d2: 51,
    e2: 52,
    f2: 53,
    g2: 54,
    h2: 55,
    a1: 56,
    b1: 57,
    c1: 58,
    d1: 59,
    e1: 60,
    f1: 61,
    g1: 62,
    h1: 63,

    nameNachNr: function (name) {
        if (typeof (name) !== "string" || !name.match(/[a-h][1-8]/)) {
            return undefined;
        } else {
            var linie = name.charAt(0),
                reihe = name.charAt(1);
            return "abcdefgh".indexOf(linie) + (8 - reihe) * 8;
        }
    },

    nrNachName: function (nr) {
        var spalte = nr % 8,
            zeile = (nr - spalte) / 8; // ganzzahlige Division
        return "abcdefgh".charAt(spalte) + (8 - zeile);
    },

    /**
     * Berechnet die Feldnummer aus Koordinaten (Zeile und Spalte).
     *
     * @param zeile Zeile, 0-7
     * @param spalte Spalte, 0-7
     * @return die Feldnummer (0-63), oder undefined, falls die Koordniaten ausserhalb des erlaubten Bereichs
     */
    ausKoordinaten: function (zeile, spalte) {
        if (zeile < 0 || zeile > 7 || spalte < 0 || spalte > 7) {
            return undefined;
        } else {
            return zeile * 8 + spalte;
        }
    },

    ausBewegung: function (start, dx, dy) {
        var feld,
            spalte = start % 8,
            zeile = ((start - spalte)) / 8;

        spalte += dx;
        zeile += dy;

        if (!(zeile < 0 || zeile > 7 || spalte < 0 || spalte > 7)) {
            feld = zeile * 8 + spalte;
        }
        return feld;
    },

    spalte: function (feldNummer) {
        return feldNummer % 8;
    },

    zeile: function (feldNummer) {
        return ((feldNummer - (feldNummer % 8))) / 8;
    }
};

function Zug(a, b, c) {
    if (arguments.length === 3) {
        this.von = a;
        this.nach = b;
        this.umwandlung = c;
    } else if (arguments.length === 2) {
        this.von = a;
        this.nach = b;

        // TODO: Grottig!

    } else if (arguments.length === 1 && typeof a === "string") {
        if (a.length == 4 && a.match(/[a-h][1-8][a-h][1-8]/)) {
            this.von = Feld.nameNachNr(a.substr(0, 2));
            this.nach = Feld.nameNachNr(a.substr(2, 2));
        } else if (a.match(/[a-h][1-8][a-h][1-8][QBNR]/)) {
            this.von = Feld.nameNachNr(a.substr(0, 2));
            this.nach = Feld.nameNachNr(a.substr(2, 2));
            this.umwandlung = FigurenArt.ausBuchstabe(a.substr(4));
        }
    }
}

Zug.ausZeichenkette = function(s) {
    var von, nach;
    if (typeof s === "string" && s.match(/[a-h][1-8][a-h][1-8]/)) {
        von = Feld.nameNachNr(s.substr(0, 2));
        nach = Feld.nameNachNr(s.substr(2, 2));
        return new Zug(von, nach);
    } else {
        return undefined;
    }
};

Zug.prototype.toString = function() {
    var sVon, sNach, sUm;

    sVon = Feld.nrNachName(this.von);
    sNach = Feld.nrNachName(this.nach);
    sUm = (this.umwandlung == undefined) ? '' : this.umwandlung;


    return sVon + sNach + sUm;
};

function Stellung(s) {
    var zeile, i, aufstellung;

    this.brett = new Array(64);

    if (arguments.length === 0) {
        aufstellung = [ "rnbqkbnr", "pppppppp", "", "", "", "", "PPPPPPPP", "RNBQKBNR" ];
        this.amZug = Farbe.WEISS;
        this.rochadeRechte = "KQkq";

        for (zeile = 0; zeile < aufstellung.length; zeile += 1) {
            for (i = 0; i < aufstellung[zeile].length; i += 1) {
                this.brett[i + 8 * zeile] = Figur.ausBuchstabe(aufstellung[zeile].charAt(i));
            }
        }
    } else if (typeof s === "object") {
        this.amZug = s.amZug;
        this.rochadeRechte = s.rochadeRechte;
        for (i = 0; i < 64; i += 1) {
            this.brett[i] = s.brett[i];
        }
    } else if (typeof s === "string") {

        var gruppen = s.split(" "),
            reihen = gruppen[0].split("/"),
            farbe = gruppen[1],
            rochade = gruppen[2],
            enPassant = gruppen[3],
            reiheNr = 0;


        this.amZug = farbe === 'w' ? Farbe.WEISS : Farbe.SCHWARZ;
        this.rochadeRechte = rochade;
        this.enPassant = Feld.nameNachNr(enPassant);

        for (reiheNr = 0; reiheNr < 8; reiheNr += 1) {
            var reihe = reihen[reiheNr],
                spalteNr = 0;

            for (i = 0; i < reihe.length; i += 1) {
                var c = reihe[i];
                if (c.match(/[1-8]/)) {
                    for (var j=0; j < c; j += 1) {

                        var feld = Feld.ausKoordinaten(reiheNr,spalteNr);
                        this.brett[feld] = undefined;
                        spalteNr++;
                    }
                } else {
                    var feld = Feld.ausKoordinaten(reiheNr,spalteNr);
                    this.brett[feld] = Figur.ausBuchstabe(c);
                    spalteNr++;
                }
            }
        }
    }
}

Stellung.prototype.aufFeld = function (feld) {
    return this.brett[feld];
};

Stellung.prototype.fuehreZugAus = function (zug) {
    var neueStellung = new Stellung(this),
        figur = neueStellung.brett[zug.von],
        dy;

    neueStellung.amZug = Farbe.andere(this.amZug);

    neueStellung.brett[zug.nach] = figur;
    neueStellung.brett[zug.von] = undefined;

    // enPassant
    neueStellung.enPassant = undefined;
    if (figur.art === FigurenArt.BAUER) {
        if (Math.abs(Feld.zeile(zug.von) - Feld.zeile(zug.nach)) == 2) {
            dy = (this.amZug == Farbe.WEISS) ? -1 : 1
            neueStellung.enPassant = Feld.ausKoordinaten(Feld.zeile(zug.von) + dy, Feld.spalte(zug.von));
        }
    }

    // Rochade
    if (this.rochadeRechte !== '-' ) {

        if (figur.art === FigurenArt.KOENIG) {

            if (Math.abs(Feld.spalte(zug.von) - Feld.spalte(zug.nach)) == 2) {
                // Rochade durchfuehren
                if (this.amZug === Farbe.WEISS) {
                    if(zug.nach === Feld.g1) {
                        // Weiss kurz
                        neueStellung.brett[Feld.f1] = neueStellung.brett[Feld.h1];
                        neueStellung.brett[Feld.h1] = undefined;
                    } else {
                        // Weiss lang
                        neueStellung.brett[Feld.d1] = neueStellung.brett[Feld.a1];
                        neueStellung.brett[Feld.a1] = undefined;
                    }
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('K', '');
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('Q', '');
                } else {
                    if(zug.nach === Feld.g8) {
                        // Schwarz kurz
                        neueStellung.brett[Feld.f8] = neueStellung.brett[Feld.h8];
                        neueStellung.brett[Feld.h8] = undefined;
                    } else {
                        // Schwarz lang
                        neueStellung.brett[Feld.d8] = neueStellung.brett[Feld.a8];
                        neueStellung.brett[Feld.a8] = undefined;
                    }
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('k', '');
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('q', '');
                }
            } else {
                if (this.amZug === Farbe.WEISS) {
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('K', '');
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('Q', '');
                } else {
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('k', '');
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('q', '');
                }
            }
        } else if (figur.art === FigurenArt.TURM) {
            if (this.amZug === Farbe.WEISS) {
                if (zug.von === Feld.h1) {
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('K', '');
                } else  if (zug.von === Feld.h8){
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('Q', '');
                }
            } else {
                if (zug.von === Feld.a1) {
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('k', '');
                } else  if (zug.von === Feld.a8){
                    neueStellung.rochadeRechte =  neueStellung.rochadeRechte.replace('q', '');
                }

            }
        }
        if (neueStellung.rochadeRechte === '') {
            neueStellung.rochadeRechte = '-';
        }
    }

    return neueStellung;
};

Stellung.prototype.istFrei = function (feld) {
    return this.brett[feld] === undefined;
};

Stellung.prototype.findeKoenig = function (farbe) {
    var feld,
        figur;

    for (feld = 0; feld < 64; feld += 1) {
        figur = this.brett[feld];
        if (figur !== undefined && figur.art === FigurenArt.KOENIG && figur.farbe === farbe) {
            return feld;
        }
    }
    return undefined;
};

if (typeof module !== 'undefined' && module.exports) {
    exports.Farbe = Farbe;
    exports.FigurenArt = FigurenArt;
    exports.Figur = Figur;
    exports.Feld = Feld;
    exports.Zug = Zug;
    exports.Stellung = Stellung;
}