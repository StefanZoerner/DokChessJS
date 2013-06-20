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

/**
 * Die verschiedenen Rochaderechte.
 *
 * @enum {string}
 */
var RochadeRecht = {
    WEISS_KURZ: 'K',
    WEISS_LANG: 'Q',
    SCHWARZ_KURZ: 'k',
    SCHWARZ_LANG: 'q'
};

/**
 * Spielfigur im Schach.
 *
 * @param {Farbe} farbe die Farbe, z.B. schwarz
 * @param {FigurenArt} art die Art, z.B. Bauer
 * @constructor
 */
function Figur(farbe, art) {
    this.farbe = farbe;
    this.art = art;
}

/**
 * Erzeugt eine Figur aus der in FEN ueblichen Buchstabennotation. Kleine Buchstaben stehen fuer schwarze Figuren,
 * grosse fuer weisse. 'K' ist z.B. der weisse Koenig.
 *
 * @static
 * @param c
 * @returns {Figur}
 */
Figur.ausBuchstabe = function (c) {
    var art = FigurenArt.ausBuchstabe(c),
        farbe = (c === c.toUpperCase()) ? Farbe.WEISS : Farbe.SCHWARZ;
    return new Figur(farbe, art);
};

/**
 * Liefert die in FEN uebliche Buchstabennotation der Figur, 'K' ist z.B. der weisse Koenig, 'k' der schwarze.
 *
 * @returns {string}
 */
Figur.prototype.toString = function () {
    return this.farbe === Farbe.WEISS ? this.art.toUpperCase() : this.art;
};

/*  Die Felder des Bretts werden durch Zahlen 0 - 63 repraesentiert. Hier sind einige Hilfsfunktionen zusammengefasst.
 */
var Feld = {

    // Konstanten fuer die Felder, zur leichten Verwendung z.B. in Unit-Tsets
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


    /**
     * Wandelt ein Feld aus Zeichenkette, z.B. "e4" in eine Nummer um.
     *
     * @param {string} name Name des Feldes
     * @returns {number} Nummer des Feldes, oder undefined falls kein gueltiger Name
     */
    nameNachNr: function (name) {
        var nr, linie, reihe;

        if (typeof name === "string" && name.match(/[a-h][1-8]/)) {
            linie = name.charAt(0);
            reihe = name.charAt(1);
            nr = "abcdefgh".indexOf(linie) + (8 - reihe) * 8;
        }
        return nr;
    },

    /**
     * Berechnet aus der Nummer den Namen des Feldes.
     *
     * @param {number} nr Nummer des Feldes
     * @returns {string}
     */
    nrNachName: function (nr) {
        var spalte = nr % 8,
            zeile = (nr - spalte) / 8; // ganzzahlige Division
        return "abcdefgh".charAt(spalte) + (8 - zeile);
    },

    /**
     * Berechnet die Feldnummer aus Koordinaten (Zeile und Spalte).
     *
     * @param {number} zeile Zeile, 0-7
     * @param {number} spalte Spalte, 0-7
     * @return {number} die Feldnummer (0-63), oder undefined, falls die Koordniaten ausserhalb des erlaubten Bereichs
     */
    ausKoordinaten: function (zeile, spalte) {
        var nr;
        if (zeile >= 0 && zeile <= 7 && spalte >= 0 && spalte <= 7) {
            nr = zeile * 8 + spalte;
        }
        return nr;
    },

    /**
     * Ermittelt aus einem Startfeld und einem Richtungsvektor (dx, dy) ein neues Feld.
     *
     * @param {number} start Startfeld
     * @param {number} dx Richtung x
     * @param {number} dy  Richtung y
     * @returns {number} Nr. des Feldes, oder undefines wenn ausserhalb des Brettes
     */
    ausBewegung: function (start, dx, dy) {
        var feld,
            spalte = start % 8,
            zeile = ((start - spalte)) / 8;

        spalte += dx;
        zeile += dy;

        if (zeile >= 0 && zeile <= 7 && spalte >= 0 && spalte <= 7) {
            feld = zeile * 8 + spalte;
        }
        return feld;
    },

    /**
     * Liefert die Spaltennummer zu einem Feld.
     *
     * @param {number} feldNummer
     * @returns {number}
     */
    spalte: function (feldNummer) {
        return feldNummer % 8;
    },

    /**
     * Liefert die Zeilennummer zu einem Feld.
     *
     * @param {number} feldNummer
     * @returns {number}
     */
    zeile: function (feldNummer) {
        return ((feldNummer - (feldNummer % 8))) / 8;
    }
};

