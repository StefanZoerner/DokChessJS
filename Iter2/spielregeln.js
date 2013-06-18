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

    /**
     * Liefert zu einem Feld die Liste aller Felder zurueck, die mit der Gangart des Springers von dort erreicht
     * werden koennen.
     */
    mitSpringerErreichbareFelder: function (feld) {

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

    geradeStreckenVonFeldAus: function (feld) {
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

    schraegeStreckenVonFeldAus: function (feld) {
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

    geradeUndSchraegeStreckenVonFeldAus: function (feld) {
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

    /**
     * Liefert zu einem Feld die Liste aller Felder zurueck, die mit der Gangart des Koenig von dort erreicht
     * werden koennen.
     */
    mitKoenigErreichbareFelder: function (feld) {

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

var Spielregeln = {

    istFeldAngegriffen: function (stellung, feld, farbe) {

        var angegriffen = false,
            strecke,
            strecken,
            anderesFeld,
            felder,
            figur,
            i,
            j,
            dy;

        // Gerade Strecken
        strecken = BrettGeometrie.geradeStreckenVonFeldAus(feld);
        for (i = 0; i < strecken.length && !angegriffen; i += 1) {
            strecke = strecken[i];
            for (j = 0; j < strecke.length && !angegriffen; j += 1) {
                anderesFeld = strecke[j];
                figur = stellung.aufFeld(anderesFeld);
                if (figur !== undefined) {
                    if (figur.farbe === farbe &&
                            (figur.art === FigurenArt.TURM || figur.art === FigurenArt.DAME)) {
                        angegriffen = true;
                    }
                    break;
                }
            }
        }

        // Schraege Strecken
        strecken = BrettGeometrie.schraegeStreckenVonFeldAus(feld);
        for (i = 0; i < strecken.length && !angegriffen; i += 1) {
            strecke = strecken[i];
            for (j = 0; j < strecke.length && !angegriffen; j += 1) {
                anderesFeld = strecke[j];
                figur = stellung.aufFeld(anderesFeld);
                if (figur !== undefined) {
                    if (figur.farbe === farbe &&
                            (figur.art === FigurenArt.LAEUFER || figur.art === FigurenArt.DAME)) {
                        angegriffen = true;
                    }
                    break;
                }
            }
        }

        // Springer
        if (!angegriffen) {
            felder = BrettGeometrie.mitSpringerErreichbareFelder(feld);
            for (i = 0; i < felder.length && !angegriffen; i += 1) {
                anderesFeld = felder[i];
                figur = stellung.aufFeld(anderesFeld);
                if (figur !== undefined && figur.art === FigurenArt.SPRINGER && figur.farbe === farbe) {
                    angegriffen = true;
                }
            }
        }

        // Koenig
        if (!angegriffen) {
            felder = BrettGeometrie.mitKoenigErreichbareFelder(feld);
            for (i = 0; i < felder.length && !angegriffen; i += 1) {
                anderesFeld = felder[i];
                figur = stellung.aufFeld(anderesFeld);
                if (figur !== undefined && figur.art === FigurenArt.KOENIG && figur.farbe === farbe) {
                    angegriffen = true;
                }
            }
        }

        // Bauer
        if (!angegriffen) {
            dy = (stellung.amZug === Farbe.WEISS) ? 1 : -1;
            anderesFeld = Feld.ausBewegung(feld, 1, dy);
            if (anderesFeld !== undefined) {
                figur = stellung.aufFeld(anderesFeld);
                if (figur !== undefined && figur.art === FigurenArt.BAUER && figur.farbe === farbe) {
                    angegriffen = true;
                }
            }
            anderesFeld = Feld.ausBewegung(feld, -1, dy);
            if (anderesFeld !== undefined) {
                figur = stellung.aufFeld(anderesFeld);
                if (figur !== undefined && figur.art === FigurenArt.BAUER && figur.farbe === farbe) {
                    angegriffen = true;
                }
            }
        }

        return angegriffen;
    },


    ermittelGueltigeZuege: function (stellung) {

        var figur,
            zuege = [],
            ergebnis = [],
            farbeAmZug = stellung.amZug,
            von,
            nach,
            zielFelder,
            strecken,
            figurAufNach,
            neueStellung,
            koenigsFeld;

        for (von = 0; von < 64; von += 1) {

            figur = stellung.aufFeld(von);

            if (figur !== undefined) {
                if (figur.farbe === stellung.amZug) {

                    var spalte = von % 8,
                        zeile = (von - spalte) / 8;

                    switch (figur.art) {

                        case FigurenArt.BAUER:

                            // Bauer 1 vor
                            var dy = (stellung.amZug === Farbe.WEISS) ? -1 : 1;
                            nach = Feld.ausBewegung(von, 0, dy);

                            if (nach != undefined && stellung.aufFeld(nach) == undefined) {
                                if ((stellung.amZug === Farbe.WEISS && Feld.zeile(von) === 1)
                                    || (stellung.amZug === Farbe.SCHWARZ && Feld.zeile(von) === 6)) {
                                    zuege.push(new Zug(von, nach, FigurenArt.DAME));
                                    zuege.push(new Zug(von, nach, FigurenArt.TURM));
                                    zuege.push(new Zug(von, nach, FigurenArt.SPRINGER));
                                    zuege.push(new Zug(von, nach, FigurenArt.LAEUFER));
                                } else {
                                    zuege.push(new Zug(von, nach));
                                }

                                // Bauer 2 vor
                                if ((stellung.amZug === Farbe.WEISS && zeile === 6)
                                    || (stellung.amZug === Farbe.SCHWARZ && zeile === 1)) {
                                        nach = Feld.ausBewegung(von, 0, dy * 2);
                                        if (stellung.aufFeld(nach) === undefined) {
                                            zuege.push(new Zug(von, nach));
                                        }
                                }
                            }

                            // schraeg Schlagen
                            nach = Feld.ausBewegung(von, -1, dy);
                            if (nach !== undefined) {
                                figurAufNach = stellung.aufFeld(nach);
                                if (figurAufNach !== undefined && figurAufNach.farbe !== farbeAmZug) {
                                    if ((stellung.amZug === Farbe.WEISS && Feld.zeile(von) === 1)
                                        || (stellung.amZug === Farbe.SCHWARZ && Feld.zeile(von) === 6)) {
                                        zuege.push(new Zug(von, nach, FigurenArt.DAME));
                                        zuege.push(new Zug(von, nach, FigurenArt.TURM));
                                        zuege.push(new Zug(von, nach, FigurenArt.SPRINGER));
                                        zuege.push(new Zug(von, nach, FigurenArt.LAEUFER));
                                    } else {
                                        zuege.push(new Zug(von, nach));
                                    }
                                } else if (nach === stellung.enPassant) {
                                    zuege.push(new Zug(von, nach));
                                }
                            }
                            nach = Feld.ausBewegung(von, 1, dy);
                            if (nach !== undefined) {
                                figurAufNach = stellung.aufFeld(nach);
                                if (figurAufNach !== undefined && figurAufNach.farbe !== farbeAmZug) {
                                    if ((stellung.amZug === Farbe.WEISS && Feld.zeile(von) === 1)
                                        || (stellung.amZug === Farbe.SCHWARZ && Feld.zeile(von) === 6)) {
                                        zuege.push(new Zug(von, nach, FigurenArt.DAME));
                                        zuege.push(new Zug(von, nach, FigurenArt.TURM));
                                        zuege.push(new Zug(von, nach, FigurenArt.SPRINGER));
                                        zuege.push(new Zug(von, nach, FigurenArt.LAEUFER));
                                    } else {
                                        zuege.push(new Zug(von, nach));
                                    }
                                } else if (nach === stellung.enPassant) {
                                    zuege.push(new Zug(von, nach));
                                }
                            }
                            break;

                        case FigurenArt.SPRINGER:
                            zielFelder = BrettGeometrie.mitSpringerErreichbareFelder(von);
                            forEach(zielFelder, function(nach) {
                                figurAufNach = stellung.aufFeld(nach);
                                if (figurAufNach === undefined || figurAufNach.farbe !== farbeAmZug) {
                                    zuege.push(new Zug(von, nach));
                                }
                            });
                            break;

                        case FigurenArt.TURM:
                            strecken = BrettGeometrie.geradeStreckenVonFeldAus(von);
                            forEach(strecken, function(strecke) {
                                for (var j=0; j<strecke.length; j++) {
                                    nach = strecke[j];
                                    figurAufNach = stellung.aufFeld(nach);
                                    if (figurAufNach == undefined || figurAufNach.farbe != farbeAmZug) {
                                        zuege.push(new Zug(von, nach));
                                    }
                                    if (figurAufNach != undefined) {
                                        break;
                                    }
                                }
                            });
                            break;

                        case FigurenArt.LAEUFER:
                            strecken = BrettGeometrie.schraegeStreckenVonFeldAus(von);
                            forEach(strecken, function(strecke) {
                                for (var j=0; j<strecke.length; j++) {
                                    nach = strecke[j];
                                    figurAufNach = stellung.aufFeld(nach);
                                    if (figurAufNach == undefined || figurAufNach.farbe != farbeAmZug) {
                                        zuege.push(new Zug(von, nach));
                                    }
                                    if (figurAufNach != undefined) {
                                        break;
                                    }
                                }
                            });
                            break;

                        case FigurenArt.DAME:
                            strecken = BrettGeometrie.geradeUndSchraegeStreckenVonFeldAus(von);
                            forEach(strecken, function(strecke) {
                                for (var j=0; j<strecke.length; j++) {
                                    nach = strecke[j];
                                    figurAufNach = stellung.aufFeld(nach);
                                    if (figurAufNach == undefined || figurAufNach.farbe != farbeAmZug) {
                                        zuege.push(new Zug(von, nach));
                                    }
                                    if (figurAufNach != undefined) {
                                        break;
                                    }
                                }
                            });
                            break;

                        case FigurenArt.KOENIG:
                            zielFelder = BrettGeometrie.mitKoenigErreichbareFelder(von);
                            forEach(zielFelder, function(nach) {
                                figurAufNach = stellung.aufFeld(nach);
                                if (figurAufNach == undefined || figurAufNach.farbe != farbeAmZug) {
                                    zuege.push(new Zug(von, nach));
                                }
                            });
                            break;
                    }
                }
            }
        }

        // Rochade
        if ((stellung.rochadeRechte !== undefined) && (stellung.rochadeRechte.length > 0)) {
            if (farbeAmZug === Farbe.WEISS) {
                // Kurze Rochade weiss
                if (stellung.rochadeRechte.indexOf('K') >= 0) {
                    if (stellung.aufFeld(Feld.f1) === undefined
                        && stellung.aufFeld(Feld.g1) === undefined
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.e1, Farbe.SCHWARZ)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.f1, Farbe.SCHWARZ)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.g1, Farbe.SCHWARZ)) {
                        zuege.push(new Zug("e1g1"));
                    }
                }
                // Lange Rochade weiss
                if (stellung.rochadeRechte.indexOf('Q') >= 0) {
                    if (stellung.aufFeld(Feld.b1) === undefined
                        && stellung.aufFeld(Feld.c1) === undefined
                        && stellung.aufFeld(Feld.d1) === undefined
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.c1, Farbe.SCHWARZ)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.d1, Farbe.SCHWARZ)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.e1, Farbe.SCHWARZ)) {
                        zuege.push(new Zug("e1c1"));
                    }
                }
            }  else {
                // Kurze Rochade schwarz
                if (stellung.rochadeRechte.indexOf('k') >= 0) {
                    if (stellung.aufFeld(Feld.f8) === undefined
                        && stellung.aufFeld(Feld.g8) === undefined
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.e8, Farbe.WEISS)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.f8, Farbe.WEISS)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.g8, Farbe.WEISS)) {
                        zuege.push(new Zug("e8g8"));
                    }
                }
                // Lange Rochade schwarz
                if (stellung.rochadeRechte.indexOf('q') >= 0) {
                    if (stellung.aufFeld(Feld.b8) === undefined
                        && stellung.aufFeld(Feld.c8) === undefined
                        && stellung.aufFeld(Feld.d8) === undefined
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.c8, Farbe.WEISS)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.d8, Farbe.WEISS)
                        && !Spielregeln.istFeldAngegriffen(stellung, Feld.e8, Farbe.WEISS)) {
                        zuege.push(new Zug("e8c8"));
                    }
                }
            }
        }

        for (var i=0; i<zuege.length; i += 1) {
            neueStellung = stellung.fuehreZugAus(zuege[i]);
            koenigsFeld = neueStellung.findeKoenig(stellung.amZug);

            if (! Spielregeln.istFeldAngegriffen(neueStellung, koenigsFeld, neueStellung.amZug)) {
                ergebnis.push(zuege[i]);
            }
        }

        return ergebnis;
    }

};

if (typeof module !== 'undefined' && module.exports) {
    exports.Spielregeln = Spielregeln;
}

