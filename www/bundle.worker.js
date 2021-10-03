/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setMute = exports.log = void 0;
var isMute = false;
function log(message) {
    // if (!isMute) console.log(message);
    if (!isMute)
        postMessage({ "cmd": "log", "message": message });
}
exports.log = log;
function setMute(changeIsMute) {
    isMute = changeIsMute;
}
exports.setMute = setMute;


/***/ }),

/***/ "./src/melee/armor.ts":
/*!****************************!*\
  !*** ./src/melee/armor.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Armor = void 0;
var Armor = /** @class */ (function () {
    function Armor(name, hitsStopped, maAdj, dxAdj) {
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.maAdj = maAdj;
        this.dxAdj = dxAdj;
    }
    Armor.NO_ARMOR = new Armor("No armor", 0, 0, 0);
    Armor.LEATHER = new Armor("Leather", 2, 2, 2);
    Armor.CHAIN = new Armor("Chain", 3, 4, 4);
    Armor.PLATE = new Armor("Plate", 5, 6, 6);
    return Armor;
}());
exports.Armor = Armor;


/***/ }),

/***/ "./src/melee/die.ts":
/*!**************************!*\
  !*** ./src/melee/die.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rollFourDice = exports.rollThreeDice = exports.rollDice = exports.roll = void 0;
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
function roll() {
    var roll = Math.floor(Math.random() * 6 + 1);
    (0, logger_1.log)("Die roll: " + roll);
    return roll;
}
exports.roll = roll;
function rollDice(numDice) {
    var result = 0;
    for (var i = 0; i < numDice; i++) {
        result += roll();
    }
    return result;
}
exports.rollDice = rollDice;
function rollThreeDice() {
    return rollDice(3);
}
exports.rollThreeDice = rollThreeDice;
function rollFourDice() {
    return rollDice(4);
}
exports.rollFourDice = rollFourDice;


/***/ }),

/***/ "./src/melee/game.ts":
/*!***************************!*\
  !*** ./src/melee/game.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
var hero_1 = __webpack_require__(/*! ./hero */ "./src/melee/hero.ts");
var weapon_1 = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var die_1 = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
var heroesSingleton_1 = __webpack_require__(/*! ./heroesSingleton */ "./src/melee/heroesSingleton.ts");
var Game = /** @class */ (function () {
    function Game(hero1, hero2, poleCharge, defendOnPoleCharge) {
        this.hero1 = hero1;
        this.hero2 = hero2;
        this.round = 0;
        this.winHero1 = false;
        this.winHero2 = false;
        this.criticalMisses = 0;
        this.criticalHits = 0;
        this.poleCharge = poleCharge;
        this.defendOnPoleCharge = defendOnPoleCharge;
        (0, logger_1.log)("New Game with pole charge set to " + this.poleCharge + " and defend on pole charge set to " + this.defendOnPoleCharge);
    }
    ;
    Game.prototype.fightToTheDeath = function () {
        var winner = null;
        /**
         * As long as both are still conscious and at least one can do damage
         * Note: even though one hero breaks a weapon, the other could also
         * break it resulting in a tie.
         * No HTH is considered.
         * No second weapon is considered.
         */
        while ((this.hero1.isConscious && this.hero2.isConscious) && (this.hero1.canDoDamage || this.hero2.canDoDamage)) {
            this.round++;
            this.hero1.newRound();
            this.hero2.newRound();
            (0, logger_1.log)("---> Round " + this.round);
            (0, logger_1.log)("Hero 1: " + this.hero1.name + ", ST: " + this.hero1.getST + "(" + this.hero1.adjST + ")");
            (0, logger_1.log)("Hero 2: " + this.hero2.name + ", ST: " + this.hero2.getST + "(" + this.hero2.adjST + ")");
            var firstAttacker = this.hero1, secondAttacker = this.hero2;
            /* highest adjDx attacks first */
            if (this.hero1.adjustedDx < this.hero2.adjustedDx) {
                firstAttacker = this.hero2;
                secondAttacker = this.hero1;
            }
            /* roll to see who attacks first */
            else if (this.hero1.adjustedDx == this.hero2.adjustedDx) {
                (0, logger_1.log)("Adjusted dexterity (" + this.hero1.adjustedDx + ") is the same for both fighters; rolling to decide attack order");
                if (Math.random() < 0.5) {
                    firstAttacker = this.hero2;
                    secondAttacker = this.hero1;
                }
            }
            (0, logger_1.log)(firstAttacker.name + " (adjDx = " + firstAttacker.adjustedDx + ") attacks before " + secondAttacker.name + " (adjDx = " + secondAttacker.adjustedDx + ")");
            this.hero1.setCharging((this.poleCharge) && (this.round == 1) && this.hero1.getReadiedWeapon.isPole);
            this.hero2.setCharging((this.poleCharge) && (this.round == 1) && this.hero2.getReadiedWeapon.isPole);
            this.tryDefending(this.hero1, this.hero2, this.defendOnPoleCharge);
            this.tryDefending(this.hero2, this.hero1, this.defendOnPoleCharge);
            this.tryStandUp(firstAttacker);
            this.tryStandUp(secondAttacker);
            this.tryPickUp(firstAttacker);
            this.tryPickUp(secondAttacker);
            this.tryAttack(this, firstAttacker, secondAttacker);
            this.tryAttack(this, secondAttacker, firstAttacker);
        }
        if (this.hero1.canDoDamage) {
            winner = this.hero1;
        }
        else if (this.hero2.canDoDamage) {
            winner = this.hero2;
        }
        else {
            winner = null;
        }
        if (winner != null) {
            (0, logger_1.log)("-------> The winner of this bout is " + winner.name);
        }
        else {
            (0, logger_1.log)("-------> This bout was a TIE!");
        }
        return winner;
    };
    /**
     * Private (static) functions, must be passed a "this" if you need access to Game
     */
    Game.prototype.tryDefending = function (defender, attacker, defendOnPoleCharge) {
        if (!defender.isKnockedDown
            && defender.getReadiedWeapon !== weapon_1.Weapon.NONE
            && defender.sufferingDexPenalty()
            && defender.adjustedDx < 8) {
            defender.setDefending();
            (0, logger_1.log)(defender.name + " is defending this turn because adjDX < 8 and temporarily penalized.");
        }
        else if (defendOnPoleCharge
            && !defender.isKnockedDown
            && defender.getReadiedWeapon !== weapon_1.Weapon.NONE
            && attacker.getReadiedWeapon !== weapon_1.Weapon.NONE
            && attacker.getReadiedWeapon.isPole
            && attacker.isCharging
            && !defender.isCharging // don't defend if also charging with pole weapon
        ) {
            defender.setDefending();
            (0, logger_1.log)(defender.name + " is defending this turn because attacker is charging with pole weapon.");
        }
    };
    Game.prototype.tryStandUp = function (hero) {
        if (hero.isKnockedDown) {
            hero.standUp();
            (0, logger_1.log)(hero.name + " is standing up this turn.");
        }
    };
    Game.prototype.tryPickUp = function (hero) {
        if (hero.getDroppedWeapon() !== weapon_1.Weapon.NONE) {
            hero.pickUpWeapon();
            (0, logger_1.log)(hero.name + " is picking up his weapon this turn (rear facing in all six directions).");
        }
    };
    Game.prototype.resolveAttack = function (game, attacker, attackee, roll, numDice) {
        var facingBonus = attackee.isProne ? 4 : 0;
        (0, logger_1.log)(attacker.name + " rolled " + roll + " and adjDex is "
            + (attackee.isProne ? (attacker.adjustedDx + facingBonus + " (" + attacker.adjustedDx + " + " + facingBonus + ", target is prone, i.e., knocked down or picking up a weapon)")
                : attacker.adjustedDx));
        /**
         * A hit is a roll that is
         * NOT an automatic miss AND
         * (below or equal to the attacker's adjDex OR and automatic hit)
         */
        if (!this.isAutomaticMiss(roll, numDice) && (roll <= attacker.adjustedDx + facingBonus || this.isAutomaticHit(roll, numDice))) {
            (0, logger_1.log)("HIT!!!!");
            var hits = attacker.getReadiedWeapon.doDamage();
            if (attacker.isCharging && attacker.getReadiedWeapon.isPole) {
                (0, logger_1.log)("Pole weapon charge does double damage!");
                game.criticalHits++;
                hits *= 2;
            }
            if (this.isDoubleDamage(roll, numDice)) {
                (0, logger_1.log)("Double damage! (roll of " + roll + " on " + numDice + " dice.)");
                game.criticalHits++;
                hits *= 2;
            }
            else if (this.isTripleDamage(roll, numDice)) {
                (0, logger_1.log)("Triple damage! (roll of " + roll + " on " + numDice + " dice.)");
                game.criticalHits++;
                hits *= 3;
            }
            (0, logger_1.log)("Total damage done by " + attacker.getReadiedWeapon.name + ": " + hits + " hits");
            attackee.takeHits(hits);
        }
        else {
            /**
             * It's a miss
             */
            (0, logger_1.log)("Missed. ");
            if (this.isDroppedWeapon(roll, numDice)) {
                (0, logger_1.log)("Dropped weapon! ");
                game.criticalMisses++;
                attacker.dropWeapon();
            }
            else if (this.isBrokenWeapon(roll, numDice)) {
                (0, logger_1.log)("Broke weapon! ");
                game.criticalMisses++;
                attacker.breakWeapon();
            }
        }
    };
    ;
    Game.prototype.tryAttack = function (game, attacker, attackee) {
        (0, logger_1.log)(attacker.name + " gets his turn to attack.");
        if (!attacker.isDefending()) {
            if (attacker.isConscious) {
                if (!attacker.isKnockedDown) {
                    if (attacker.getReadiedWeapon !== weapon_1.Weapon.NONE) {
                        if (attacker.isCharging)
                            (0, logger_1.log)("He's charging with pole weapon (double damage if he hits).");
                        var numDice = attackee.isDefending() ? 4 : 3;
                        (0, logger_1.log)("Rolling to hit on " + numDice + " dice.");
                        this.resolveAttack(game, attacker, attackee, (0, die_1.rollDice)(numDice), numDice);
                    }
                    else {
                        (0, logger_1.log)("But he's not able to attack because he has has no readied weapon.");
                    }
                }
                else {
                    (0, logger_1.log)("But he's not able to attack because he was knocked down.");
                }
            }
            else {
                (0, logger_1.log)("But he's not able to attack because he's " + (attacker.isAlive ? "unconscious." : "dead."));
            }
        }
        else {
            (0, logger_1.log)("But he's defending.");
        }
    };
    ;
    Game.prototype.isAutomaticMiss = function (roll, numDice) {
        var result = false;
        switch (numDice) {
            case 3:
                result = (roll >= 16);
                break;
            case 4:
                result = (roll >= 20);
                break;
            default:
                throw new RangeError("unsupported value for roll: " + roll);
        }
        return result;
    };
    Game.prototype.isAutomaticHit = function (roll, numDice) {
        var result = false;
        switch (numDice) {
            case 3:
                result = (roll <= 5);
                break;
            case 4:
                // 4 dice is assumed to be defending - no autmatic hits according to Melee rules
                result = false;
                break;
            default:
                throw new RangeError("unsupported value for roll: " + roll);
        }
        return result;
    };
    Game.prototype.isDoubleDamage = function (roll, numDice) {
        var result = false;
        switch (numDice) {
            case 3:
                result = (roll == 4);
                break;
            case 4:
                // 4 dice is assumed to be defending - no double damage according to Melee rules
                result = false;
                break;
            default:
                throw new RangeError("unsupported value for roll: " + roll);
        }
        return result;
    };
    Game.prototype.isTripleDamage = function (roll, numDice) {
        var result = false;
        switch (numDice) {
            case 3:
                result = (roll == 3);
                break;
            case 4:
                // 4 dice is assumed to be defending - no double damage according to Melee rules
                result = false;
                break;
            default:
                throw new RangeError("unsupported value for roll: " + roll);
        }
        return result;
    };
    Game.prototype.isDroppedWeapon = function (roll, numDice) {
        var result = false;
        switch (numDice) {
            case 3:
                result = (roll == 17);
                break;
            case 4:
                result = ((roll == 21) || (roll == 22));
                break;
            default:
                throw new RangeError("unsupported value for roll: " + roll);
        }
        return result;
    };
    Game.prototype.isBrokenWeapon = function (roll, numDice) {
        var result = false;
        switch (numDice) {
            case 3:
                result = (roll == 18);
                break;
            case 4:
                result = ((roll == 23) || (roll == 24));
                break;
            default:
                throw new RangeError("unsupported value for roll: " + roll);
        }
        return result;
    };
    ;
    Game.createHeroesMap = function () {
        // heroSet.put(new Hero("001:ST8;DX16;DAGGER;NO_ARMOR;SMALL_SHIELD", 8, 16, Weapon.DAGGER, Armor.NO_ARMOR, Shield.SMALL_SHIELD), new Integer(0));
        var h1;
        var heroesListJSON = heroesSingleton_1.HeroesSingleton.getHeroesListJSON();
        var heroJSON = null;
        for (var i = 0; i < heroesListJSON.length; i++) {
            heroJSON = heroesListJSON[i];
            h1 = new hero_1.Hero(heroesSingleton_1.HeroesSingleton.getNameFromID(heroJSON.id), heroJSON.st, heroJSON.dx, heroJSON.weapon, heroJSON.armor, heroJSON.shield);
            //this.putHero(h1);
            this.heroMap.set(h1.name, h1);
        }
    };
    ;
    Game.prototype.displayHeroesMap = function () {
        console.log(Object.keys(Game.heroMap));
    };
    ;
    Game.getHeroMap = function () {
        return Game.heroMap;
    };
    ;
    Game.heroMap = new Map(); // singleton
    return Game;
}());
exports.Game = Game;