/**
 * Bewegung einer Figur im Schach.

 * @constructor
 */
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
        if (a.length === 4 && a.match(/[a-h][1-8][a-h][1-8]/)) {
            this.von = Feld.nameNachNr(a.substr(0, 2));
            this.nach = Feld.nameNachNr(a.substr(2, 2));
        } else if (a.match(/[a-h][1-8][a-h][1-8][QBNR]/)) {
            this.von = Feld.nameNachNr(a.substr(0, 2));
            this.nach = Feld.nameNachNr(a.substr(2, 2));
            this.umwandlung = FigurenArt.ausBuchstabe(a.substr(4));
        }
    }
}

/**
 * Erzeugt einen Zug aus einer Zeichenkette
 *
 * @static
 * @param {String} s Zug als Zeichenkette
 * @returns {Zug} den Zug falls gueltig, oder undefined
 */
Zug.ausZeichenkette = function (s) {
    var von, nach, umwandlung, zug;
    if (typeof s === "string") {
        if (s.length === 4 && s.match(/[a-h][1-8][a-h][1-8]/)) {
            von = Feld.nameNachNr(s.substr(0, 2));
            nach = Feld.nameNachNr(s.substr(2, 2));
            zug = new Zug(von, nach);
        } else if (s.length === 5 && s.match(/[a-h][1-8][a-h][1-8][QBNR]/)) {
            von = Feld.nameNachNr(s.substr(0, 2));
            nach = Feld.nameNachNr(s.substr(2, 2));
            umwandlung =  FigurenArt.ausBuchstabe(s.substr(4));
            zug = new Zug(von, nach, umwandlung);
        }
    }

    return zug;
};

/**
 * Liefert den Zug als Zeichenkette zurueck, z.B. "e2e4"
 *
 * @returns {String}
 */
Zug.prototype.toString = function () {
    var sVon, sNach, sUm;

    sVon = Feld.nrNachName(this.von);
    sNach = Feld.nrNachName(this.nach);
    sUm = (this.umwandlung === undefined) ? '' : this.umwandlung;


    return sVon + sNach + sUm;
};

/**
 * Eine Stellung repraesentiert die Spielsituation. Fuer den ersten Wurf reicht es zu wissen wo die Figuren stehen,
 * und wer am Zug ist.
 *
 * @param s andere Stellung (dann wird kopiert), oder nichts.
 * @constructor
 */
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

/**
 * Liefert die Figur zurueck, die auf dem Feld steht. Oder undefined, falls das Feld frei ist.
 *
 * @param feld
 * @returns {Figur} die Figur auf dem Feld oder undefined
 */
Stellung.prototype.aufFeld = function (feld) {
    return this.brett[feld];
};

/**
 * Fuehrt den Zug aus, und liefert eine neue Stellung zurueck. Die Stellung selbst bleibt dabei unveraendert.
 *
 * @param zug
 * @returns {Stellung}
 */
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

/**
 * Liefert die Stellung als Zeichenkette in FEN-Notation zurueck.
 *
 * @returns {string}
 */
Stellung.prototype.toString = function () {
    var result = '',
        zeile,
        spalte,
        feld,
        figur,
        leer;

    leer = 0;
    for (zeile = 0; zeile < 8; zeile += 1) {
        for (spalte = 0; spalte < 8; spalte += 1) {
            feld = Feld.ausKoordinaten(zeile,spalte);
            figur = this.brett[feld];
            if (figur === undefined) {
                leer += 1;
            } else {
                result += figur.toString();
                if (leer > 0) {
                    result += leer;
                    leer = 0;
                }
            }
        }
        if (leer > 0) {
            result += leer;
            leer = 0;
        }
        if (zeile < 7) {
            result += '/'
        }
    }

    result += ' ';
    result += this.amZug;
    result += ' ';
    result += this.rochadeRechte;
    result += ' ';
    result += this.enPassant === undefined ? '-' : Feld.nrNachName(this.enPassant);
    result += ' 0 1';

    return result;
}

/**
 * Prueft, ob das Feld frei ist, also keine Figur dort steht.
 *
 * @param feld
 * @returns {boolean}
 */
Stellung.prototype.istFrei = function (feld) {
    return this.brett[feld] === undefined;
};

/**
 * Liefert das Feld zurueck, auf dem der Koenig der angegebenen Farbe steht.
 *
 * @param {Farbe} farbe
 * @returns {*}
 */
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