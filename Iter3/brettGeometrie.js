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

var elemente = require("./elemente.js");

var Farbe = elemente.Farbe;
var FigurenArt = elemente.FigurenArt;
var Feld = elemente.Feld;
var Figur = elemente.Figur;
var Zug = elemente.Zug;

var tools = require("./tools.js");
var forEach = tools.forEach;


/**
 * Beinhaltet Funktionalitaet zur Brettgeometrie, also etwa die von einem Feld aus grundsaetzlich (unabhaengig von
 * einer Stellung) mit verschiedenen Gangarten erreichbaren Felder.
 */
var BrettGeometrie = {

    // Behaelter fuer vorberechnete Werte
    springerErreichbareFelder : new Array(64),
    geradeStreckenVonFeld: new Array(64),
    schraegeStreckenVonFeld: new Array(64),
    geradeUndSchraegeStreckenVonFeld: new Array(64),
    koenigErreichbareFelder : new Array(64),

    vorberechnen : function () {
        var feld;

        for (feld = 0; feld < 64; feld += 1) {
            BrettGeometrie.springerErreichbareFelder[feld] = BrettGeometrie.mitSpringerErreichbareFelderBerechnen(feld);
            BrettGeometrie.geradeStreckenVonFeld[feld] = BrettGeometrie.geradeStreckenVonFeldAusBerechnen(feld);
            BrettGeometrie.schraegeStreckenVonFeld[feld] = BrettGeometrie.schraegeStreckenVonFeldAusBerechnen(feld);
            BrettGeometrie.geradeUndSchraegeStreckenVonFeld[feld] = BrettGeometrie.geradeUndSchraegeStreckenVonFeldAusBerechnen(feld);
            BrettGeometrie.koenigErreichbareFelder[feld] = BrettGeometrie.mitKoenigErreichbareFelderBerechnen(feld);
        }
    },

    /**
     * Liefert zu einem Feld die Liste aller Felder zurueck, die mit der Gangart des Springers von dort erreicht
     * werden koennen.
     */
    mitSpringerErreichbareFelder: function (feld) {
        return BrettGeometrie.springerErreichbareFelder[feld];
    },

    /**
     * Liefert zu einem Feld die Liste aller Felder zurueck, die mit der Gangart des Koenig von dort erreicht
     * werden koennen.
     */
    mitKoenigErreichbareFelder: function (feld) {
        return BrettGeometrie.koenigErreichbareFelder[feld];
    },

    geradeStreckenVonFeldAus: function (feld) {
        return BrettGeometrie.geradeStreckenVonFeld[feld];
    },

    schraegeStreckenVonFeldAus: function (feld) {
        return BrettGeometrie.schraegeStreckenVonFeld[feld];
    },

    geradeUndSchraegeStreckenVonFeldAus: function (feld) {
        return BrettGeometrie.geradeUndSchraegeStreckenVonFeld[feld];
    },

    mitSpringerErreichbareFelderBerechnen: function (feld) {

        var felder = [],
            zielFeld,
            dx,
            dy;

        for (dx = 2; dx >= -2; dx -= 1) {
            for (dy = -2; dy <= 2; dy += 1) {
                if (Math.abs(dx) + Math.abs(dy) === 3) {
                    zielFeld = Feld.ausBewegung(feld, dx, dy);
                    if (zielFeld !== undefined) {
                        felder.push(zielFeld);
                    }
                }
            }
        }
        return felder;
    },

    geradeStreckenVonFeldAusBerechnen: function (feld) {
        var strecken = [],
            strecke,
            zielFeld,
            dx,
            dy;

        for (dx = -1; dx <= 1; dx += 1) {
            for (dy = -1; dy <= 1; dy += 1) {
                if (Math.abs(dx) + Math.abs(dy) === 1) {
                    strecke = [];
                    zielFeld = feld;
                    do {
                        zielFeld = Feld.ausBewegung(zielFeld, dx, dy);
                        if (zielFeld !== undefined) {
                            strecke.push(zielFeld);
                        }
                    } while (zielFeld !== undefined);
                    if (strecke.length > 0) {
                        strecken.push(strecke);
                    }
                }
            }
        }

        return strecken;
    },

    schraegeStreckenVonFeldAusBerechnen: function (feld) {
        var strecken = [],
            strecke,
            zielFeld,
            dx,
            dy;

        for (dx = -1; dx <= 1; dx += 1) {
            for (dy = -1; dy <= 1; dy += 1) {
                if (Math.abs(dx) + Math.abs(dy) === 2) {
                    strecke = [];
                    zielFeld = feld;
                    do {
                        zielFeld = Feld.ausBewegung(zielFeld, dx, dy);
                        if (zielFeld !== undefined) {
                            strecke.push(zielFeld);
                        }
                    } while (zielFeld !== undefined);
                    if (strecke.length > 0) {
                        strecken.push(strecke);
                    }
                }
            }
        }

        return strecken;
    },

    geradeUndSchraegeStreckenVonFeldAusBerechnen: function (feld) {
        var strecken = [],
            strecke,
            zielFeld,
            dx,
            dy;

        for (dx = -1; dx <= 1; dx += 1) {
            for (dy = -1; dy <= 1; dy += 1) {
                if (Math.abs(dx) + Math.abs(dy) > 0) {
                    strecke = [];
                    zielFeld = feld;
                    do {
                        zielFeld = Feld.ausBewegung(zielFeld, dx, dy);
                        if (zielFeld !== undefined) {
                            strecke.push(zielFeld);
                        }
                    } while (zielFeld !== undefined);
                    if (strecke.length > 0) {
                        strecken.push(strecke);
                    }
                }
            }
        }

        return strecken;
    },

    mitKoenigErreichbareFelderBerechnen: function (feld) {

        var felder = [],
            zielFeld,
            dx,
            dy;

        for (dx = -1; dx <= 1; dx += 1) {
            for (dy = -1; dy <= 1; dy += 1) {
                if (dx !== 0 || dy !== 0) {
                    zielFeld = Feld.ausBewegung(feld, dx, dy);
                    if (zielFeld !== undefined) {
                        felder.push(zielFeld);
                    }
                }
            }
        }
        return felder;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    BrettGeometrie.vorberechnen();
    exports.BrettGeometrie = BrettGeometrie;
}

