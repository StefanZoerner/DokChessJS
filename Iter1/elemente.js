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

/*  Die Felder des Bretts werden durch Zahlen 0 - 63 repraesentiert. Hier sind einige Hilfsfunktionen zusammengefasst.
 */
var Feld = {

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
 *
 * @param {Feld} von
 * @param {Feld} nach
 * @constructor
 */
function Zug(von, nach) {
    if (arguments.length === 2) {
        this.von = von;
        this.nach = nach;
    } else if (arguments.length === 1 && typeof von !== "string") {
        this.von = Feld.nameNachNr(von.substr(0, 2));
        this.nach = Feld.nameNachNr(von.substr(2, 2));
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
    var von,
        nach,
        zug;

    if (typeof s === "string" && s.match(/[a-h][1-8][a-h][1-8]/)) {
        von = Feld.nameNachNr(s.substr(0, 2));
        nach = Feld.nameNachNr(s.substr(2, 2));
        zug = new Zug(von, nach);
    }

    return zug;
};

/**
 * Liefert den Zug als Zeichenkette zurueck, z.B. "e2e4"
 *
 * @returns {String}
 */
Zug.prototype.toString = function () {
    var sVon, sNach;

    sVon = Feld.nrNachName(this.von);
    sNach = Feld.nrNachName(this.nach);

    return sVon + sNach;
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
    var neueStellung = new Stellung(this);
    neueStellung.amZug = Farbe.andere(this.amZug);

    neueStellung.brett[zug.nach] = neueStellung.brett[zug.von];
    neueStellung.brett[zug.von] = undefined;

    return neueStellung;
};

/**
 * Prueft, ob das Feld frei ist, also keine Figur dort steht.
 *
 * @param feld
 * @returns {boolean}
 */
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