/***/ }),

/***/ "./src/melee/hero.ts":
/*!***************************!*\
  !*** ./src/melee/hero.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Hero = void 0;
var weapon_1 = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var Hero = /** @class */ (function () {
    function Hero(name, st, dx, weapon, armor, shield) {
        this._id = Hero.currentId++;
        this._name = name;
        this._st = st;
        this._dx = dx;
        this._ma = 10; // hard-coded for humans
        this._readiedWeapon = weapon;
        this._armor = armor;
        this._shield = shield;
        this._knockedDown = false;
        this._standingUp = false;
        this._pickingUpWeapon = false;
        this._weapon = weapon;
        this._droppedWeapon = weapon_1.Weapon.NONE;
        this._damageTaken = 0;
        this._damageTakenThisRound = 0;
        this._injuryDexPenalty = false;
        this._recovering = false;
        this._defending = false;
        this._charging = false;
    }
    Object.defineProperty(Hero.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Hero.prototype, "getST", {
        get: function () {
            return this._st;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "adjST", {
        get: function () {
            return Math.max(this._st - this._damageTaken, 0);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "getMA", {
        get: function () {
            return this._ma;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "adjustedMA", {
        get: function () {
            return this._ma - this._armor.maAdj;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "getDX", {
        get: function () {
            return this._dx;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "adjustedDx", {
        get: function () {
            return this._dx - this._armor.dxAdj - this._shield.dxAdj - (this._injuryDexPenalty ? 2 : 0) - (this.isStrengthLowPenalty ? 3 : 0);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "damageTakenThisRound", {
        get: function () {
            return this._damageTakenThisRound;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "isAlive", {
        get: function () {
            return (this._st - this._damageTaken > 0);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "isConscious", {
        get: function () {
            return (this._st - this._damageTaken > 1);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "isKnockedDown", {
        get: function () {
            return this._knockedDown;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.prototype.standUp = function () {
        this._standingUp = true;
    };
    ;
    /**
     * These rules maybe should go into Game (better cohesion)
     */
    Hero.prototype.newRound = function () {
        this._charging = false;
        this._defending = false;
        this._damageTakenThisRound = 0;
        if (this._standingUp) {
            this._knockedDown = false;
            this._standingUp = false;
        }
        else if (this._pickingUpWeapon) // technically "was" picking up weapon last round
         {
            this._readiedWeapon = this._droppedWeapon;
            this._droppedWeapon = weapon_1.Weapon.NONE;
            this._pickingUpWeapon = false;
        }
        /*
         * Dex penalty due to injury lasts one complete round
         */
        if (this._injuryDexPenalty && this._recovering) {
            this._injuryDexPenalty = false;
            this._recovering = false;
        }
        else if (this._injuryDexPenalty) {
            this._recovering = true;
        }
    };
    ;
    Hero.prototype.takeHits = function (hits) {
        var armorPoints = this._armor.hitsStopped + this._shield.hitsStopped;
        var damageDone = hits - armorPoints;
        if (damageDone < 0)
            damageDone = 0;
        (0, logger_1.log)(this._name + " taking " + hits + " hits.");
        (0, logger_1.log)(this._armor.name + " stops " + this._armor.hitsStopped);
        (0, logger_1.log)(this._shield.name + " stops " + this._shield.hitsStopped);
        (0, logger_1.log)(this._name + " taking " + damageDone + " damage.");
        this.takeDamage(damageDone);
        return damageDone;
    };
    ;
    /**
     * After it's got past armor, etc.
     */
    Hero.prototype.takeDamage = function (damageDone) {
        this._damageTaken += damageDone;
        this._damageTakenThisRound += damageDone;
        this._injuryDexPenalty = this.sufferingDexPenalty();
        if (this._injuryDexPenalty)
            (0, logger_1.log)(this._name + " has an adjDx penalty of -2 for remainder of this round and the NEXT round.");
        (0, logger_1.log)(this._name + " has now taken " + this._damageTaken + " points of damage, ST = " + this._st + (this._damageTaken >= this._st ? " and is DEAD." : (this._st - this._damageTaken === 1 ? " and is UNCONSCIOUS." : ".")));
        if (this._damageTakenThisRound >= 8) {
            this._knockedDown = true;
            (0, logger_1.log)(this._name + " has been knocked down by damage.");
        }
        if (this.isStrengthLowPenalty)
            (0, logger_1.log)(this._name + " has an additional DX adjustment of -3 due to ST <= 3.");
    };
    ;
    Hero.prototype.sufferingDexPenalty = function () {
        return (this._damageTakenThisRound >= 5 || this._recovering);
    };
    ;
    Object.defineProperty(Hero.prototype, "isStrengthLowPenalty", {
        get: function () {
            return (this._st - this._damageTaken <= 3);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.prototype.setDefending = function () {
        this._defending = true;
    };
    ;
    Hero.prototype.isDefending = function () {
        return this._defending;
    };
    ;
    Hero.prototype.setCharging = function (isCharging) {
        //        log("Hero: setCharge to " + isCharging);
        this._charging = isCharging;
    };
    ;
    Object.defineProperty(Hero.prototype, "isCharging", {
        get: function () {
            return this._charging;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "isProne", {
        get: function () {
            return this._pickingUpWeapon;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "isPickingUpWeapon", {
        get: function () {
            return this._pickingUpWeapon;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.prototype.getWeapon = function () {
        return this._weapon;
    };
    ;
    Object.defineProperty(Hero.prototype, "getReadiedWeapon", {
        get: function () {
            return this._readiedWeapon;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.prototype.dropWeapon = function () {
        this._droppedWeapon = this._readiedWeapon;
        this._readiedWeapon = weapon_1.Weapon.NONE;
    };
    ;
    Hero.prototype.breakWeapon = function () {
        this._readiedWeapon = weapon_1.Weapon.NONE;
        this._droppedWeapon = weapon_1.Weapon.NONE; // shouldn't need this, but just in case
    };
    ;
    Hero.prototype.getDroppedWeapon = function () {
        return this._droppedWeapon;
    };
    ;
    Hero.prototype.pickUpWeapon = function () {
        this._pickingUpWeapon = true;
    };
    ;
    Object.defineProperty(Hero.prototype, "getArmor", {
        get: function () {
            return this._armor;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.prototype.setArmor = function (armor) {
        return this._armor = armor;
    };
    ;
    Object.defineProperty(Hero.prototype, "armorPoints", {
        get: function () {
            return this._armor.hitsStopped + this._shield.hitsStopped;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Hero.prototype, "getShield", {
        get: function () {
            return this._shield;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.prototype.toString = function () {
        return this._name + ":ST" + this._st + ";DX" + this._dx + ";" + this._weapon.name + ";" + this._armor.name + ";" + this._shield.name;
    };
    ;
    Object.defineProperty(Hero.prototype, "canDoDamage", {
        get: function () {
            return this.isConscious && (this._readiedWeapon !== weapon_1.Weapon.NONE || this._droppedWeapon !== weapon_1.Weapon.NONE);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Hero.currentId = 0;
    return Hero;
}());
exports.Hero = Hero;


/***/ }),

/***/ "./src/melee/heroesSingleton.ts":
/*!**************************************!*\
  !*** ./src/melee/heroesSingleton.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HeroesSingleton = void 0;
var weapon_1 = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
var armor_1 = __webpack_require__(/*! ./armor */ "./src/melee/armor.ts");
var shield_1 = __webpack_require__(/*! ./shield */ "./src/melee/shield.ts");
var HeroesSingleton = /** @class */ (function () {
    function HeroesSingleton() {
    }
    HeroesSingleton.getHeroesListJSON = function () {
        return HeroesSingleton.heroesListJSON;
    };
    ;
    HeroesSingleton.getListHeight = function () {
        return HeroesSingleton.listHeight;
    };
    ;
    HeroesSingleton.getNameFromID = function (id) {
        var hero = this.heroesListJSON.find(function (hero) { return hero.id == id; });
        var name = hero ? (hero.id + ":ST" + hero.st + ";DX" + hero.dx + ";" + hero.weapon.name + ";" + hero.armor.name + ";" + hero.shield.name).toUpperCase().replace(/[ -]/g, '_') : "(hero id " + id + " not found)";
        return name;
    };
    // http://stackoverflow.com/a/9753841/1168342
    HeroesSingleton.listHeight = 15;
    HeroesSingleton.heroesListJSON = [
        { "id": "001", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "002", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "003", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "004", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "005", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "006", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "007", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "008", "st": 8, "dx": 16, "weapon": weapon_1.Weapon.DAGGER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "009", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "010", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "011", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "012", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "013", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "014", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "015", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "016", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.RAPIER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "017", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "018", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "019", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "020", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "021", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "022", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "023", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "024", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.CLUB, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "025", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "026", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "027", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "028", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "029", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "030", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "031", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "032", "st": 9, "dx": 15, "weapon": weapon_1.Weapon.JAVELIN, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "033", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "034", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "035", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "036", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "037", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "038", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "039", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "040", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.HAMMER, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "041", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "042", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "043", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "044", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "045", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "046", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "047", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "048", "st": 10, "dx": 14, "weapon": weapon_1.Weapon.CUTLASS, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "049", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "050", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "051", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "052", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "053", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "054", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "055", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "056", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SHORTSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "057", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "058", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "059", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "060", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "061", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "062", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "063", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "064", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.MACE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "065", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "066", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "067", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "068", "st": 11, "dx": 13, "weapon": weapon_1.Weapon.SPEAR, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "069", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "070", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "071", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "072", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "073", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "074", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "075", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "076", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "077", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "078", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "079", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "080", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.SMALL_SHIELD },
        { "id": "081", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "082", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "083", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "084", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.MORNINGSTAR, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.LARGE_SHIELD },
        { "id": "085", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "086", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "087", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "088", "st": 13, "dx": 11, "weapon": weapon_1.Weapon.HALBERD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "089", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "090", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "091", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "092", "st": 14, "dx": 10, "weapon": weapon_1.Weapon.TWO_HANDED_SWORD, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "093", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "094", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "095", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "096", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "097", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "098", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "099", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "100", "st": 15, "dx": 9, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "101", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "102", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "103", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "104", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.BATTLEAXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "105", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "106", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.LEATHER, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "107", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.CHAIN, "shield": shield_1.Shield.NO_SHIELD },
        { "id": "108", "st": 16, "dx": 8, "weapon": weapon_1.Weapon.PIKE_AXE, "armor": armor_1.Armor.PLATE, "shield": shield_1.Shield.NO_SHIELD }
    ];
    return HeroesSingleton;
}());
exports.HeroesSingleton = HeroesSingleton;


/***/ }),

/***/ "./src/melee/shield.ts":
/*!*****************************!*\
  !*** ./src/melee/shield.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Shield = void 0;
var Shield = /** @class */ (function () {
    function Shield(name, hitsStopped, dxAdj) {
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.dxAdj = dxAdj;
    }
    Shield.NO_SHIELD = new Shield("No shield", 0, 0);
    Shield.SMALL_SHIELD = new Shield("Small shield", 1, 0);
    Shield.LARGE_SHIELD = new Shield("Large shield", 2, 1);
    return Shield;
}());
exports.Shield = Shield;


/***/ }),

/***/ "./src/melee/weapon.ts":
/*!*****************************!*\
  !*** ./src/melee/weapon.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Weapon = void 0;
var die_1 = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var Weapon = /** @class */ (function () {
    function Weapon(name, st, dice, modifier, isTwoHanded, isThrown, isPole) {
        this.name = name;
        this.st = st;
        this.dice = dice;
        this.modifier = modifier;
        this.isTwoHanded = isTwoHanded;
        this.isPole = isPole;
        this.isThrown = isThrown;
    }
    Weapon.prototype.doDamage = function () {
        (0, logger_1.log)("Rolling for weapon doing "
            + this.dice
            + "d"
            + ((this.modifier > 0) ? "+" : "")
            + ((this.modifier !== 0) ? this.modifier : "")
            + " damage.");
        var damage = 0;
        damage += (0, die_1.rollDice)(this.dice);
        damage += this.modifier;
        if (this.modifier !== 0)
            (0, logger_1.log)(((this.modifier > 0) ? "+" : "") + this.modifier);
        if (damage < 0)
            damage = 0;
        (0, logger_1.log)("Total weapon damage: " + damage);
        return damage;
    };
    ;
    Weapon.prototype.toString = function () {
        return this.name + " (" + this.dice + "D" + ((this.modifier > 0) ? "+" : "") + ((this.modifier !== 0) ? this.modifier : "") + ")";
    };
    ;
    Weapon.NONE = new Weapon("None", 0, 0, 0, false, false, false);
    Weapon.DAGGER = new Weapon("Dagger", 0, 1, -1, true, false, false);
    Weapon.RAPIER = new Weapon("Rapier", 9, 1, 0, false, false, false);
    Weapon.CLUB = new Weapon("Club", 9, 1, 0, true, false, false);
    Weapon.HAMMER = new Weapon("Hammer", 10, 1, 1, true, false, false);
    Weapon.CUTLASS = new Weapon("Cutlass", 10, 2, -2, false, false, false);
    Weapon.SHORTSWORD = new Weapon("Shortsword", 11, 2, -1, false, false, false);
    Weapon.MACE = new Weapon("Mace", 11, 2, -1, true, false, false);
    Weapon.SMALL_AX = new Weapon("Small ax", 11, 1, 2, true, false, false);
    Weapon.BROADSWORD = new Weapon("Broadsword", 12, 2, 0, false, false, false);
    Weapon.MORNINGSTAR = new Weapon("Morningstar", 13, 2, 1, false, false, false);
    Weapon.TWO_HANDED_SWORD = new Weapon("Two-handed sword", 14, 3, -1, false, true, false);
    Weapon.BATTLEAXE = new Weapon("Battleaxe", 15, 3, 0, false, true, false);
    // pole weapons
    Weapon.JAVELIN = new Weapon("Javelin", 9, 1, -1, true, false, true);
    Weapon.SPEAR = new Weapon("Spear", 11, 1, 1, true, true, true);
    Weapon.HALBERD = new Weapon("Halberd", 13, 2, -1, false, true, true);
    Weapon.PIKE_AXE = new Weapon("Pike axe", 15, 2, 2, false, true, true); // And now return the constructor function
    return Weapon;
}());
exports.Weapon = Weapon;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!****************************************************************!*\
  !*** ./node_modules/ts-loader/index.js!./src/worker/worker.ts ***!
  \****************************************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var game_1 = __webpack_require__(/*! ../melee/game */ "./src/melee/game.ts");
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var heroesSingleton_1 = __webpack_require__(/*! ../melee/heroesSingleton */ "./src/melee/heroesSingleton.ts");
var ctx = self;
var poleWeaponsChargeFirstRound = false;
var defendVsPoleCharge = false;
ctx.addEventListener('message', function (event) {
    /**
     * parse the message
     */
    var data = event.data;
    console.log("Worker: got message " + data.cmd);
    switch (data.cmd) {
        case "wake up":
            ctx.postMessage({ "cmd": "worker waiting" });
            break;
        default:
            var heroSet_1 = new Array(); // list of heroes to fight
            game_1.Game.createHeroesMap();
            var completeHeroMap_1 = game_1.Game.getHeroMap();
            data.selectedHeroes.forEach(function (heroID) {
                var hero = completeHeroMap_1.get(heroesSingleton_1.HeroesSingleton.getNameFromID(heroID));
                if (hero)
                    heroSet_1.push(hero);
                else
                    console.log("  !!! Didn't find " + heroesSingleton_1.HeroesSingleton.getNameFromID(heroID) + " (" + heroID + ") in map !!!");
            }, this);
            /**
             * Configure simulator options
             */
            (0, logger_1.setMute)(!data.isVerbose);
            poleWeaponsChargeFirstRound = data.isPoleWeaponsChargeFirstRound;
            defendVsPoleCharge = data.isDefendVsPoleCharge;
            tryAllCombinations(heroSet_1, data.boutCount);
            break;
    }
});
function tryAllCombinations(heroSet, boutCount) {
    var matchupWins = {}; // map of hero and integer
    var heroWins = {};
    var game = null;
    var score = [2];
    var progress = 0;
    // how many bouts total is N * N-1 * boutCount
    var totalIterations = heroSet.length * (heroSet.length - 1) * boutCount / 2;
    var iterationCount = 0;
    heroSet.forEach(function (hero1) {
        heroWins[hero1.name] = 0;
        heroSet.forEach(function (hero2) {
            if (hero1 !== hero2)
                matchupWins[hero1.name + "/" + hero2.name] = 0;
        });
    });
    var lastUpdateTime = new Date(); // for throttling updates
    for (var h1 = 0; h1 < heroSet.length; h1++) {
        var hero1 = heroSet[h1];
        var h2 = 0;
        var hero2 = heroSet[h2];
        for (h2 = h1 + 1; h2 < heroSet.length; h2++) {
            hero2 = heroSet[h2];
            var sumRounds = 0;
            score[0] = 0;
            score[1] = 0;
            (0, logger_1.log)('Matchup: ' + hero1.name + ' vs. ' + hero2.name);
            for (var bout = 0; bout < boutCount; bout++) {
                (0, logger_1.log)("Bout: " + bout + 1 + " of " + boutCount);
                iterationCount++;
                /**
                 * Don't post updates too often
                 */
                var currentTime = new Date();
                if (currentTime.getTime() - lastUpdateTime.getTime() > 500) {
                    /**
                     * update progress bar on page (assumes max is 10000)
                     */
                    progress = Math.ceil((iterationCount / totalIterations) * 100 * 100);
                    ctx.postMessage({ "cmd": "progressUpdate", "progress": progress });
                    lastUpdateTime = currentTime;
                }
                // clone heroes (resets them) prior to fighting
                var fightingHero1 = Object.create(hero1);
                var fightingHero2 = Object.create(hero2);
                game = new game_1.Game(fightingHero1, fightingHero2, poleWeaponsChargeFirstRound, defendVsPoleCharge);
                var winningFighter = game.fightToTheDeath();
                if (winningFighter !== null) {
                    var losingFighter = (winningFighter === fightingHero1 ? fightingHero2 : fightingHero1);
                    if (winningFighter === fightingHero1) {
                        score[0]++;
                    }
                    else {
                        score[1]++;
                    }
                    var key = winningFighter.name + "/" + losingFighter.name;
                    matchupWins[key]++;
                }
                sumRounds += game.round;
            }
            /**
             * Update the total stats for these heroes
             */
            heroWins[hero1.name] += score[0];
            heroWins[hero2.name] += score[1];
        }
    }
    /**
     * Put stats back on page
     */
    ctx.postMessage({ "cmd": "progressUpdate", "progress": 100 * 100 });
    console.log(" in worker...");
    var heroWinsTableHTML = createTableFromProperties(heroWins, (heroSet.length - 1) * boutCount, "Results for " + heroSet.length + " heroes, paired up for " + boutCount + " bouts each:", false);
    var matchupWinsTableHTML = createTableFromProperties(matchupWins, boutCount, "Pairwise results for " + heroSet.length + " heroes, paired up for " + boutCount + " bouts each:", true);
    ctx.postMessage({
        "cmd": "finished",
        "heroWins": heroWins,
        "matchupWins": matchupWins,
        "heroWinsTableHTML": heroWinsTableHTML,
        "matchupWinsTableHTML": matchupWinsTableHTML
    });
}
function createTableFromProperties(heroWins, totalCount, caption, isVersus) {
    var html = "<caption>" + caption + "</caption><thead>";
    if (isVersus) {
        html += "<tr><th>Hero 1</th><th>vs Hero 2</th>";
    }
    else {
        html += "<tr><th>Hero</th>";
    }
    html += "<th id=\"" + (isVersus ? 'match' : '') + "wins\" style=\"text-align: right;\">Wins</th><th class=\"\" style=\"text-align: right;\">% total</th></tr></thead>";
    var tbody = '';
    var percentageWin = 0;
    var pctClass;
    for (var property in heroWins) {
        if (heroWins.hasOwnProperty(property)) {
            percentageWin = parseInt(((heroWins[property] / totalCount) * 100).toFixed(2));
            pctClass = '';
            if (percentageWin > 70)
                pctClass = " class=\"alert-success\"";
            else if (percentageWin < 30)
                pctClass = " class=\"alert-danger\"";
            tbody += "<tr" + pctClass + ">";
            if (isVersus) {
                var heroes = property.split("/");
                tbody += "<td>" + heroes[0] + "</td><td>" + heroes[1] + "</td>";
            }
            else {
                tbody += "<td>" + property + "</td>";
            }
            tbody += "<td style=\"text-align: right;\">" + heroWins[property] + "</td>";
            tbody += "<td style=\"text-align: right;\">" + percentageWin + "</td></tr>";
        }
    }
    html += "<tbody>" + tbody + "</tbody>";
    return html;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNuSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUM5RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQzlHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFL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QUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDcEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNwSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN4SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3ZILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUM3RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFF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SSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtLQUNsSCxDQUFDO0lBWVYsc0JBQUM7Q0FBQTtBQTdIWSwwQ0FBZTs7Ozs7Ozs7Ozs7Ozs7QUNKNUI7SUFJSSxnQkFBWSxJQUFZLEVBQUUsV0FBbUIsRUFBRSxLQUFhO1FBQ3hELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFDTSxnQkFBUyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDMUMsbUJBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELG1CQUFZLEdBQUcsSUFBSSxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMzRCxhQUFDO0NBQUE7QUFaWSx3QkFBTTs7Ozs7Ozs7Ozs7Ozs7QUNBbkIsbUVBQWlDO0FBQ2pDLHVFQUFnQztBQUVoQztJQVFJLGdCQUFZLElBQVksRUFBRSxFQUFVLEVBQ2hDLElBQVksRUFDWixRQUFnQixFQUNoQixXQUFvQixFQUNwQixRQUFpQixFQUNqQixNQUFlO1FBRWYsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBRU0seUJBQVEsR0FBZjtRQUNJLGdCQUFHLEVBQ0MsMkJBQTJCO2NBQ3pCLElBQUksQ0FBQyxJQUFJO2NBQ1QsR0FBRztjQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztjQUNoQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2NBQzVDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNmLE1BQU0sSUFBSSxrQkFBUSxFQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QixNQUFNLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN4QixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQztZQUFFLGdCQUFHLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQy9FLElBQUksTUFBTSxHQUFHLENBQUM7WUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLGdCQUFHLEVBQUMsMEJBQXdCLE1BQVEsQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFBQSxDQUFDO0lBRUsseUJBQVEsR0FBZjtRQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUN0SSxDQUFDO0lBQUEsQ0FBQztJQUVLLFdBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxhQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxhQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsV0FBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELGFBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxjQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUss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Q0FBQztZQUMzQixJQUFJLFFBQVEsRUFBRTtnQkFDVixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLElBQUksU0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLGlCQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsVUFBTyxDQUFDO2FBQ3pEO2lCQUFNO2dCQUNILEtBQUssSUFBSSxTQUFPLFFBQVEsVUFBTzthQUNsQztZQUNELEtBQUssSUFBSSxzQ0FBa0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFPO1lBQ3BFLEtBQUssSUFBSSxzQ0FBa0MsYUFBYSxlQUFZO1NBQ3ZFO0tBQ0o7SUFDRCxJQUFJLElBQUksWUFBVSxLQUFLLGFBQVUsQ0FBQztJQUNsQyxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL2xvZ2dlci50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvYXJtb3IudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2RpZS50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvZ2FtZS50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvaGVyby50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvaGVyb2VzU2luZ2xldG9uLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9zaGllbGQudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL3dlYXBvbi50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL3dvcmtlci93b3JrZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGlzTXV0ZSA9IGZhbHNlO1xyXG5leHBvcnQgZnVuY3Rpb24gbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgLy8gaWYgKCFpc011dGUpIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgaWYgKCFpc011dGUpIHBvc3RNZXNzYWdlKHsgXCJjbWRcIjogXCJsb2dcIiwgXCJtZXNzYWdlXCI6IG1lc3NhZ2UgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRNdXRlKGNoYW5nZUlzTXV0ZTogYm9vbGVhbikge1xyXG4gICAgaXNNdXRlID0gY2hhbmdlSXNNdXRlO1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBBcm1vciB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBoaXRzU3RvcHBlZDogbnVtYmVyO1xyXG4gICAgbWFBZGo6IG51bWJlcjtcclxuICAgIGR4QWRqOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGhpdHNTdG9wcGVkOiBudW1iZXIsIG1hQWRqOiBudW1iZXIsIGR4QWRqOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaGl0c1N0b3BwZWQgPSBoaXRzU3RvcHBlZDtcclxuICAgICAgICB0aGlzLm1hQWRqID0gbWFBZGo7XHJcbiAgICAgICAgdGhpcy5keEFkaiA9IGR4QWRqO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIE5PX0FSTU9SID0gbmV3IEFybW9yKFwiTm8gYXJtb3JcIiwgMCwgMCwgMCk7XHJcbiAgICBzdGF0aWMgTEVBVEhFUiA9IG5ldyBBcm1vcihcIkxlYXRoZXJcIiwgMiwgMiwgMik7XHJcbiAgICBzdGF0aWMgQ0hBSU4gPSBuZXcgQXJtb3IoXCJDaGFpblwiLCAzLCA0LCA0KTtcclxuICAgIHN0YXRpYyBQTEFURSA9IG5ldyBBcm1vcihcIlBsYXRlXCIsIDUsIDYsIDYpO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi4vbG9nZ2VyXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9sbCgpIHtcclxuICAgIGNvbnN0IHJvbGwgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA2ICsgMSk7XHJcbiAgICBsb2coYERpZSByb2xsOiAke3JvbGx9YCk7XHJcbiAgICByZXR1cm4gcm9sbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxEaWNlKG51bURpY2U6IG51bWJlcikge1xyXG4gICAgbGV0IHJlc3VsdCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bURpY2U7IGkrKykge1xyXG4gICAgICAgIHJlc3VsdCArPSByb2xsKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9sbFRocmVlRGljZSgpIHtcclxuICAgIHJldHVybiByb2xsRGljZSgzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxGb3VyRGljZSgpIHtcclxuICAgIHJldHVybiByb2xsRGljZSg0KTtcclxufSIsImltcG9ydCB7IEhlcm8gfSBmcm9tIFwiLi9oZXJvXCI7XHJcbmltcG9ydCB7IFdlYXBvbiB9IGZyb20gXCIuL3dlYXBvblwiO1xyXG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi4vbG9nZ2VyXCI7XHJcbmltcG9ydCB7IHJvbGxEaWNlIH0gZnJvbSBcIi4vZGllXCI7XHJcbmltcG9ydCB7IEhlcm9lc1NpbmdsZXRvbiB9IGZyb20gXCIuL2hlcm9lc1NpbmdsZXRvblwiXHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZSB7XHJcblxyXG4gICAgc3RhdGljIGhlcm9NYXAgPSBuZXcgTWFwPHN0cmluZywgSGVybz4oKTsgLy8gc2luZ2xldG9uXHJcbiAgICBoZXJvMTogSGVybztcclxuICAgIGhlcm8yOiBIZXJvO1xyXG4gICAgcm91bmQ6IG51bWJlcjtcclxuICAgIHdpbkhlcm8xOiBib29sZWFuO1xyXG4gICAgd2luSGVybzI6IGJvb2xlYW47XHJcbiAgICBjcml0aWNhbE1pc3NlczogbnVtYmVyO1xyXG4gICAgY3JpdGljYWxIaXRzOiBudW1iZXI7XHJcbiAgICBwb2xlQ2hhcmdlOiBib29sZWFuO1xyXG4gICAgZGVmZW5kT25Qb2xlQ2hhcmdlOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGhlcm8xOiBIZXJvLCBoZXJvMjogSGVybywgcG9sZUNoYXJnZTogYm9vbGVhbiwgZGVmZW5kT25Qb2xlQ2hhcmdlOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5oZXJvMSA9IGhlcm8xO1xyXG4gICAgICAgIHRoaXMuaGVybzIgPSBoZXJvMjtcclxuICAgICAgICB0aGlzLnJvdW5kID0gMDtcclxuICAgICAgICB0aGlzLndpbkhlcm8xID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy53aW5IZXJvMiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY3JpdGljYWxNaXNzZXMgPSAwO1xyXG4gICAgICAgIHRoaXMuY3JpdGljYWxIaXRzID0gMDtcclxuICAgICAgICB0aGlzLnBvbGVDaGFyZ2UgPSBwb2xlQ2hhcmdlO1xyXG4gICAgICAgIHRoaXMuZGVmZW5kT25Qb2xlQ2hhcmdlID0gZGVmZW5kT25Qb2xlQ2hhcmdlO1xyXG4gICAgICAgIGxvZyhcIk5ldyBHYW1lIHdpdGggcG9sZSBjaGFyZ2Ugc2V0IHRvIFwiICsgdGhpcy5wb2xlQ2hhcmdlICsgXCIgYW5kIGRlZmVuZCBvbiBwb2xlIGNoYXJnZSBzZXQgdG8gXCIgKyB0aGlzLmRlZmVuZE9uUG9sZUNoYXJnZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZpZ2h0VG9UaGVEZWF0aCgpIHtcclxuICAgICAgICB2YXIgd2lubmVyID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcyBsb25nIGFzIGJvdGggYXJlIHN0aWxsIGNvbnNjaW91cyBhbmQgYXQgbGVhc3Qgb25lIGNhbiBkbyBkYW1hZ2VcclxuICAgICAgICAgKiBOb3RlOiBldmVuIHRob3VnaCBvbmUgaGVybyBicmVha3MgYSB3ZWFwb24sIHRoZSBvdGhlciBjb3VsZCBhbHNvXHJcbiAgICAgICAgICogYnJlYWsgaXQgcmVzdWx0aW5nIGluIGEgdGllLlxyXG4gICAgICAgICAqIE5vIEhUSCBpcyBjb25zaWRlcmVkLlxyXG4gICAgICAgICAqIE5vIHNlY29uZCB3ZWFwb24gaXMgY29uc2lkZXJlZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICB3aGlsZSAoKHRoaXMuaGVybzEuaXNDb25zY2lvdXMgJiYgdGhpcy5oZXJvMi5pc0NvbnNjaW91cykgJiYgKHRoaXMuaGVybzEuY2FuRG9EYW1hZ2UgfHwgdGhpcy5oZXJvMi5jYW5Eb0RhbWFnZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yb3VuZCsrO1xyXG4gICAgICAgICAgICB0aGlzLmhlcm8xLm5ld1JvdW5kKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaGVybzIubmV3Um91bmQoKTtcclxuXHJcblxyXG4gICAgICAgICAgICBsb2coXCItLS0+IFJvdW5kIFwiICsgdGhpcy5yb3VuZCk7XHJcbiAgICAgICAgICAgIGxvZyhcIkhlcm8gMTogXCIgKyB0aGlzLmhlcm8xLm5hbWUgKyBcIiwgU1Q6IFwiICsgdGhpcy5oZXJvMS5nZXRTVCArIFwiKFwiICsgdGhpcy5oZXJvMS5hZGpTVCArIFwiKVwiKTtcclxuICAgICAgICAgICAgbG9nKFwiSGVybyAyOiBcIiArIHRoaXMuaGVybzIubmFtZSArIFwiLCBTVDogXCIgKyB0aGlzLmhlcm8yLmdldFNUICsgXCIoXCIgKyB0aGlzLmhlcm8yLmFkalNUICsgXCIpXCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpcnN0QXR0YWNrZXIgPSB0aGlzLmhlcm8xLCBzZWNvbmRBdHRhY2tlciA9IHRoaXMuaGVybzI7XHJcblxyXG4gICAgICAgICAgICAvKiBoaWdoZXN0IGFkakR4IGF0dGFja3MgZmlyc3QgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuaGVybzEuYWRqdXN0ZWREeCA8IHRoaXMuaGVybzIuYWRqdXN0ZWREeCkge1xyXG4gICAgICAgICAgICAgICAgZmlyc3RBdHRhY2tlciA9IHRoaXMuaGVybzI7XHJcbiAgICAgICAgICAgICAgICBzZWNvbmRBdHRhY2tlciA9IHRoaXMuaGVybzE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogcm9sbCB0byBzZWUgd2hvIGF0dGFja3MgZmlyc3QgKi9cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5oZXJvMS5hZGp1c3RlZER4ID09IHRoaXMuaGVybzIuYWRqdXN0ZWREeCkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZyhgQWRqdXN0ZWQgZGV4dGVyaXR5ICgke3RoaXMuaGVybzEuYWRqdXN0ZWREeH0pIGlzIHRoZSBzYW1lIGZvciBib3RoIGZpZ2h0ZXJzOyByb2xsaW5nIHRvIGRlY2lkZSBhdHRhY2sgb3JkZXJgKTtcclxuICAgICAgICAgICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC41KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RBdHRhY2tlciA9IHRoaXMuaGVybzI7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kQXR0YWNrZXIgPSB0aGlzLmhlcm8xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsb2coYCR7Zmlyc3RBdHRhY2tlci5uYW1lfSAoYWRqRHggPSAke2ZpcnN0QXR0YWNrZXIuYWRqdXN0ZWREeH0pIGF0dGFja3MgYmVmb3JlICR7c2Vjb25kQXR0YWNrZXIubmFtZX0gKGFkakR4ID0gJHtzZWNvbmRBdHRhY2tlci5hZGp1c3RlZER4fSlgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaGVybzEuc2V0Q2hhcmdpbmcoKHRoaXMucG9sZUNoYXJnZSkgJiYgKHRoaXMucm91bmQgPT0gMSkgJiYgdGhpcy5oZXJvMS5nZXRSZWFkaWVkV2VhcG9uLmlzUG9sZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaGVybzIuc2V0Q2hhcmdpbmcoKHRoaXMucG9sZUNoYXJnZSkgJiYgKHRoaXMucm91bmQgPT0gMSkgJiYgdGhpcy5oZXJvMi5nZXRSZWFkaWVkV2VhcG9uLmlzUG9sZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyeURlZmVuZGluZyh0aGlzLmhlcm8xLCB0aGlzLmhlcm8yLCB0aGlzLmRlZmVuZE9uUG9sZUNoYXJnZSk7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5RGVmZW5kaW5nKHRoaXMuaGVybzIsIHRoaXMuaGVybzEsIHRoaXMuZGVmZW5kT25Qb2xlQ2hhcmdlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJ5U3RhbmRVcChmaXJzdEF0dGFja2VyKTtcclxuICAgICAgICAgICAgdGhpcy50cnlTdGFuZFVwKHNlY29uZEF0dGFja2VyKTtcclxuICAgICAgICAgICAgdGhpcy50cnlQaWNrVXAoZmlyc3RBdHRhY2tlcik7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5UGlja1VwKHNlY29uZEF0dGFja2VyKTtcclxuICAgICAgICAgICAgdGhpcy50cnlBdHRhY2sodGhpcywgZmlyc3RBdHRhY2tlciwgc2Vjb25kQXR0YWNrZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeUF0dGFjayh0aGlzLCBzZWNvbmRBdHRhY2tlciwgZmlyc3RBdHRhY2tlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5oZXJvMS5jYW5Eb0RhbWFnZSkge1xyXG4gICAgICAgICAgICB3aW5uZXIgPSB0aGlzLmhlcm8xO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5oZXJvMi5jYW5Eb0RhbWFnZSkge1xyXG4gICAgICAgICAgICB3aW5uZXIgPSB0aGlzLmhlcm8yO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbm5lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAod2lubmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgbG9nKGAtLS0tLS0tPiBUaGUgd2lubmVyIG9mIHRoaXMgYm91dCBpcyAke3dpbm5lci5uYW1lfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbG9nKFwiLS0tLS0tLT4gVGhpcyBib3V0IHdhcyBhIFRJRSFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB3aW5uZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcml2YXRlIChzdGF0aWMpIGZ1bmN0aW9ucywgbXVzdCBiZSBwYXNzZWQgYSBcInRoaXNcIiBpZiB5b3UgbmVlZCBhY2Nlc3MgdG8gR2FtZVxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHRyeURlZmVuZGluZyhkZWZlbmRlcjogSGVybywgYXR0YWNrZXI6IEhlcm8sIGRlZmVuZE9uUG9sZUNoYXJnZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICghZGVmZW5kZXIuaXNLbm9ja2VkRG93blxyXG4gICAgICAgICAgICAmJiBkZWZlbmRlci5nZXRSZWFkaWVkV2VhcG9uICE9PSBXZWFwb24uTk9ORVxyXG4gICAgICAgICAgICAmJiBkZWZlbmRlci5zdWZmZXJpbmdEZXhQZW5hbHR5KClcclxuICAgICAgICAgICAgJiYgZGVmZW5kZXIuYWRqdXN0ZWREeCA8IDgpIHtcclxuXHJcbiAgICAgICAgICAgIGRlZmVuZGVyLnNldERlZmVuZGluZygpO1xyXG4gICAgICAgICAgICBsb2coYCR7ZGVmZW5kZXIubmFtZX0gaXMgZGVmZW5kaW5nIHRoaXMgdHVybiBiZWNhdXNlIGFkakRYIDwgOCBhbmQgdGVtcG9yYXJpbHkgcGVuYWxpemVkLmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChkZWZlbmRPblBvbGVDaGFyZ2VcclxuICAgICAgICAgICAgJiYgIWRlZmVuZGVyLmlzS25vY2tlZERvd25cclxuICAgICAgICAgICAgJiYgZGVmZW5kZXIuZ2V0UmVhZGllZFdlYXBvbiAhPT0gV2VhcG9uLk5PTkVcclxuICAgICAgICAgICAgJiYgYXR0YWNrZXIuZ2V0UmVhZGllZFdlYXBvbiAhPT0gV2VhcG9uLk5PTkVcclxuICAgICAgICAgICAgJiYgYXR0YWNrZXIuZ2V0UmVhZGllZFdlYXBvbi5pc1BvbGVcclxuICAgICAgICAgICAgJiYgYXR0YWNrZXIuaXNDaGFyZ2luZ1xyXG4gICAgICAgICAgICAmJiAhZGVmZW5kZXIuaXNDaGFyZ2luZyAgLy8gZG9uJ3QgZGVmZW5kIGlmIGFsc28gY2hhcmdpbmcgd2l0aCBwb2xlIHdlYXBvblxyXG4gICAgICAgICkge1xyXG5cclxuICAgICAgICAgICAgZGVmZW5kZXIuc2V0RGVmZW5kaW5nKCk7XHJcbiAgICAgICAgICAgIGxvZyhgJHtkZWZlbmRlci5uYW1lfSBpcyBkZWZlbmRpbmcgdGhpcyB0dXJuIGJlY2F1c2UgYXR0YWNrZXIgaXMgY2hhcmdpbmcgd2l0aCBwb2xlIHdlYXBvbi5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB0cnlTdGFuZFVwKGhlcm86IEhlcm8pIHtcclxuICAgICAgICBpZiAoaGVyby5pc0tub2NrZWREb3duKSB7XHJcbiAgICAgICAgICAgIGhlcm8uc3RhbmRVcCgpO1xyXG5cclxuICAgICAgICAgICAgbG9nKGAke2hlcm8ubmFtZX0gaXMgc3RhbmRpbmcgdXAgdGhpcyB0dXJuLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyeVBpY2tVcChoZXJvOiBIZXJvKSB7XHJcbiAgICAgICAgaWYgKGhlcm8uZ2V0RHJvcHBlZFdlYXBvbigpICE9PSBXZWFwb24uTk9ORSkge1xyXG4gICAgICAgICAgICBoZXJvLnBpY2tVcFdlYXBvbigpO1xyXG4gICAgICAgICAgICBsb2coYCR7aGVyby5uYW1lfSBpcyBwaWNraW5nIHVwIGhpcyB3ZWFwb24gdGhpcyB0dXJuIChyZWFyIGZhY2luZyBpbiBhbGwgc2l4IGRpcmVjdGlvbnMpLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlc29sdmVBdHRhY2soZ2FtZTogR2FtZSwgYXR0YWNrZXI6IEhlcm8sIGF0dGFja2VlOiBIZXJvLCByb2xsOiBudW1iZXIsIG51bURpY2U6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBmYWNpbmdCb251cyA9IGF0dGFja2VlLmlzUHJvbmUgPyA0IDogMDtcclxuXHJcbiAgICAgICAgbG9nKGF0dGFja2VyLm5hbWUgKyBcIiByb2xsZWQgXCIgKyByb2xsICsgXCIgYW5kIGFkakRleCBpcyBcIlxyXG4gICAgICAgICAgICArIChhdHRhY2tlZS5pc1Byb25lID8gKGF0dGFja2VyLmFkanVzdGVkRHggKyBmYWNpbmdCb251cyArIFwiIChcIiArIGF0dGFja2VyLmFkanVzdGVkRHggKyBcIiArIFwiICsgZmFjaW5nQm9udXMgKyBcIiwgdGFyZ2V0IGlzIHByb25lLCBpLmUuLCBrbm9ja2VkIGRvd24gb3IgcGlja2luZyB1cCBhIHdlYXBvbilcIilcclxuICAgICAgICAgICAgICAgIDogYXR0YWNrZXIuYWRqdXN0ZWREeCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIGhpdCBpcyBhIHJvbGwgdGhhdCBpc1xyXG4gICAgICAgICAqIE5PVCBhbiBhdXRvbWF0aWMgbWlzcyBBTkRcclxuICAgICAgICAgKiAoYmVsb3cgb3IgZXF1YWwgdG8gdGhlIGF0dGFja2VyJ3MgYWRqRGV4IE9SIGFuZCBhdXRvbWF0aWMgaGl0KVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdGhpcy5pc0F1dG9tYXRpY01pc3Mocm9sbCwgbnVtRGljZSkgJiYgKHJvbGwgPD0gYXR0YWNrZXIuYWRqdXN0ZWREeCArIGZhY2luZ0JvbnVzIHx8IHRoaXMuaXNBdXRvbWF0aWNIaXQocm9sbCwgbnVtRGljZSkpKSB7XHJcbiAgICAgICAgICAgIGxvZyhcIkhJVCEhISFcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGl0cyA9IGF0dGFja2VyLmdldFJlYWRpZWRXZWFwb24uZG9EYW1hZ2UoKTtcclxuICAgICAgICAgICAgaWYgKGF0dGFja2VyLmlzQ2hhcmdpbmcgJiYgYXR0YWNrZXIuZ2V0UmVhZGllZFdlYXBvbi5pc1BvbGUpIHtcclxuICAgICAgICAgICAgICAgIGxvZyhcIlBvbGUgd2VhcG9uIGNoYXJnZSBkb2VzIGRvdWJsZSBkYW1hZ2UhXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jcml0aWNhbEhpdHMrKztcclxuICAgICAgICAgICAgICAgIGhpdHMgKj0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0RvdWJsZURhbWFnZShyb2xsLCBudW1EaWNlKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiRG91YmxlIGRhbWFnZSEgKHJvbGwgb2YgXCIgKyByb2xsICsgXCIgb24gXCIgKyBudW1EaWNlICsgXCIgZGljZS4pXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jcml0aWNhbEhpdHMrKztcclxuICAgICAgICAgICAgICAgIGhpdHMgKj0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzVHJpcGxlRGFtYWdlKHJvbGwsIG51bURpY2UpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJUcmlwbGUgZGFtYWdlISAocm9sbCBvZiBcIiArIHJvbGwgKyBcIiBvbiBcIiArIG51bURpY2UgKyBcIiBkaWNlLilcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmNyaXRpY2FsSGl0cysrO1xyXG4gICAgICAgICAgICAgICAgaGl0cyAqPSAzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxvZyhcIlRvdGFsIGRhbWFnZSBkb25lIGJ5IFwiICsgYXR0YWNrZXIuZ2V0UmVhZGllZFdlYXBvbi5uYW1lICsgXCI6IFwiICsgaGl0cyArIFwiIGhpdHNcIik7XHJcbiAgICAgICAgICAgIGF0dGFja2VlLnRha2VIaXRzKGhpdHMpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogSXQncyBhIG1pc3NcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGxvZyhcIk1pc3NlZC4gXCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Ryb3BwZWRXZWFwb24ocm9sbCwgbnVtRGljZSkpIHtcclxuICAgICAgICAgICAgICAgIGxvZyhcIkRyb3BwZWQgd2VhcG9uISBcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmNyaXRpY2FsTWlzc2VzKys7XHJcbiAgICAgICAgICAgICAgICBhdHRhY2tlci5kcm9wV2VhcG9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pc0Jyb2tlbldlYXBvbihyb2xsLCBudW1EaWNlKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiQnJva2Ugd2VhcG9uISBcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmNyaXRpY2FsTWlzc2VzKys7XHJcbiAgICAgICAgICAgICAgICBhdHRhY2tlci5icmVha1dlYXBvbigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgdHJ5QXR0YWNrKGdhbWU6IEdhbWUsIGF0dGFja2VyOiBIZXJvLCBhdHRhY2tlZTogSGVybykge1xyXG4gICAgICAgIGxvZyhhdHRhY2tlci5uYW1lICsgXCIgZ2V0cyBoaXMgdHVybiB0byBhdHRhY2suXCIpO1xyXG4gICAgICAgIGlmICghYXR0YWNrZXIuaXNEZWZlbmRpbmcoKSkge1xyXG4gICAgICAgICAgICBpZiAoYXR0YWNrZXIuaXNDb25zY2lvdXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICghYXR0YWNrZXIuaXNLbm9ja2VkRG93bikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2tlci5nZXRSZWFkaWVkV2VhcG9uICE9PSBXZWFwb24uTk9ORSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXR0YWNrZXIuaXNDaGFyZ2luZykgbG9nKFwiSGUncyBjaGFyZ2luZyB3aXRoIHBvbGUgd2VhcG9uIChkb3VibGUgZGFtYWdlIGlmIGhlIGhpdHMpLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG51bURpY2UgPSBhdHRhY2tlZS5pc0RlZmVuZGluZygpID8gNCA6IDM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyhcIlJvbGxpbmcgdG8gaGl0IG9uIFwiICsgbnVtRGljZSArIFwiIGRpY2UuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmVBdHRhY2soZ2FtZSwgYXR0YWNrZXIsIGF0dGFja2VlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sbERpY2UobnVtRGljZSksIG51bURpY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coXCJCdXQgaGUncyBub3QgYWJsZSB0byBhdHRhY2sgYmVjYXVzZSBoZSBoYXMgaGFzIG5vIHJlYWRpZWQgd2VhcG9uLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsb2coXCJCdXQgaGUncyBub3QgYWJsZSB0byBhdHRhY2sgYmVjYXVzZSBoZSB3YXMga25vY2tlZCBkb3duLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2coXCJCdXQgaGUncyBub3QgYWJsZSB0byBhdHRhY2sgYmVjYXVzZSBoZSdzIFwiICsgKGF0dGFja2VyLmlzQWxpdmUgPyBcInVuY29uc2Npb3VzLlwiIDogXCJkZWFkLlwiKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgbG9nKFwiQnV0IGhlJ3MgZGVmZW5kaW5nLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGlzQXV0b21hdGljTWlzcyhyb2xsOiBudW1iZXIsIG51bURpY2U6IG51bWJlcikge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKG51bURpY2UpIHtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJvbGwgPj0gMTYpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbCA+PSAyMCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInVuc3VwcG9ydGVkIHZhbHVlIGZvciByb2xsOiBcIiArIHJvbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaXNBdXRvbWF0aWNIaXQocm9sbDogbnVtYmVyLCBudW1EaWNlOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChudW1EaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsIDw9IDUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyA0IGRpY2UgaXMgYXNzdW1lZCB0byBiZSBkZWZlbmRpbmcgLSBubyBhdXRtYXRpYyBoaXRzIGFjY29yZGluZyB0byBNZWxlZSBydWxlc1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInVuc3VwcG9ydGVkIHZhbHVlIGZvciByb2xsOiBcIiArIHJvbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaXNEb3VibGVEYW1hZ2Uocm9sbDogbnVtYmVyLCBudW1EaWNlOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChudW1EaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsID09IDQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyA0IGRpY2UgaXMgYXNzdW1lZCB0byBiZSBkZWZlbmRpbmcgLSBubyBkb3VibGUgZGFtYWdlIGFjY29yZGluZyB0byBNZWxlZSBydWxlc1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInVuc3VwcG9ydGVkIHZhbHVlIGZvciByb2xsOiBcIiArIHJvbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaXNUcmlwbGVEYW1hZ2Uocm9sbDogbnVtYmVyLCBudW1EaWNlOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChudW1EaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsID09IDMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyA0IGRpY2UgaXMgYXNzdW1lZCB0byBiZSBkZWZlbmRpbmcgLSBubyBkb3VibGUgZGFtYWdlIGFjY29yZGluZyB0byBNZWxlZSBydWxlc1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInVuc3VwcG9ydGVkIHZhbHVlIGZvciByb2xsOiBcIiArIHJvbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaXNEcm9wcGVkV2VhcG9uKHJvbGw6IG51bWJlciwgbnVtRGljZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHN3aXRjaCAobnVtRGljZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbCA9PSAxNyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICgocm9sbCA9PSAyMSkgfHwgKHJvbGwgPT0gMjIpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgdmFsdWUgZm9yIHJvbGw6IFwiICsgcm9sbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc0Jyb2tlbldlYXBvbihyb2xsOiBudW1iZXIsIG51bURpY2U6IG51bWJlcikge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKG51bURpY2UpIHtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJvbGwgPT0gMTgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAoKHJvbGwgPT0gMjMpIHx8IChyb2xsID09IDI0KSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInVuc3VwcG9ydGVkIHZhbHVlIGZvciByb2xsOiBcIiArIHJvbGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuXHJcbiAgICBzdGF0aWMgY3JlYXRlSGVyb2VzTWFwKCkge1xyXG4gICAgICAgIC8vIGhlcm9TZXQucHV0KG5ldyBIZXJvKFwiMDAxOlNUODtEWDE2O0RBR0dFUjtOT19BUk1PUjtTTUFMTF9TSElFTERcIiwgOCwgMTYsIFdlYXBvbi5EQUdHRVIsIEFybW9yLk5PX0FSTU9SLCBTaGllbGQuU01BTExfU0hJRUxEKSwgbmV3IEludGVnZXIoMCkpO1xyXG4gICAgICAgIHZhciBoMTtcclxuICAgICAgICB2YXIgaGVyb2VzTGlzdEpTT04gPSBIZXJvZXNTaW5nbGV0b24uZ2V0SGVyb2VzTGlzdEpTT04oKTtcclxuICAgICAgICB2YXIgaGVyb0pTT04gPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGVyb2VzTGlzdEpTT04ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaGVyb0pTT04gPSBoZXJvZXNMaXN0SlNPTltpXTtcclxuICAgICAgICAgICAgaDEgPSBuZXcgSGVybyhIZXJvZXNTaW5nbGV0b24uZ2V0TmFtZUZyb21JRChoZXJvSlNPTi5pZCksIGhlcm9KU09OLnN0LCBoZXJvSlNPTi5keCwgaGVyb0pTT04ud2VhcG9uLCBoZXJvSlNPTi5hcm1vciwgaGVyb0pTT04uc2hpZWxkKTtcclxuICAgICAgICAgICAgLy90aGlzLnB1dEhlcm8oaDEpO1xyXG4gICAgICAgICAgICB0aGlzLmhlcm9NYXAuc2V0KGgxLm5hbWUsIGgxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZGlzcGxheUhlcm9lc01hcCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhHYW1lLmhlcm9NYXApKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGdldEhlcm9NYXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIEdhbWUuaGVyb01hcDtcclxuICAgIH07XHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBXZWFwb24gfSBmcm9tIFwiLi93ZWFwb25cIjtcclxuaW1wb3J0IHsgU2hpZWxkIH0gZnJvbSBcIi4vc2hpZWxkXCI7XHJcbmltcG9ydCB7IEFybW9yIH0gZnJvbSBcIi4vYXJtb3JcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhlcm8ge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudElkID0gMDtcclxuICAgIHByaXZhdGUgX2lkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9zdDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZHg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX21hOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF93ZWFwb246IFdlYXBvbjtcclxuICAgIHByaXZhdGUgX3JlYWRpZWRXZWFwb246IFdlYXBvbjtcclxuICAgIHByaXZhdGUgX2FybW9yOiBBcm1vcjtcclxuICAgIHByaXZhdGUgX3NoaWVsZDogU2hpZWxkO1xyXG4gICAgcHJpdmF0ZSBfa25vY2tlZERvd246IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zdGFuZGluZ1VwOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcGlja2luZ1VwV2VhcG9uOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfZHJvcHBlZFdlYXBvbjogV2VhcG9uO1xyXG4gICAgcHJpdmF0ZSBfZGFtYWdlVGFrZW46IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2RhbWFnZVRha2VuVGhpc1JvdW5kOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9pbmp1cnlEZXhQZW5hbHR5OiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcmVjb3ZlcmluZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2RlZmVuZGluZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2NoYXJnaW5nOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3Q6IG51bWJlciwgZHg6IG51bWJlciwgd2VhcG9uOiBXZWFwb24sIGFybW9yOiBBcm1vciwgc2hpZWxkOiBTaGllbGQpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IEhlcm8uY3VycmVudElkKys7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5fc3QgPSBzdDtcclxuICAgICAgICB0aGlzLl9keCA9IGR4O1xyXG4gICAgICAgIHRoaXMuX21hID0gMTA7IC8vIGhhcmQtY29kZWQgZm9yIGh1bWFuc1xyXG4gICAgICAgIHRoaXMuX3JlYWRpZWRXZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgdGhpcy5fYXJtb3IgPSBhcm1vcjtcclxuICAgICAgICB0aGlzLl9zaGllbGQgPSBzaGllbGQ7XHJcbiAgICAgICAgdGhpcy5fa25vY2tlZERvd24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zdGFuZGluZ1VwID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcGlja2luZ1VwV2VhcG9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fd2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHRoaXMuX2Ryb3BwZWRXZWFwb24gPSBXZWFwb24uTk9ORTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGFtYWdlVGFrZW4gPSAwO1xyXG4gICAgICAgIHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kID0gMDtcclxuICAgICAgICB0aGlzLl9pbmp1cnlEZXhQZW5hbHR5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVjb3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2RlZmVuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2NoYXJnaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpZCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldFNUKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0O1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFkalNUKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4sIDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldE1BKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFkanVzdGVkTUEoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWEgLSB0aGlzLl9hcm1vci5tYUFkajtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBnZXREWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9keDtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBhZGp1c3RlZER4KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R4IC0gdGhpcy5fYXJtb3IuZHhBZGogLSB0aGlzLl9zaGllbGQuZHhBZGogLSAodGhpcy5faW5qdXJ5RGV4UGVuYWx0eSA/IDIgOiAwKSAtICh0aGlzLmlzU3RyZW5ndGhMb3dQZW5hbHR5ID8gMyA6IDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGRhbWFnZVRha2VuVGhpc1JvdW5kKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzQWxpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9zdCAtIHRoaXMuX2RhbWFnZVRha2VuID4gMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNDb25zY2lvdXMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9zdCAtIHRoaXMuX2RhbWFnZVRha2VuID4gMSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNLbm9ja2VkRG93bigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fa25vY2tlZERvd247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGFuZFVwKCkge1xyXG4gICAgICAgIHRoaXMuX3N0YW5kaW5nVXAgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZXNlIHJ1bGVzIG1heWJlIHNob3VsZCBnbyBpbnRvIEdhbWUgKGJldHRlciBjb2hlc2lvbilcclxuICAgICAqL1xyXG4gICAgcHVibGljIG5ld1JvdW5kKCkge1xyXG4gICAgICAgIHRoaXMuX2NoYXJnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZGVmZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGFuZGluZ1VwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2tub2NrZWREb3duID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YW5kaW5nVXAgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fcGlja2luZ1VwV2VhcG9uKSAgLy8gdGVjaG5pY2FsbHkgXCJ3YXNcIiBwaWNraW5nIHVwIHdlYXBvbiBsYXN0IHJvdW5kXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWFkaWVkV2VhcG9uID0gdGhpcy5fZHJvcHBlZFdlYXBvbjtcclxuICAgICAgICAgICAgdGhpcy5fZHJvcHBlZFdlYXBvbiA9IFdlYXBvbi5OT05FO1xyXG4gICAgICAgICAgICB0aGlzLl9waWNraW5nVXBXZWFwb24gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRGV4IHBlbmFsdHkgZHVlIHRvIGluanVyeSBsYXN0cyBvbmUgY29tcGxldGUgcm91bmRcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5faW5qdXJ5RGV4UGVuYWx0eSAmJiB0aGlzLl9yZWNvdmVyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luanVyeURleFBlbmFsdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVjb3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9pbmp1cnlEZXhQZW5hbHR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY292ZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRha2VIaXRzKGhpdHM6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBhcm1vclBvaW50cyA9IHRoaXMuX2FybW9yLmhpdHNTdG9wcGVkICsgdGhpcy5fc2hpZWxkLmhpdHNTdG9wcGVkO1xyXG4gICAgICAgIHZhciBkYW1hZ2VEb25lID0gaGl0cyAtIGFybW9yUG9pbnRzO1xyXG4gICAgICAgIGlmIChkYW1hZ2VEb25lIDwgMCkgZGFtYWdlRG9uZSA9IDA7XHJcblxyXG5cclxuICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIHRha2luZyBcIiArIGhpdHMgKyBcIiBoaXRzLlwiKTtcclxuICAgICAgICBsb2codGhpcy5fYXJtb3IubmFtZSArIFwiIHN0b3BzIFwiICsgdGhpcy5fYXJtb3IuaGl0c1N0b3BwZWQpO1xyXG4gICAgICAgIGxvZyh0aGlzLl9zaGllbGQubmFtZSArIFwiIHN0b3BzIFwiICsgdGhpcy5fc2hpZWxkLmhpdHNTdG9wcGVkKTtcclxuICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIHRha2luZyBcIiArIGRhbWFnZURvbmUgKyBcIiBkYW1hZ2UuXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnRha2VEYW1hZ2UoZGFtYWdlRG9uZSk7XHJcbiAgICAgICAgcmV0dXJuIGRhbWFnZURvbmU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWZ0ZXIgaXQncyBnb3QgcGFzdCBhcm1vciwgZXRjLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdGFrZURhbWFnZShkYW1hZ2VEb25lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kYW1hZ2VUYWtlbiArPSBkYW1hZ2VEb25lO1xyXG4gICAgICAgIHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kICs9IGRhbWFnZURvbmU7XHJcbiAgICAgICAgdGhpcy5faW5qdXJ5RGV4UGVuYWx0eSA9IHRoaXMuc3VmZmVyaW5nRGV4UGVuYWx0eSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5qdXJ5RGV4UGVuYWx0eSkgbG9nKHRoaXMuX25hbWUgKyBcIiBoYXMgYW4gYWRqRHggcGVuYWx0eSBvZiAtMiBmb3IgcmVtYWluZGVyIG9mIHRoaXMgcm91bmQgYW5kIHRoZSBORVhUIHJvdW5kLlwiKTtcclxuICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIGhhcyBub3cgdGFrZW4gXCIgKyB0aGlzLl9kYW1hZ2VUYWtlbiArIFwiIHBvaW50cyBvZiBkYW1hZ2UsIFNUID0gXCIgKyB0aGlzLl9zdCArICh0aGlzLl9kYW1hZ2VUYWtlbiA+PSB0aGlzLl9zdCA/IFwiIGFuZCBpcyBERUFELlwiIDogKHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4gPT09IDEgPyBcIiBhbmQgaXMgVU5DT05TQ0lPVVMuXCIgOiBcIi5cIikpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kID49IDgpIHtcclxuICAgICAgICAgICAgdGhpcy5fa25vY2tlZERvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIGhhcyBiZWVuIGtub2NrZWQgZG93biBieSBkYW1hZ2UuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1N0cmVuZ3RoTG93UGVuYWx0eSkgbG9nKHRoaXMuX25hbWUgKyBcIiBoYXMgYW4gYWRkaXRpb25hbCBEWCBhZGp1c3RtZW50IG9mIC0zIGR1ZSB0byBTVCA8PSAzLlwiKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzdWZmZXJpbmdEZXhQZW5hbHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQgPj0gNSB8fCB0aGlzLl9yZWNvdmVyaW5nKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc1N0cmVuZ3RoTG93UGVuYWx0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4gPD0gMyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZXREZWZlbmRpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5fZGVmZW5kaW5nID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGlzRGVmZW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZlbmRpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZXRDaGFyZ2luZyhpc0NoYXJnaW5nOiBib29sZWFuKSB7XHJcbiAgICAgICAgLy8gICAgICAgIGxvZyhcIkhlcm86IHNldENoYXJnZSB0byBcIiArIGlzQ2hhcmdpbmcpO1xyXG4gICAgICAgIHRoaXMuX2NoYXJnaW5nID0gaXNDaGFyZ2luZztcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc0NoYXJnaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFyZ2luZztcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc1Byb25lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9waWNraW5nVXBXZWFwb247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNQaWNraW5nVXBXZWFwb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpY2tpbmdVcFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldFdlYXBvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2VhcG9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldFJlYWRpZWRXZWFwb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRpZWRXZWFwb247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBkcm9wV2VhcG9uKCkge1xyXG4gICAgICAgIHRoaXMuX2Ryb3BwZWRXZWFwb24gPSB0aGlzLl9yZWFkaWVkV2VhcG9uO1xyXG4gICAgICAgIHRoaXMuX3JlYWRpZWRXZWFwb24gPSBXZWFwb24uTk9ORTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGJyZWFrV2VhcG9uKCkge1xyXG4gICAgICAgIHRoaXMuX3JlYWRpZWRXZWFwb24gPSBXZWFwb24uTk9ORTtcclxuICAgICAgICB0aGlzLl9kcm9wcGVkV2VhcG9uID0gV2VhcG9uLk5PTkU7IC8vIHNob3VsZG4ndCBuZWVkIHRoaXMsIGJ1dCBqdXN0IGluIGNhc2VcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldERyb3BwZWRXZWFwb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Ryb3BwZWRXZWFwb247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBwaWNrVXBXZWFwb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcGlja2luZ1VwV2VhcG9uID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBnZXRBcm1vcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXJtb3I7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZXRBcm1vcihhcm1vcjogQXJtb3IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXJtb3IgPSBhcm1vcjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBhcm1vclBvaW50cygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcm1vci5oaXRzU3RvcHBlZCArIHRoaXMuX3NoaWVsZC5oaXRzU3RvcHBlZDtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBnZXRTaGllbGQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoaWVsZDtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBgJHt0aGlzLl9uYW1lfTpTVCR7dGhpcy5fc3R9O0RYJHt0aGlzLl9keH07JHt0aGlzLl93ZWFwb24ubmFtZX07JHt0aGlzLl9hcm1vci5uYW1lfTske3RoaXMuX3NoaWVsZC5uYW1lfWA7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgY2FuRG9EYW1hZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDb25zY2lvdXMgJiYgKHRoaXMuX3JlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FIHx8IHRoaXMuX2Ryb3BwZWRXZWFwb24gIT09IFdlYXBvbi5OT05FKVxyXG4gICAgfTtcclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IFdlYXBvbiB9IGZyb20gXCIuL3dlYXBvblwiO1xyXG5pbXBvcnQgeyBBcm1vciB9IGZyb20gXCIuL2FybW9yXCI7XHJcbmltcG9ydCB7IFNoaWVsZCB9IGZyb20gXCIuL3NoaWVsZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhlcm9lc1NpbmdsZXRvbiB7XHJcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85NzUzODQxLzExNjgzNDJcclxuICAgIHByaXZhdGUgc3RhdGljIGxpc3RIZWlnaHQgPSAxNTtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlcm9lc0xpc3RKU09OID1cclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwMVwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDAyXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwM1wiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA0XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDVcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwNlwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDdcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwOFwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA5XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTBcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDExXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTJcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxM1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE0XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxNVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE2XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTdcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMThcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxOVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyMFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyMVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyMlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIzXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI0XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI1XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDI2XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjdcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjhcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjlcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzBcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzMVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzMlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzM1wiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzNFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM1XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM2XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM3XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM4XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzlcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDBcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDFcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQyXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQzXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0NFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDVcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ2XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ3XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0OFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDlcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDUwXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDUxXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1MlwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTNcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU0XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU1XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1NlwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTdcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU4XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU5XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2MFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjFcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDYyXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDYzXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2NFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjVcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2NlwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjdcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2OFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY5XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3MFwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3MVwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzJcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDczXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3NFwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3NVwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzZcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc3XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzhcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc5XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODBcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4MVwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgyXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4M1wiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg0XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODVcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg2XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg3XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4OFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODlcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDkwXCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDkxXCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5MlwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTNcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5NFwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTVcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5NlwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk3XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5OFwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5OVwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDBcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTAxXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDJcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTAzXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDRcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwNVwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDZcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDdcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA4XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH1cclxuICAgICAgICBdO1xyXG4gICAgc3RhdGljIGdldEhlcm9lc0xpc3RKU09OKCkge1xyXG4gICAgICAgIHJldHVybiBIZXJvZXNTaW5nbGV0b24uaGVyb2VzTGlzdEpTT047XHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGdldExpc3RIZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlcm9lc1NpbmdsZXRvbi5saXN0SGVpZ2h0O1xyXG4gICAgfTtcclxuICAgIHN0YXRpYyBnZXROYW1lRnJvbUlEKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBoZXJvID0gdGhpcy5oZXJvZXNMaXN0SlNPTi5maW5kKGhlcm8gPT4gaGVyby5pZCA9PSBpZCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGhlcm8gPyBgJHtoZXJvLmlkfTpTVCR7aGVyby5zdH07RFgke2hlcm8uZHh9OyR7aGVyby53ZWFwb24ubmFtZX07JHtoZXJvLmFybW9yLm5hbWV9OyR7aGVyby5zaGllbGQubmFtZX1gLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvWyAtXS9nLCAnXycpIDogYChoZXJvIGlkICR7aWR9IG5vdCBmb3VuZClgO1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBTaGllbGQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaGl0c1N0b3BwZWQ6IG51bWJlcjtcclxuICAgIGR4QWRqOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGhpdHNTdG9wcGVkOiBudW1iZXIsIGR4QWRqOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5oaXRzU3RvcHBlZCA9IGhpdHNTdG9wcGVkO1xyXG4gICAgICAgIHRoaXMuZHhBZGogPSBkeEFkajtcclxuICAgIH1cclxuICAgIHN0YXRpYyBOT19TSElFTEQgPSBuZXcgU2hpZWxkKFwiTm8gc2hpZWxkXCIsIDAsIDApO1xyXG4gICAgc3RhdGljIFNNQUxMX1NISUVMRCA9IG5ldyBTaGllbGQoXCJTbWFsbCBzaGllbGRcIiwgMSwgMCk7XHJcbiAgICBzdGF0aWMgTEFSR0VfU0hJRUxEID0gbmV3IFNoaWVsZChcIkxhcmdlIHNoaWVsZFwiLCAyLCAxKTtcclxufVxyXG4iLCJpbXBvcnQgeyByb2xsRGljZSB9IGZyb20gXCIuL2RpZVwiO1xyXG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi4vbG9nZ2VyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VhcG9uIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHN0OiBudW1iZXI7XHJcbiAgICBkaWNlOiBudW1iZXI7XHJcbiAgICBtb2RpZmllcjogbnVtYmVyO1xyXG4gICAgaXNUd29IYW5kZWQ6IGJvb2xlYW47XHJcbiAgICBpc1Rocm93bjogYm9vbGVhbjtcclxuICAgIGlzUG9sZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3Q6IG51bWJlcixcclxuICAgICAgICBkaWNlOiBudW1iZXIsXHJcbiAgICAgICAgbW9kaWZpZXI6IG51bWJlcixcclxuICAgICAgICBpc1R3b0hhbmRlZDogYm9vbGVhbixcclxuICAgICAgICBpc1Rocm93bjogYm9vbGVhbixcclxuICAgICAgICBpc1BvbGU6IGJvb2xlYW4sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3QgPSBzdDtcclxuICAgICAgICB0aGlzLmRpY2UgPSBkaWNlO1xyXG4gICAgICAgIHRoaXMubW9kaWZpZXIgPSBtb2RpZmllcjtcclxuICAgICAgICB0aGlzLmlzVHdvSGFuZGVkID0gaXNUd29IYW5kZWQ7XHJcbiAgICAgICAgdGhpcy5pc1BvbGUgPSBpc1BvbGU7XHJcbiAgICAgICAgdGhpcy5pc1Rocm93biA9IGlzVGhyb3duO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb0RhbWFnZSgpIHtcclxuICAgICAgICBsb2coXHJcbiAgICAgICAgICAgIFwiUm9sbGluZyBmb3Igd2VhcG9uIGRvaW5nIFwiXHJcbiAgICAgICAgICAgICsgdGhpcy5kaWNlXHJcbiAgICAgICAgICAgICsgXCJkXCJcclxuICAgICAgICAgICAgKyAoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIilcclxuICAgICAgICAgICAgKyAoKHRoaXMubW9kaWZpZXIgIT09IDApID8gdGhpcy5tb2RpZmllciA6IFwiXCIpXHJcbiAgICAgICAgICAgICsgXCIgZGFtYWdlLlwiKTtcclxuICAgICAgICBsZXQgZGFtYWdlID0gMDtcclxuICAgICAgICBkYW1hZ2UgKz0gcm9sbERpY2UodGhpcy5kaWNlKTtcclxuICAgICAgICBkYW1hZ2UgKz0gdGhpcy5tb2RpZmllcjtcclxuICAgICAgICBpZiAodGhpcy5tb2RpZmllciAhPT0gMCkgbG9nKCgodGhpcy5tb2RpZmllciA+IDApID8gXCIrXCIgOiBcIlwiKSArIHRoaXMubW9kaWZpZXIpO1xyXG4gICAgICAgIGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG4gICAgICAgIGxvZyhgVG90YWwgd2VhcG9uIGRhbWFnZTogJHtkYW1hZ2V9YCk7XHJcbiAgICAgICAgcmV0dXJuIGRhbWFnZTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyBcIiAoXCIgKyB0aGlzLmRpY2UgKyBcIkRcIiArICgodGhpcy5tb2RpZmllciA+IDApID8gXCIrXCIgOiBcIlwiKSArICgodGhpcy5tb2RpZmllciAhPT0gMCkgPyB0aGlzLm1vZGlmaWVyIDogXCJcIikgKyBcIilcIjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIE5PTkUgPSBuZXcgV2VhcG9uKFwiTm9uZVwiLCAwLCAwLCAwLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBEQUdHRVIgPSBuZXcgV2VhcG9uKFwiRGFnZ2VyXCIsIDAsIDEsIC0xLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFJBUElFUiA9IG5ldyBXZWFwb24oXCJSYXBpZXJcIiwgOSwgMSwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQ0xVQiA9IG5ldyBXZWFwb24oXCJDbHViXCIsIDksIDEsIDAsIHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgSEFNTUVSID0gbmV3IFdlYXBvbihcIkhhbW1lclwiLCAxMCwgMSwgMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBDVVRMQVNTID0gbmV3IFdlYXBvbihcIkN1dGxhc3NcIiwgMTAsIDIsIC0yLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBTSE9SVFNXT1JEID0gbmV3IFdlYXBvbihcIlNob3J0c3dvcmRcIiwgMTEsIDIsIC0xLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBNQUNFID0gbmV3IFdlYXBvbihcIk1hY2VcIiwgMTEsIDIsIC0xLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFNNQUxMX0FYID0gbmV3IFdlYXBvbihcIlNtYWxsIGF4XCIsIDExLCAxLCAyLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEJST0FEU1dPUkQgPSBuZXcgV2VhcG9uKFwiQnJvYWRzd29yZFwiLCAxMiwgMiwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgTU9STklOR1NUQVIgPSBuZXcgV2VhcG9uKFwiTW9ybmluZ3N0YXJcIiwgMTMsIDIsIDEsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFRXT19IQU5ERURfU1dPUkQgPSBuZXcgV2VhcG9uKFwiVHdvLWhhbmRlZCBzd29yZFwiLCAxNCwgMywgLTEsIGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQkFUVExFQVhFID0gbmV3IFdlYXBvbihcIkJhdHRsZWF4ZVwiLCAxNSwgMywgMCwgZmFsc2UsIHRydWUsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBwb2xlIHdlYXBvbnNcclxuICAgIHN0YXRpYyBKQVZFTElOID0gbmV3IFdlYXBvbihcIkphdmVsaW5cIiwgOSwgMSwgLTEsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuICAgIHN0YXRpYyBTUEVBUiA9IG5ldyBXZWFwb24oXCJTcGVhclwiLCAxMSwgMSwgMSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBzdGF0aWMgSEFMQkVSRCA9IG5ldyBXZWFwb24oXCJIYWxiZXJkXCIsIDEzLCAyLCAtMSwgZmFsc2UsIHRydWUsIHRydWUpO1xyXG4gICAgc3RhdGljIFBJS0VfQVhFID0gbmV3IFdlYXBvbihcIlBpa2UgYXhlXCIsIDE1LCAyLCAyLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7ICAgIC8vIEFuZCBub3cgcmV0dXJuIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG5cclxufVxyXG5cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IEdhbWUgfSBmcm9tIFwiLi4vbWVsZWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyBIZXJvIH0gZnJvbSBcIi4uL21lbGVlL2hlcm9cIjtcclxuaW1wb3J0IHsgbG9nLCBzZXRNdXRlIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5pbXBvcnQgeyBIZXJvZXNTaW5nbGV0b24gfSBmcm9tIFwiLi4vbWVsZWUvaGVyb2VzU2luZ2xldG9uXCI7XHJcblxyXG5jb25zdCBjdHg6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xyXG5cclxubGV0IHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCA9IGZhbHNlO1xyXG5sZXQgZGVmZW5kVnNQb2xlQ2hhcmdlID0gZmFsc2U7XHJcblxyXG5jdHguYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudDogYW55KSB7XHJcbiAgICAvKipcclxuICAgICAqIHBhcnNlIHRoZSBtZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhO1xyXG4gICAgY29uc29sZS5sb2coYFdvcmtlcjogZ290IG1lc3NhZ2UgJHtkYXRhLmNtZH1gKTtcclxuICAgIHN3aXRjaCAoZGF0YS5jbWQpIHtcclxuICAgICAgICBjYXNlIFwid2FrZSB1cFwiOlxyXG4gICAgICAgICAgICBjdHgucG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcIndvcmtlciB3YWl0aW5nXCIgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zdCBoZXJvU2V0ID0gbmV3IEFycmF5PEhlcm8+KCk7ICAvLyBsaXN0IG9mIGhlcm9lcyB0byBmaWdodFxyXG5cclxuICAgICAgICAgICAgR2FtZS5jcmVhdGVIZXJvZXNNYXAoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlSGVyb01hcCA9IEdhbWUuZ2V0SGVyb01hcCgpO1xyXG4gICAgICAgICAgICBkYXRhLnNlbGVjdGVkSGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKGhlcm9JRDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVybyA9IGNvbXBsZXRlSGVyb01hcC5nZXQoSGVyb2VzU2luZ2xldG9uLmdldE5hbWVGcm9tSUQoaGVyb0lEKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGVybykgaGVyb1NldC5wdXNoKGhlcm8pOyBlbHNlIGNvbnNvbGUubG9nKGAgICEhISBEaWRuJ3QgZmluZCAke0hlcm9lc1NpbmdsZXRvbi5nZXROYW1lRnJvbUlEKGhlcm9JRCl9ICgke2hlcm9JRH0pIGluIG1hcCAhISFgKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ29uZmlndXJlIHNpbXVsYXRvciBvcHRpb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZXRNdXRlKCFkYXRhLmlzVmVyYm9zZSk7XHJcbiAgICAgICAgICAgIHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCA9IGRhdGEuaXNQb2xlV2VhcG9uc0NoYXJnZUZpcnN0Um91bmQ7XHJcbiAgICAgICAgICAgIGRlZmVuZFZzUG9sZUNoYXJnZSA9IGRhdGEuaXNEZWZlbmRWc1BvbGVDaGFyZ2U7XHJcblxyXG4gICAgICAgICAgICB0cnlBbGxDb21iaW5hdGlvbnMoaGVyb1NldCwgZGF0YS5ib3V0Q291bnQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiB0cnlBbGxDb21iaW5hdGlvbnMoaGVyb1NldDogQXJyYXk8SGVybz4sIGJvdXRDb3VudDogbnVtYmVyKSB7XHJcbiAgICBsZXQgbWF0Y2h1cFdpbnM6IHsgW2luZGV4OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9OyAgLy8gbWFwIG9mIGhlcm8gYW5kIGludGVnZXJcclxuICAgIGxldCBoZXJvV2luczogeyBbaW5kZXg6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbiAgICBsZXQgZ2FtZSA9IG51bGw7XHJcbiAgICBsZXQgc2NvcmUgPSBbMl07XHJcbiAgICBsZXQgcHJvZ3Jlc3MgPSAwO1xyXG4gICAgLy8gaG93IG1hbnkgYm91dHMgdG90YWwgaXMgTiAqIE4tMSAqIGJvdXRDb3VudFxyXG4gICAgbGV0IHRvdGFsSXRlcmF0aW9ucyA9IGhlcm9TZXQubGVuZ3RoICogKGhlcm9TZXQubGVuZ3RoIC0gMSkgKiBib3V0Q291bnQgLyAyO1xyXG4gICAgbGV0IGl0ZXJhdGlvbkNvdW50ID0gMDtcclxuICAgIGhlcm9TZXQuZm9yRWFjaChmdW5jdGlvbiAoaGVybzEpIHtcclxuICAgICAgICBoZXJvV2luc1toZXJvMS5uYW1lXSA9IDA7XHJcbiAgICAgICAgaGVyb1NldC5mb3JFYWNoKGhlcm8yID0+IHtcclxuICAgICAgICAgICAgaWYgKGhlcm8xICE9PSBoZXJvMikgbWF0Y2h1cFdpbnNbaGVybzEubmFtZSArIFwiL1wiICsgaGVybzIubmFtZV0gPSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgbGFzdFVwZGF0ZVRpbWUgPSBuZXcgRGF0ZSgpOyAvLyBmb3IgdGhyb3R0bGluZyB1cGRhdGVzXHJcblxyXG4gICAgZm9yIChsZXQgaDEgPSAwOyBoMSA8IGhlcm9TZXQubGVuZ3RoOyBoMSsrKSB7XHJcbiAgICAgICAgbGV0IGhlcm8xID0gaGVyb1NldFtoMV07XHJcbiAgICAgICAgbGV0IGgyID0gMDtcclxuICAgICAgICBsZXQgaGVybzIgPSBoZXJvU2V0W2gyXTtcclxuXHJcbiAgICAgICAgZm9yIChoMiA9IGgxICsgMTsgaDIgPCBoZXJvU2V0Lmxlbmd0aDsgaDIrKykge1xyXG4gICAgICAgICAgICBoZXJvMiA9IGhlcm9TZXRbaDJdO1xyXG4gICAgICAgICAgICBsZXQgc3VtUm91bmRzID0gMDtcclxuICAgICAgICAgICAgc2NvcmVbMF0gPSAwO1xyXG4gICAgICAgICAgICBzY29yZVsxXSA9IDA7XHJcbiAgICAgICAgICAgIGxvZygnTWF0Y2h1cDogJyArIGhlcm8xLm5hbWUgKyAnIHZzLiAnICsgaGVybzIubmFtZSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBib3V0ID0gMDsgYm91dCA8IGJvdXRDb3VudDsgYm91dCsrKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJCb3V0OiBcIiArIGJvdXQgKyAxICsgXCIgb2YgXCIgKyBib3V0Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRG9uJ3QgcG9zdCB1cGRhdGVzIHRvbyBvZnRlblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIGxhc3RVcGRhdGVUaW1lLmdldFRpbWUoKSA+IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBwcm9ncmVzcyBiYXIgb24gcGFnZSAoYXNzdW1lcyBtYXggaXMgMTAwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSBNYXRoLmNlaWwoKGl0ZXJhdGlvbkNvdW50IC8gdG90YWxJdGVyYXRpb25zKSAqIDEwMCAqIDEwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnBvc3RNZXNzYWdlKHsgXCJjbWRcIjogXCJwcm9ncmVzc1VwZGF0ZVwiLCBcInByb2dyZXNzXCI6IHByb2dyZXNzIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVUaW1lID0gY3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2xvbmUgaGVyb2VzIChyZXNldHMgdGhlbSkgcHJpb3IgdG8gZmlnaHRpbmdcclxuICAgICAgICAgICAgICAgIGxldCBmaWdodGluZ0hlcm8xID0gT2JqZWN0LmNyZWF0ZShoZXJvMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlnaHRpbmdIZXJvMiA9IE9iamVjdC5jcmVhdGUoaGVybzIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZSA9IG5ldyBHYW1lKGZpZ2h0aW5nSGVybzEsIGZpZ2h0aW5nSGVybzIsIHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCwgZGVmZW5kVnNQb2xlQ2hhcmdlKTtcclxuICAgICAgICAgICAgICAgIGxldCB3aW5uaW5nRmlnaHRlciA9IGdhbWUuZmlnaHRUb1RoZURlYXRoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHdpbm5pbmdGaWdodGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvc2luZ0ZpZ2h0ZXIgPSAod2lubmluZ0ZpZ2h0ZXIgPT09IGZpZ2h0aW5nSGVybzEgPyBmaWdodGluZ0hlcm8yIDogZmlnaHRpbmdIZXJvMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbm5pbmdGaWdodGVyID09PSBmaWdodGluZ0hlcm8xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlWzBdKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmVbMV0rKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gd2lubmluZ0ZpZ2h0ZXIubmFtZSArIFwiL1wiICsgbG9zaW5nRmlnaHRlci5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNodXBXaW5zW2tleV0rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1bVJvdW5kcyArPSBnYW1lLnJvdW5kO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBVcGRhdGUgdGhlIHRvdGFsIHN0YXRzIGZvciB0aGVzZSBoZXJvZXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGhlcm9XaW5zW2hlcm8xLm5hbWVdICs9IHNjb3JlWzBdO1xyXG4gICAgICAgICAgICBoZXJvV2luc1toZXJvMi5uYW1lXSArPSBzY29yZVsxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBQdXQgc3RhdHMgYmFjayBvbiBwYWdlXHJcbiAgICAgKi9cclxuICAgIGN0eC5wb3N0TWVzc2FnZSh7IFwiY21kXCI6IFwicHJvZ3Jlc3NVcGRhdGVcIiwgXCJwcm9ncmVzc1wiOiAxMDAqMTAwIH0pO1xyXG4gICAgY29uc29sZS5sb2coYCBpbiB3b3JrZXIuLi5gKTtcclxuICAgIGNvbnN0IGhlcm9XaW5zVGFibGVIVE1MID0gY3JlYXRlVGFibGVGcm9tUHJvcGVydGllcyhoZXJvV2lucywgKGhlcm9TZXQubGVuZ3RoIC0gMSkgKiBib3V0Q291bnQsXHJcbiAgICAgICAgYFJlc3VsdHMgZm9yICR7aGVyb1NldC5sZW5ndGh9IGhlcm9lcywgcGFpcmVkIHVwIGZvciAke2JvdXRDb3VudH0gYm91dHMgZWFjaDpgLCBmYWxzZSk7XHJcbiAgICBjb25zdCBtYXRjaHVwV2luc1RhYmxlSFRNTDogc3RyaW5nID0gY3JlYXRlVGFibGVGcm9tUHJvcGVydGllcyhtYXRjaHVwV2lucywgYm91dENvdW50LFxyXG4gICAgICAgIGBQYWlyd2lzZSByZXN1bHRzIGZvciAke2hlcm9TZXQubGVuZ3RofSBoZXJvZXMsIHBhaXJlZCB1cCBmb3IgJHtib3V0Q291bnR9IGJvdXRzIGVhY2g6YCwgdHJ1ZSk7XHJcbiAgICBjdHgucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIFwiY21kXCI6IFwiZmluaXNoZWRcIixcclxuICAgICAgICBcImhlcm9XaW5zXCI6IGhlcm9XaW5zLFxyXG4gICAgICAgIFwibWF0Y2h1cFdpbnNcIjogbWF0Y2h1cFdpbnMsXHJcbiAgICAgICAgXCJoZXJvV2luc1RhYmxlSFRNTFwiOiBoZXJvV2luc1RhYmxlSFRNTCxcclxuICAgICAgICBcIm1hdGNodXBXaW5zVGFibGVIVE1MXCI6IG1hdGNodXBXaW5zVGFibGVIVE1MXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlVGFibGVGcm9tUHJvcGVydGllcyhoZXJvV2luczogeyBbaW5kZXg6IHN0cmluZ106IG51bWJlciB9LCB0b3RhbENvdW50OiBudW1iZXIsIGNhcHRpb246IHN0cmluZywgaXNWZXJzdXM6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgbGV0IGh0bWwgPSBgPGNhcHRpb24+JHtjYXB0aW9ufTwvY2FwdGlvbj48dGhlYWQ+YDtcclxuICAgIGlmIChpc1ZlcnN1cykge1xyXG4gICAgICAgIGh0bWwgKz0gYDx0cj48dGg+SGVybyAxPC90aD48dGg+dnMgSGVybyAyPC90aD5gXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGh0bWwgKz0gYDx0cj48dGg+SGVybzwvdGg+YFxyXG4gICAgfVxyXG4gICAgaHRtbCArPSBgPHRoIGlkPVwiJHtpc1ZlcnN1cyA/ICdtYXRjaCcgOiAnJ313aW5zXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj5XaW5zPC90aD48dGggY2xhc3M9XCJcIiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0O1wiPiUgdG90YWw8L3RoPjwvdHI+PC90aGVhZD5gO1xyXG4gICAgbGV0IHRib2R5ID0gJyc7XHJcbiAgICBsZXQgcGVyY2VudGFnZVdpbiA9IDA7XHJcbiAgICBsZXQgcGN0Q2xhc3M6IHN0cmluZztcclxuICAgIGZvciAobGV0IHByb3BlcnR5IGluIGhlcm9XaW5zKSB7XHJcbiAgICAgICAgaWYgKGhlcm9XaW5zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICBwZXJjZW50YWdlV2luID0gcGFyc2VJbnQoKChoZXJvV2luc1twcm9wZXJ0eV0gLyB0b3RhbENvdW50KSAqIDEwMCkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIHBjdENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChwZXJjZW50YWdlV2luID4gNzApXHJcbiAgICAgICAgICAgICAgICBwY3RDbGFzcyA9IGAgY2xhc3M9XCJhbGVydC1zdWNjZXNzXCJgO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChwZXJjZW50YWdlV2luIDwgMzApXHJcbiAgICAgICAgICAgICAgICBwY3RDbGFzcyA9IGAgY2xhc3M9XCJhbGVydC1kYW5nZXJcImA7XHJcbiAgICAgICAgICAgIHRib2R5ICs9IGA8dHIke3BjdENsYXNzfT5gO1xyXG4gICAgICAgICAgICBpZiAoaXNWZXJzdXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoZXJvZXMgPSBwcm9wZXJ0eS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICB0Ym9keSArPSBgPHRkPiR7aGVyb2VzWzBdfTwvdGQ+PHRkPiR7aGVyb2VzWzFdfTwvdGQ+YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRib2R5ICs9IGA8dGQ+JHtwcm9wZXJ0eX08L3RkPmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0Ym9keSArPSBgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+JHtoZXJvV2luc1twcm9wZXJ0eV19PC90ZD5gXHJcbiAgICAgICAgICAgIHRib2R5ICs9IGA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj4ke3BlcmNlbnRhZ2VXaW59PC90ZD48L3RyPmBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBodG1sICs9IGA8dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcbiAgICByZXR1cm4gaHRtbDtcclxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==