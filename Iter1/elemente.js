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

    nameNachNr: function (name) {
        if (typeof name !== "string" || !name.match(/[a-h][1-8]/)) {
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

function Zug(a, b) {
    if (arguments.length === 2) {
        this.von = a;
        this.nach = b;
    } else if (arguments.length === 1 && typeof a !== "string") {
        this.von = Feld.nameNachNr(a.substr(0, 2));
        this.nach = Feld.nameNachNr(a.substr(2, 2));
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

Zug.prototype.nachZeichenkette = function () {
    var sVon, sNach;

    sVon = Feld.nrNachName(this.von);
    sNach = Feld.nrNachName(this.nach);

    return sVon + sNach;
};

function Stellung(s) {
    var zeile, i, aufstellung;

    this.brett = new Array(64);

    if (arguments.length === 0) {
        aufstellung = [ "rnbqkbnr", "pppppppp", "", "", "", "", "PPPPPPPP", "RNBQKBNR" ];
        this.amZug = Farbe.WEISS;

        for (zeile = 0; zeile < aufstellung.length; zeile += 1) {
            for (i = 0; i < aufstellung[zeile].length; i += 1) {
                this.brett[i + 8 * zeile] = Figur.ausBuchstabe(aufstellung[zeile].charAt(i));
            }
        }
    } else if (typeof s === "object") {
        this.amZug = s.amZug;
        for (i = 0; i < 64; i += 1) {
            this.brett[i] = s.brett[i];
        }
    }
}

Stellung.prototype.aufFeld = function (feld) {
    return this.brett[feld];
};

Stellung.prototype.fuehreZugAus = function (zug) {
    var neueStellung = new Stellung(this);
    neueStellung.amZug = Farbe.andere(this.amZug);

    neueStellung.brett[zug.nach] = neueStellung.brett[zug.von];
    neueStellung.brett[zug.von] = undefined;

    return neueStellung;
};

Stellung.prototype.istFrei = function (feld) {
    return this.brett[feld] === undefined;
};

if (typeof module !== 'undefined' && module.exports) {
    exports.Farbe = Farbe;
    exports.FigurenArt = FigurenArt;
    exports.Figur = Figur;
    exports.Feld = Feld;
    exports.Zug = Zug;
    exports.Stellung = Stellung;
}