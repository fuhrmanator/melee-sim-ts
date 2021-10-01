/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/logger.ts":
/*!***********************!*\
  !*** ./src/logger.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "setMute": () => (/* binding */ setMute)
/* harmony export */ });
var isMute = false;
function log(message) {
    // if (!isMute) console.log(message);
    if (!isMute)
        postMessage({ "cmd": "log", "message": message });
}
function setMute(changeIsMute) {
    isMute = changeIsMute;
}


/***/ }),

/***/ "./src/melee/armor.ts":
/*!****************************!*\
  !*** ./src/melee/armor.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Armor": () => (/* binding */ Armor)
/* harmony export */ });
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



/***/ }),

/***/ "./src/melee/die.ts":
/*!**************************!*\
  !*** ./src/melee/die.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "roll": () => (/* binding */ roll),
/* harmony export */   "rollDice": () => (/* binding */ rollDice),
/* harmony export */   "rollThreeDice": () => (/* binding */ rollThreeDice),
/* harmony export */   "rollFourDice": () => (/* binding */ rollFourDice)
/* harmony export */ });
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logger */ "./src/logger.ts");

function roll() {
    var roll = Math.floor(Math.random() * 6 + 1);
    (0,_logger__WEBPACK_IMPORTED_MODULE_0__.log)("Die roll: " + roll);
    return roll;
}
function rollDice(numDice) {
    var result = 0;
    for (var i = 0; i < numDice; i++) {
        result += roll();
    }
    return result;
}
function rollThreeDice() {
    return rollDice(3);
}
function rollFourDice() {
    return rollDice(4);
}


/***/ }),

/***/ "./src/melee/game.ts":
/*!***************************!*\
  !*** ./src/melee/game.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Game": () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _hero__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hero */ "./src/melee/hero.ts");
/* harmony import */ var _weapon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../logger */ "./src/logger.ts");
/* harmony import */ var _die__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
/* harmony import */ var _heroesSingleton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./heroesSingleton */ "./src/melee/heroesSingleton.ts");





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
        (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("New Game with pole charge set to " + this.poleCharge + " and defend on pole charge set to " + this.defendOnPoleCharge);
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
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("---> Round " + this.round);
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Hero 1: " + this.hero1.name + ", ST: " + this.hero1.getST + "(" + this.hero1.adjST + ")");
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Hero 2: " + this.hero2.name + ", ST: " + this.hero2.getST + "(" + this.hero2.adjST + ")");
            var firstAttacker = this.hero1, secondAttacker = this.hero2;
            /* highest adjDx attacks first */
            if (this.hero1.adjustedDx < this.hero2.adjustedDx) {
                firstAttacker = this.hero2;
                secondAttacker = this.hero1;
            }
            /* roll to see who attacks first */
            else if (this.hero1.adjustedDx == this.hero2.adjustedDx) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Adjusted dexterity (" + this.hero1.adjustedDx + ") is the same for both fighters; rolling to decide attack order");
                if (Math.random() < 0.5) {
                    firstAttacker = this.hero2;
                    secondAttacker = this.hero1;
                }
            }
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(firstAttacker.name + " (adjDx = " + firstAttacker.adjustedDx + ") attacks before " + secondAttacker.name + " (adjDx = " + secondAttacker.adjustedDx + ")");
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
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("-------> The winner of this bout is " + winner.name);
        }
        else {
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("-------> This bout was a TIE!");
        }
        return winner;
    };
    /**
     * Private (static) functions, must be passed a "this" if you need access to Game
     */
    Game.prototype.tryDefending = function (defender, attacker, defendOnPoleCharge) {
        if (!defender.isKnockedDown
            && defender.getReadiedWeapon !== _weapon__WEBPACK_IMPORTED_MODULE_1__.Weapon.NONE
            && defender.sufferingDexPenalty()
            && defender.adjustedDx < 8) {
            defender.setDefending();
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(defender.name + " is defending this turn because adjDX < 8 and temporarily penalized.");
        }
        else if (defendOnPoleCharge
            && !defender.isKnockedDown
            && defender.getReadiedWeapon !== _weapon__WEBPACK_IMPORTED_MODULE_1__.Weapon.NONE
            && attacker.getReadiedWeapon !== _weapon__WEBPACK_IMPORTED_MODULE_1__.Weapon.NONE
            && attacker.getReadiedWeapon.isPole
            && attacker.isCharging
            && !defender.isCharging // don't defend if also charging with pole weapon
        ) {
            defender.setDefending();
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(defender.name + " is defending this turn because attacker is charging with pole weapon.");
        }
    };
    Game.prototype.tryStandUp = function (hero) {
        if (hero.isKnockedDown) {
            hero.standUp();
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(hero.name + " is standing up this turn.");
        }
    };
    Game.prototype.tryPickUp = function (hero) {
        if (hero.getDroppedWeapon() !== _weapon__WEBPACK_IMPORTED_MODULE_1__.Weapon.NONE) {
            hero.pickUpWeapon();
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(hero.name + " is picking up his weapon this turn (rear facing in all six directions).");
        }
    };
    Game.prototype.resolveAttack = function (game, attacker, attackee, roll, numDice) {
        var facingBonus = attackee.isProne ? 4 : 0;
        (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(attacker.name + " rolled " + roll + " and adjDex is "
            + (attackee.isProne ? (attacker.adjustedDx + facingBonus + " (" + attacker.adjustedDx + " + " + facingBonus + ", target is prone, i.e., knocked down or picking up a weapon)")
                : attacker.adjustedDx));
        /**
         * A hit is a roll that is
         * NOT an automatic miss AND
         * (below or equal to the attacker's adjDex OR and automatic hit)
         */
        if (!this.isAutomaticMiss(roll, numDice) && (roll <= attacker.adjustedDx + facingBonus || this.isAutomaticHit(roll, numDice))) {
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("HIT!!!!");
            var hits = attacker.getReadiedWeapon.doDamage();
            if (attacker.isCharging && attacker.getReadiedWeapon.isPole) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Pole weapon charge does double damage!");
                game.criticalHits++;
                hits *= 2;
            }
            if (this.isDoubleDamage(roll, numDice)) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Double damage! (roll of " + roll + " on " + numDice + " dice.)");
                game.criticalHits++;
                hits *= 2;
            }
            else if (this.isTripleDamage(roll, numDice)) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Triple damage! (roll of " + roll + " on " + numDice + " dice.)");
                game.criticalHits++;
                hits *= 3;
            }
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Total damage done by " + attacker.getReadiedWeapon.name + ": " + hits + " hits");
            attackee.takeHits(hits);
        }
        else {
            /**
             * It's a miss
             */
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Missed. ");
            if (this.isDroppedWeapon(roll, numDice)) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Dropped weapon! ");
                game.criticalMisses++;
                attacker.dropWeapon();
            }
            else if (this.isBrokenWeapon(roll, numDice)) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Broke weapon! ");
                game.criticalMisses++;
                attacker.breakWeapon();
            }
        }
    };
    ;
    Game.prototype.tryAttack = function (game, attacker, attackee) {
        (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)(attacker.name + " gets his turn to attack.");
        if (!attacker.isDefending()) {
            if (attacker.isConscious) {
                if (!attacker.isKnockedDown) {
                    if (attacker.getReadiedWeapon !== _weapon__WEBPACK_IMPORTED_MODULE_1__.Weapon.NONE) {
                        if (attacker.isCharging)
                            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("He's charging with pole weapon (double damage if he hits).");
                        var numDice = attackee.isDefending() ? 4 : 3;
                        (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("Rolling to hit on " + numDice + " dice.");
                        this.resolveAttack(game, attacker, attackee, (0,_die__WEBPACK_IMPORTED_MODULE_3__.rollDice)(numDice), numDice);
                    }
                    else {
                        (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("But he's not able to attack because he has has no readied weapon.");
                    }
                }
                else {
                    (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("But he's not able to attack because he was knocked down.");
                }
            }
            else {
                (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("But he's not able to attack because he's " + (attacker.isAlive ? "unconscious." : "dead."));
            }
        }
        else {
            (0,_logger__WEBPACK_IMPORTED_MODULE_2__.log)("But he's defending.");
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
        var heroesListJSON = _heroesSingleton__WEBPACK_IMPORTED_MODULE_4__.HeroesSingleton.getHeroesListJSON();
        var heroJSON = null;
        for (var i = 0; i < heroesListJSON.length; i++) {
            heroJSON = heroesListJSON[i];
            h1 = new _hero__WEBPACK_IMPORTED_MODULE_0__.Hero(heroJSON.name, heroJSON.st, heroJSON.dx, heroJSON.weapon, heroJSON.armor, heroJSON.shield);
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



/***/ }),

/***/ "./src/melee/hero.ts":
/*!***************************!*\
  !*** ./src/melee/hero.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hero": () => (/* binding */ Hero)
/* harmony export */ });
/* harmony import */ var _weapon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger */ "./src/logger.ts");


var Hero = /** @class */ (function () {
    function Hero(name, st, dx, weapon, armor, shield) {
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
        this._droppedWeapon = _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE;
        this._damageTaken = 0;
        this._damageTakenThisRound = 0;
        this._injuryDexPenalty = false;
        this._recovering = false;
        this._defending = false;
        this._charging = false;
    }
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
            this._droppedWeapon = _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE;
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
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._name + " taking " + hits + " hits.");
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._armor.name + " stops " + this._armor.hitsStopped);
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._shield.name + " stops " + this._shield.hitsStopped);
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._name + " taking " + damageDone + " damage.");
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
            (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._name + " has an adjDx penalty of -2 for remainder of this round and the NEXT round.");
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._name + " has now taken " + this._damageTaken + " points of damage, ST = " + this._st + (this._damageTaken >= this._st ? " and is DEAD." : (this._st - this._damageTaken === 1 ? " and is UNCONSCIOUS." : ".")));
        if (this._damageTakenThisRound >= 8) {
            this._knockedDown = true;
            (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._name + " has been knocked down by damage.");
        }
        if (this.isStrengthLowPenalty)
            (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(this._name + " has an additional DX adjustment of -3 due to ST <= 3.");
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
        this._readiedWeapon = _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE;
    };
    ;
    Hero.prototype.breakWeapon = function () {
        this._readiedWeapon = _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE;
        this._droppedWeapon = _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE; // shouldn't need this, but just in case
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
        return this._name + "\n" + this._armor.toString() + "\n" + this._readiedWeapon.toString();
    };
    ;
    Object.defineProperty(Hero.prototype, "canDoDamage", {
        get: function () {
            return this.isConscious && (this._readiedWeapon !== _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE || this._droppedWeapon !== _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.NONE);
        },
        enumerable: false,
        configurable: true
    });
    ;
    return Hero;
}());



/***/ }),

/***/ "./src/melee/heroesSingleton.ts":
/*!**************************************!*\
  !*** ./src/melee/heroesSingleton.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeroesSingleton": () => (/* binding */ HeroesSingleton)
/* harmony export */ });
/* harmony import */ var _weapon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
/* harmony import */ var _armor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./armor */ "./src/melee/armor.ts");
/* harmony import */ var _shield__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shield */ "./src/melee/shield.ts");



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
    // http://stackoverflow.com/a/9753841/1168342
    HeroesSingleton.listHeight = 15;
    HeroesSingleton.heroesListJSON = [
        { "name": "001:ST8;DX16;DAGGER;NO_ARMOR;SMALL_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "002:ST8;DX16;DAGGER;LEATHER;SMALL_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "003:ST8;DX16;DAGGER;CHAIN;SMALL_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "004:ST8;DX16;DAGGER;PLATE;SMALL_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "005:ST8;DX16;DAGGER;NO_ARMOR;LARGE_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "006:ST8;DX16;DAGGER;LEATHER;LARGE_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "007:ST8;DX16;DAGGER;CHAIN;LARGE_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "008:ST8;DX16;DAGGER;PLATE;LARGE_SHIELD", "st": 8, "dx": 16, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.DAGGER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "009:ST9;DX15;RAPIER;NO_ARMOR;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "010:ST9;DX15;RAPIER;LEATHER;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "011:ST9;DX15;RAPIER;CHAIN;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "012:ST9;DX15;RAPIER;PLATE;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "013:ST9;DX15;RAPIER;NO_ARMOR;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "014:ST9;DX15;RAPIER;LEATHER;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "015:ST9;DX15;RAPIER;CHAIN;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "016:ST9;DX15;RAPIER;PLATE;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.RAPIER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "017:ST9;DX15;CLUB;NO_ARMOR;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "018:ST9;DX15;CLUB;LEATHER;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "019:ST9;DX15;CLUB;CHAIN;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "020:ST9;DX15;CLUB;PLATE;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "021:ST9;DX15;CLUB;NO_ARMOR;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "022:ST9;DX15;CLUB;LEATHER;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "023:ST9;DX15;CLUB;CHAIN;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "024:ST9;DX15;CLUB;PLATE;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CLUB, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "025:ST9;DX15;JAVELIN;NO_ARMOR;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "026:ST9;DX15;JAVELIN;LEATHER;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "027:ST9;DX15;JAVELIN;CHAIN;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "028:ST9;DX15;JAVELIN;PLATE;SMALL_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "029:ST9;DX15;JAVELIN;NO_ARMOR;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "030:ST9;DX15;JAVELIN;LEATHER;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "031:ST9;DX15;JAVELIN;CHAIN;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "032:ST9;DX15;JAVELIN;PLATE;LARGE_SHIELD", "st": 9, "dx": 15, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.JAVELIN, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "033:ST10;DX14;HAMMER;NO_ARMOR;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "034:ST10;DX14;HAMMER;LEATHER;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "035:ST10;DX14;HAMMER;CHAIN;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "036:ST10;DX14;HAMMER;PLATE;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "037:ST10;DX14;HAMMER;NO_ARMOR;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "038:ST10;DX14;HAMMER;LEATHER;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "039:ST10;DX14;HAMMER;CHAIN;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "040:ST10;DX14;HAMMER;PLATE;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HAMMER, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "041:ST10;DX14;CUTLASS;NO_ARMOR;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "042:ST10;DX14;CUTLASS;LEATHER;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "043:ST10;DX14;CUTLASS;CHAIN;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "044:ST10;DX14;CUTLASS;PLATE;SMALL_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "045:ST10;DX14;CUTLASS;NO_ARMOR;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "046:ST10;DX14;CUTLASS;LEATHER;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "047:ST10;DX14;CUTLASS;CHAIN;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "048:ST10;DX14;CUTLASS;PLATE;LARGE_SHIELD", "st": 10, "dx": 14, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.CUTLASS, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "049:ST11;DX13;SHORTSWORD;NO_ARMOR;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "050:ST11;DX13;SHORTSWORD;LEATHER;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "051:ST11;DX13;SHORTSWORD;CHAIN;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "052:ST11;DX13;SHORTSWORD;PLATE;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "053:ST11;DX13;SHORTSWORD;NO_ARMOR;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "054:ST11;DX13;SHORTSWORD;LEATHER;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "055:ST11;DX13;SHORTSWORD;CHAIN;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "056:ST11;DX13;SHORTSWORD;PLATE;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SHORTSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "057:ST11;DX13;MACE;NO_ARMOR;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "058:ST11;DX13;MACE;LEATHER;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "059:ST11;DX13;MACE;CHAIN;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "060:ST11;DX13;MACE;PLATE;SMALL_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "061:ST11;DX13;MACE;NO_ARMOR;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "062:ST11;DX13;MACE;LEATHER;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "063:ST11;DX13;MACE;CHAIN;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "064:ST11;DX13;MACE;PLATE;LARGE_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MACE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "065:ST11;DX13;SPEAR;NO_ARMOR;NO_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SPEAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "066:ST11;DX13;SPEAR;LEATHER;NO_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SPEAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "067:ST11;DX13;SPEAR;CHAIN;NO_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SPEAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "068:ST11;DX13;SPEAR;PLATE;NO_SHIELD", "st": 11, "dx": 13, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.SPEAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "069:ST12;DX12;BROADSWORD;NO_ARMOR;SMALL_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "070:ST12;DX12;BROADSWORD;LEATHER;SMALL_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "071:ST12;DX12;BROADSWORD;CHAIN;SMALL_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "072:ST12;DX12;BROADSWORD;PLATE;SMALL_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "073:ST12;DX12;BROADSWORD;NO_ARMOR;LARGE_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "074:ST12;DX12;BROADSWORD;LEATHER;LARGE_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "075:ST12;DX12;BROADSWORD;CHAIN;LARGE_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "076:ST12;DX12;BROADSWORD;PLATE;LARGE_SHIELD", "st": 12, "dx": 12, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BROADSWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "077:ST13;DX11;MORNINGSTAR;NO_ARMOR;SMALL_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "078:ST13;DX11;MORNINGSTAR;LEATHER;SMALL_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "079:ST13;DX11;MORNINGSTAR;CHAIN;SMALL_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "080:ST13;DX11;MORNINGSTAR;PLATE;SMALL_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.SMALL_SHIELD },
        { "name": "081:ST13;DX11;MORNINGSTAR;NO_ARMOR;LARGE_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "082:ST13;DX11;MORNINGSTAR;LEATHER;LARGE_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "083:ST13;DX11;MORNINGSTAR;CHAIN;LARGE_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "084:ST13;DX11;MORNINGSTAR;PLATE;LARGE_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.MORNINGSTAR, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.LARGE_SHIELD },
        { "name": "085:ST13;DX11;HALBERD;NO_ARMOR;NO_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HALBERD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "086:ST13;DX11;HALBERD;LEATHER;NO_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HALBERD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "087:ST13;DX11;HALBERD;CHAIN;NO_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HALBERD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "088:ST13;DX11;HALBERD;PLATE;NO_SHIELD", "st": 13, "dx": 11, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.HALBERD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "089:ST14;DX10;TWO_HANDED_SWORD;NO_ARMOR;NO_SHIELD", "st": 14, "dx": 10, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.TWO_HANDED_SWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "090:ST14;DX10;TWO_HANDED_SWORD;LEATHER;NO_SHIELD", "st": 14, "dx": 10, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.TWO_HANDED_SWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "091:ST14;DX10;TWO_HANDED_SWORD;CHAIN;NO_SHIELD", "st": 14, "dx": 10, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.TWO_HANDED_SWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "092:ST14;DX10;TWO_HANDED_SWORD;PLATE;NO_SHIELD", "st": 14, "dx": 10, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.TWO_HANDED_SWORD, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "093:ST15;DX9;BATTLEAXE;NO_ARMOR;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "094:ST15;DX9;BATTLEAXE;LEATHER;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "095:ST15;DX9;BATTLEAXE;CHAIN;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "096:ST15;DX9;BATTLEAXE;PLATE;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "097:ST15;DX9;PIKE_AXE;NO_ARMOR;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "098:ST15;DX9;PIKE_AXE;LEATHER;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "099:ST15;DX9;PIKE_AXE;CHAIN;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "100:ST15;DX9;PIKE_AXE;PLATE;NO_SHIELD", "st": 15, "dx": 9, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "101:ST16;DX8;BATTLEAXE;NO_ARMOR;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "102:ST16;DX8;BATTLEAXE;LEATHER;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "103:ST16;DX8;BATTLEAXE;CHAIN;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "104:ST16;DX8;BATTLEAXE;PLATE;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.BATTLEAXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "105:ST16;DX8;PIKE_AXE;NO_ARMOR;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.NO_ARMOR, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "106:ST16;DX8;PIKE_AXE;LEATHER;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.LEATHER, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "107:ST16;DX8;PIKE_AXE;CHAIN;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.CHAIN, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD },
        { "name": "108:ST16;DX8;PIKE_AXE;PLATE;NO_SHIELD", "st": 16, "dx": 8, "weapon": _weapon__WEBPACK_IMPORTED_MODULE_0__.Weapon.PIKE_AXE, "armor": _armor__WEBPACK_IMPORTED_MODULE_1__.Armor.PLATE, "shield": _shield__WEBPACK_IMPORTED_MODULE_2__.Shield.NO_SHIELD }
    ];
    return HeroesSingleton;
}());



/***/ }),

/***/ "./src/melee/shield.ts":
/*!*****************************!*\
  !*** ./src/melee/shield.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Shield": () => (/* binding */ Shield)
/* harmony export */ });
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



/***/ }),

/***/ "./src/melee/weapon.ts":
/*!*****************************!*\
  !*** ./src/melee/weapon.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Weapon": () => (/* binding */ Weapon)
/* harmony export */ });
/* harmony import */ var _die__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger */ "./src/logger.ts");


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
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)("Rolling for weapon doing "
            + this.dice
            + "d"
            + ((this.modifier > 0) ? "+" : "")
            + ((this.modifier !== 0) ? this.modifier : "")
            + " damage.");
        var damage = 0;
        damage += (0,_die__WEBPACK_IMPORTED_MODULE_0__.rollDice)(this.dice);
        damage += this.modifier;
        if (this.modifier !== 0)
            (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)(((this.modifier > 0) ? "+" : "") + this.modifier);
        if (damage < 0)
            damage = 0;
        (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)("Total weapon damage: " + damage);
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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************************!*\
  !*** ./node_modules/ts-loader/index.js!./src/worker/worker.ts ***!
  \****************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _melee_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../melee/game */ "./src/melee/game.ts");
/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../logger */ "./src/logger.ts");


var ctx = self;
var poleWeaponsChargeFirstRound = false;
var defendVsPoleCharge = false;
ctx.postMessage({ "cmd": "worker waiting" });
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
            _melee_game__WEBPACK_IMPORTED_MODULE_0__.Game.createHeroesMap();
            var completeHeroMap_1 = _melee_game__WEBPACK_IMPORTED_MODULE_0__.Game.getHeroMap();
            data.selectedHeroes.forEach(function (heroName) {
                var hero = completeHeroMap_1.get(heroName);
                if (hero)
                    heroSet_1.push(hero);
            }, this);
            /**
             * Configure simulator options
             */
            (0,_logger__WEBPACK_IMPORTED_MODULE_1__.setMute)(!data.isVerbose);
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
            (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)('Matchup: ' + hero1.name + ' vs. ' + hero2.name);
            for (var bout = 0; bout < boutCount; bout++) {
                (0,_logger__WEBPACK_IMPORTED_MODULE_1__.log)("Bout: " + bout + 1 + " of " + boutCount);
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
                game = new _melee_game__WEBPACK_IMPORTED_MODULE_0__.Game(fightingHero1, fightingHero2, poleWeaponsChargeFirstRound, defendVsPoleCharge);
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
    console.log("Creating tables in worker...");
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
    // tbl.style.width = "100%";
    // tbl.className = "sortable table table-striped table-condensed caption-top"; // bootstrap --> class="table table-striped"
    // // tbl.className = "sortable";  // sorttable.js is the hook
    // tbl.setAttribute("border", "0");
    // <caption>Results for 2 heroes, paired up for 2 bouts each</caption><thead><tr><th class="">Hero</th><th id="wins" class=" sorttable_sorted_reverse" style="text-align: right;">Wins<span id="sorttable_sortrevind">&nbsp;▴</span></th><th class="" style="text-align: right;">% total</th></tr></thead><tbody><tr class="success"><td>006:ST8;DX16;DAGGER;LEATHER;LARGE_SHIELD</td><td style="text-align: right;">2</td><td style="text-align: right;">100</td></tr><tr class="danger"><td>005:ST8;DX16;DAGGER;NO_ARMOR;LARGE_SHIELD</td><td style="text-align: right;">0</td><td style="text-align: right;">0</td></tr></tbody><tfoot></tfoot></table>
    // /**
    //  * add caption
    //  */
    // let tbcaption = document.createElement('caption');
    // tbcaption.appendChild(document.createTextNode(caption));
    // tbl.appendChild(tbcaption);
    // let tbhead = document.createElement('thead');
    // let tr = document.createElement('tr');
    // let td = document.createElement('th');
    var html = "<caption>" + caption + "</caption><thead>";
    // if (isVersus) {
    //     td.appendChild(document.createTextNode("Hero 1"));
    //     tr.appendChild(td);
    //     td = document.createElement('th');
    //     td.appendChild(document.createTextNode("vs Hero 2"));
    //     tr.appendChild(td);
    // } else {
    //     td = document.createElement('th');
    //     td.appendChild(document.createTextNode("Hero"));
    //     tr.appendChild(td);
    // }
    if (isVersus) {
        html += "<tr><th>Hero 1</th><th>vs Hero 2</th>";
    }
    else {
        html += "<tr><th>Hero</th>";
    }
    // td = document.createElement('th');
    // td.id = (isVersus ? "match" : "") + "wins";
    // td.appendChild(document.createTextNode("Wins"));
    // // td.setAttribute("align", "right");
    // td.style.textAlign = "right";
    // tr.appendChild(td);
    // td = document.createElement('th');
    // td.style.textAlign = "right";
    // td.appendChild(document.createTextNode("% total"));
    // tr.appendChild(td);
    // tbhead.appendChild(tr);
    // tbl.appendChild(tbhead);
    html += "<th id=\"" + (isVersus ? 'match' : '') + "wins\" style=\"text-align: right;\">Wins</th><th class=\"\" style=\"text-align: right;\">% total</th></tr></thead>";
    // let tbdy = document.createElement('tbody');
    // let percentageWin = 0;
    // for (let property in heroWins) {
    //     if (heroWins.hasOwnProperty(property)) {
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
            //         tr = document.createElement('tr');
            //         td = document.createElement('td');
            //         if (isVersus) {
            //             let heroes = property.split("/");
            //             td.appendChild(document.createTextNode(heroes[0]));
            //             tr.appendChild(td);
            //             td = document.createElement('td');
            //             td.appendChild(document.createTextNode(heroes[1]));
            //             tr.appendChild(td);
            //         } else {
            //             td.appendChild(document.createTextNode(property));
            //             tr.appendChild(td);
            //         }
            //         // add the column for the number of wins
            //         td = document.createElement('td');
            //         td.style.textAlign = "right";
            //         td.appendChild(document.createTextNode(heroWins[property] + ""));
            //         tr.appendChild(td);
            tbody += "<td style=\"text-align: right;\">" + heroWins[property] + "</td>";
            //         td = document.createElement('td');
            //         td.style.textAlign = "right";
            //         percentageWin = parseInt(((heroWins[property] / totalCount) * 100).toFixed(2));
            //         td.appendChild(document.createTextNode("" + percentageWin));
            tbody += "<td style=\"text-align: right;\">" + percentageWin + "</td></tr>";
            //         if (percentageWin > 70) { tr.className = "success"; }
            //         else if (percentageWin < 30) { tr.className = "danger"; }
            //         tr.appendChild(td);
            //         tbdy.appendChild(tr);
            //     }
        }
    }
    // }
    html += "<tbody>" + tbody + "</tbody>";
    // tbl.appendChild(tbdy);
    // return tbl.innerHTML;
    // console.log(`Worker generated this HTML:\n${html}`);
    return html;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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T0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUFBLENBQUM7SUFFSyx5QkFBUSxHQUFmO1FBQ0ksT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3RJLENBQUM7SUFBQSxDQUFDO0lBRUssV0FBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hELGFBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELGFBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM1RCxXQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkQsYUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELGNBQU8sR0FBRyxJQUFJLE1B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RTtZQUNsRSxrQ0FBa0M7WUFDbEMsaURBQWlEO1lBQ2pELGtFQUFrRTtZQUNsRSxrQ0FBa0M7WUFDbEMsbUJBQW1CO1lBQ25CLGlFQUFpRTtZQUNqRSxrQ0FBa0M7WUFDbEMsWUFBWTtZQUNaLG1EQUFtRDtZQUNuRCw2Q0FBNkM7WUFDN0Msd0NBQXdDO1lBQ3hDLDRFQUE0RTtZQUM1RSw4QkFBOEI7WUFDOUIsS0FBSyxJQUFJLHNDQUFrQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQU87WUFDcEUsNkNBQTZDO1lBQzdDLHdDQUF3QztZQUN4QywwRkFBMEY7WUFDMUYsdUVBQXVFO1lBQ3ZFLEtBQUssSUFBSSxzQ0FBa0MsYUFBYSxlQUFZO1lBQ3BFLGdFQUFnRTtZQUNoRSxvRUFBb0U7WUFDcEUsOEJBQThCO1lBQzlCLGdDQUFnQztZQUNoQyxRQUFRO1NBQ1g7S0FDSjtJQUNELElBQUk7SUFDSixJQUFJLElBQUksWUFBVSxLQUFLLGFBQVUsQ0FBQztJQUNsQyx5QkFBeUI7SUFDekIsd0JBQXdCO0lBQ3hCLHVEQUF1RDtJQUN2RCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL2xvZ2dlci50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvYXJtb3IudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2RpZS50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvZ2FtZS50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvaGVyby50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvaGVyb2VzU2luZ2xldG9uLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9zaGllbGQudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL3dlYXBvbi50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvd29ya2VyL3dvcmtlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaXNNdXRlID0gZmFsc2U7XHJcbmV4cG9ydCBmdW5jdGlvbiBsb2cobWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAvLyBpZiAoIWlzTXV0ZSkgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgICBpZiAoIWlzTXV0ZSkgcG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcImxvZ1wiLCBcIm1lc3NhZ2VcIjogbWVzc2FnZSB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldE11dGUoY2hhbmdlSXNNdXRlOiBib29sZWFuKSB7XHJcbiAgICBpc011dGUgPSBjaGFuZ2VJc011dGU7XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIEFybW9yIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGhpdHNTdG9wcGVkOiBudW1iZXI7XHJcbiAgICBtYUFkajogbnVtYmVyO1xyXG4gICAgZHhBZGo6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaGl0c1N0b3BwZWQ6IG51bWJlciwgbWFBZGo6IG51bWJlciwgZHhBZGo6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5oaXRzU3RvcHBlZCA9IGhpdHNTdG9wcGVkO1xyXG4gICAgICAgIHRoaXMubWFBZGogPSBtYUFkajtcclxuICAgICAgICB0aGlzLmR4QWRqID0gZHhBZGo7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgTk9fQVJNT1IgPSBuZXcgQXJtb3IoXCJObyBhcm1vclwiLCAwLCAwLCAwKTtcclxuICAgIHN0YXRpYyBMRUFUSEVSID0gbmV3IEFybW9yKFwiTGVhdGhlclwiLCAyLCAyLCAyKTtcclxuICAgIHN0YXRpYyBDSEFJTiA9IG5ldyBBcm1vcihcIkNoYWluXCIsIDMsIDQsIDQpO1xyXG4gICAgc3RhdGljIFBMQVRFID0gbmV3IEFybW9yKFwiUGxhdGVcIiwgNSwgNiwgNik7XHJcbn1cclxuXHJcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi9sb2dnZXJcIjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsKCkge1xyXG4gICAgY29uc3Qgcm9sbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYgKyAxKTtcclxuICAgIGxvZyhgRGllIHJvbGw6ICR7cm9sbH1gKTtcclxuICAgIHJldHVybiByb2xsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9sbERpY2UobnVtRGljZTogbnVtYmVyKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtRGljZTsgaSsrKSB7XHJcbiAgICAgICAgcmVzdWx0ICs9IHJvbGwoKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsVGhyZWVEaWNlKCkge1xyXG4gICAgcmV0dXJuIHJvbGxEaWNlKDMpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcm9sbEZvdXJEaWNlKCkge1xyXG4gICAgcmV0dXJuIHJvbGxEaWNlKDQpO1xyXG59IiwiaW1wb3J0IHsgSGVybyB9IGZyb20gXCIuL2hlcm9cIjtcclxuaW1wb3J0IHsgV2VhcG9uIH0gZnJvbSBcIi4vd2VhcG9uXCI7XHJcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi9sb2dnZXJcIjtcclxuaW1wb3J0IHsgcm9sbERpY2UgfSBmcm9tIFwiLi9kaWVcIjtcclxuaW1wb3J0IHsgSGVyb2VzU2luZ2xldG9uIH0gZnJvbSBcIi4vaGVyb2VzU2luZ2xldG9uXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuXHJcbiAgICBzdGF0aWMgaGVyb01hcCA9IG5ldyBNYXA8c3RyaW5nLCBIZXJvPigpOyAvLyBzaW5nbGV0b25cclxuICAgIGhlcm8xOiBIZXJvO1xyXG4gICAgaGVybzI6IEhlcm87XHJcbiAgICByb3VuZDogbnVtYmVyO1xyXG4gICAgd2luSGVybzE6IGJvb2xlYW47XHJcbiAgICB3aW5IZXJvMjogYm9vbGVhbjtcclxuICAgIGNyaXRpY2FsTWlzc2VzOiBudW1iZXI7XHJcbiAgICBjcml0aWNhbEhpdHM6IG51bWJlcjtcclxuICAgIHBvbGVDaGFyZ2U6IGJvb2xlYW47XHJcbiAgICBkZWZlbmRPblBvbGVDaGFyZ2U6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoaGVybzE6IEhlcm8sIGhlcm8yOiBIZXJvLCBwb2xlQ2hhcmdlOiBib29sZWFuLCBkZWZlbmRPblBvbGVDaGFyZ2U6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmhlcm8xID0gaGVybzE7XHJcbiAgICAgICAgdGhpcy5oZXJvMiA9IGhlcm8yO1xyXG4gICAgICAgIHRoaXMucm91bmQgPSAwO1xyXG4gICAgICAgIHRoaXMud2luSGVybzEgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLndpbkhlcm8yID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jcml0aWNhbE1pc3NlcyA9IDA7XHJcbiAgICAgICAgdGhpcy5jcml0aWNhbEhpdHMgPSAwO1xyXG4gICAgICAgIHRoaXMucG9sZUNoYXJnZSA9IHBvbGVDaGFyZ2U7XHJcbiAgICAgICAgdGhpcy5kZWZlbmRPblBvbGVDaGFyZ2UgPSBkZWZlbmRPblBvbGVDaGFyZ2U7XHJcbiAgICAgICAgbG9nKFwiTmV3IEdhbWUgd2l0aCBwb2xlIGNoYXJnZSBzZXQgdG8gXCIgKyB0aGlzLnBvbGVDaGFyZ2UgKyBcIiBhbmQgZGVmZW5kIG9uIHBvbGUgY2hhcmdlIHNldCB0byBcIiArIHRoaXMuZGVmZW5kT25Qb2xlQ2hhcmdlKTtcclxuICAgIH07XHJcblxyXG4gICAgZmlnaHRUb1RoZURlYXRoKCkge1xyXG4gICAgICAgIHZhciB3aW5uZXIgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFzIGxvbmcgYXMgYm90aCBhcmUgc3RpbGwgY29uc2Npb3VzIGFuZCBhdCBsZWFzdCBvbmUgY2FuIGRvIGRhbWFnZVxyXG4gICAgICAgICAqIE5vdGU6IGV2ZW4gdGhvdWdoIG9uZSBoZXJvIGJyZWFrcyBhIHdlYXBvbiwgdGhlIG90aGVyIGNvdWxkIGFsc29cclxuICAgICAgICAgKiBicmVhayBpdCByZXN1bHRpbmcgaW4gYSB0aWUuXHJcbiAgICAgICAgICogTm8gSFRIIGlzIGNvbnNpZGVyZWQuXHJcbiAgICAgICAgICogTm8gc2Vjb25kIHdlYXBvbiBpcyBjb25zaWRlcmVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHdoaWxlICgodGhpcy5oZXJvMS5pc0NvbnNjaW91cyAmJiB0aGlzLmhlcm8yLmlzQ29uc2Npb3VzKSAmJiAodGhpcy5oZXJvMS5jYW5Eb0RhbWFnZSB8fCB0aGlzLmhlcm8yLmNhbkRvRGFtYWdlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvdW5kKys7XHJcbiAgICAgICAgICAgIHRoaXMuaGVybzEubmV3Um91bmQoKTtcclxuICAgICAgICAgICAgdGhpcy5oZXJvMi5uZXdSb3VuZCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGxvZyhcIi0tLT4gUm91bmQgXCIgKyB0aGlzLnJvdW5kKTtcclxuICAgICAgICAgICAgbG9nKFwiSGVybyAxOiBcIiArIHRoaXMuaGVybzEubmFtZSArIFwiLCBTVDogXCIgKyB0aGlzLmhlcm8xLmdldFNUICsgXCIoXCIgKyB0aGlzLmhlcm8xLmFkalNUICsgXCIpXCIpO1xyXG4gICAgICAgICAgICBsb2coXCJIZXJvIDI6IFwiICsgdGhpcy5oZXJvMi5uYW1lICsgXCIsIFNUOiBcIiArIHRoaXMuaGVybzIuZ2V0U1QgKyBcIihcIiArIHRoaXMuaGVybzIuYWRqU1QgKyBcIilcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlyc3RBdHRhY2tlciA9IHRoaXMuaGVybzEsIHNlY29uZEF0dGFja2VyID0gdGhpcy5oZXJvMjtcclxuXHJcbiAgICAgICAgICAgIC8qIGhpZ2hlc3QgYWRqRHggYXR0YWNrcyBmaXJzdCAqL1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oZXJvMS5hZGp1c3RlZER4IDwgdGhpcy5oZXJvMi5hZGp1c3RlZER4KSB7XHJcbiAgICAgICAgICAgICAgICBmaXJzdEF0dGFja2VyID0gdGhpcy5oZXJvMjtcclxuICAgICAgICAgICAgICAgIHNlY29uZEF0dGFja2VyID0gdGhpcy5oZXJvMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKiByb2xsIHRvIHNlZSB3aG8gYXR0YWNrcyBmaXJzdCAqL1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmhlcm8xLmFkanVzdGVkRHggPT0gdGhpcy5oZXJvMi5hZGp1c3RlZER4KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nKGBBZGp1c3RlZCBkZXh0ZXJpdHkgKCR7dGhpcy5oZXJvMS5hZGp1c3RlZER4fSkgaXMgdGhlIHNhbWUgZm9yIGJvdGggZmlnaHRlcnM7IHJvbGxpbmcgdG8gZGVjaWRlIGF0dGFjayBvcmRlcmApO1xyXG4gICAgICAgICAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdEF0dGFja2VyID0gdGhpcy5oZXJvMjtcclxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRBdHRhY2tlciA9IHRoaXMuaGVybzE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxvZyhgJHtmaXJzdEF0dGFja2VyLm5hbWV9IChhZGpEeCA9ICR7Zmlyc3RBdHRhY2tlci5hZGp1c3RlZER4fSkgYXR0YWNrcyBiZWZvcmUgJHtzZWNvbmRBdHRhY2tlci5uYW1lfSAoYWRqRHggPSAke3NlY29uZEF0dGFja2VyLmFkanVzdGVkRHh9KWApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oZXJvMS5zZXRDaGFyZ2luZygodGhpcy5wb2xlQ2hhcmdlKSAmJiAodGhpcy5yb3VuZCA9PSAxKSAmJiB0aGlzLmhlcm8xLmdldFJlYWRpZWRXZWFwb24uaXNQb2xlKTtcclxuICAgICAgICAgICAgdGhpcy5oZXJvMi5zZXRDaGFyZ2luZygodGhpcy5wb2xlQ2hhcmdlKSAmJiAodGhpcy5yb3VuZCA9PSAxKSAmJiB0aGlzLmhlcm8yLmdldFJlYWRpZWRXZWFwb24uaXNQb2xlKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJ5RGVmZW5kaW5nKHRoaXMuaGVybzEsIHRoaXMuaGVybzIsIHRoaXMuZGVmZW5kT25Qb2xlQ2hhcmdlKTtcclxuICAgICAgICAgICAgdGhpcy50cnlEZWZlbmRpbmcodGhpcy5oZXJvMiwgdGhpcy5oZXJvMSwgdGhpcy5kZWZlbmRPblBvbGVDaGFyZ2UpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cnlTdGFuZFVwKGZpcnN0QXR0YWNrZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeVN0YW5kVXAoc2Vjb25kQXR0YWNrZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeVBpY2tVcChmaXJzdEF0dGFja2VyKTtcclxuICAgICAgICAgICAgdGhpcy50cnlQaWNrVXAoc2Vjb25kQXR0YWNrZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeUF0dGFjayh0aGlzLCBmaXJzdEF0dGFja2VyLCBzZWNvbmRBdHRhY2tlcik7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5QXR0YWNrKHRoaXMsIHNlY29uZEF0dGFja2VyLCBmaXJzdEF0dGFja2VyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmhlcm8xLmNhbkRvRGFtYWdlKSB7XHJcbiAgICAgICAgICAgIHdpbm5lciA9IHRoaXMuaGVybzE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmhlcm8yLmNhbkRvRGFtYWdlKSB7XHJcbiAgICAgICAgICAgIHdpbm5lciA9IHRoaXMuaGVybzI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgd2lubmVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3aW5uZXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsb2coYC0tLS0tLS0+IFRoZSB3aW5uZXIgb2YgdGhpcyBib3V0IGlzICR7d2lubmVyLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBsb2coXCItLS0tLS0tPiBUaGlzIGJvdXQgd2FzIGEgVElFIVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHdpbm5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByaXZhdGUgKHN0YXRpYykgZnVuY3Rpb25zLCBtdXN0IGJlIHBhc3NlZCBhIFwidGhpc1wiIGlmIHlvdSBuZWVkIGFjY2VzcyB0byBHYW1lXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgdHJ5RGVmZW5kaW5nKGRlZmVuZGVyOiBIZXJvLCBhdHRhY2tlcjogSGVybywgZGVmZW5kT25Qb2xlQ2hhcmdlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFkZWZlbmRlci5pc0tub2NrZWREb3duXHJcbiAgICAgICAgICAgICYmIGRlZmVuZGVyLmdldFJlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FXHJcbiAgICAgICAgICAgICYmIGRlZmVuZGVyLnN1ZmZlcmluZ0RleFBlbmFsdHkoKVxyXG4gICAgICAgICAgICAmJiBkZWZlbmRlci5hZGp1c3RlZER4IDwgOCkge1xyXG5cclxuICAgICAgICAgICAgZGVmZW5kZXIuc2V0RGVmZW5kaW5nKCk7XHJcbiAgICAgICAgICAgIGxvZyhgJHtkZWZlbmRlci5uYW1lfSBpcyBkZWZlbmRpbmcgdGhpcyB0dXJuIGJlY2F1c2UgYWRqRFggPCA4IGFuZCB0ZW1wb3JhcmlseSBwZW5hbGl6ZWQuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRlZmVuZE9uUG9sZUNoYXJnZVxyXG4gICAgICAgICAgICAmJiAhZGVmZW5kZXIuaXNLbm9ja2VkRG93blxyXG4gICAgICAgICAgICAmJiBkZWZlbmRlci5nZXRSZWFkaWVkV2VhcG9uICE9PSBXZWFwb24uTk9ORVxyXG4gICAgICAgICAgICAmJiBhdHRhY2tlci5nZXRSZWFkaWVkV2VhcG9uICE9PSBXZWFwb24uTk9ORVxyXG4gICAgICAgICAgICAmJiBhdHRhY2tlci5nZXRSZWFkaWVkV2VhcG9uLmlzUG9sZVxyXG4gICAgICAgICAgICAmJiBhdHRhY2tlci5pc0NoYXJnaW5nXHJcbiAgICAgICAgICAgICYmICFkZWZlbmRlci5pc0NoYXJnaW5nICAvLyBkb24ndCBkZWZlbmQgaWYgYWxzbyBjaGFyZ2luZyB3aXRoIHBvbGUgd2VhcG9uXHJcbiAgICAgICAgKSB7XHJcblxyXG4gICAgICAgICAgICBkZWZlbmRlci5zZXREZWZlbmRpbmcoKTtcclxuICAgICAgICAgICAgbG9nKGAke2RlZmVuZGVyLm5hbWV9IGlzIGRlZmVuZGluZyB0aGlzIHR1cm4gYmVjYXVzZSBhdHRhY2tlciBpcyBjaGFyZ2luZyB3aXRoIHBvbGUgd2VhcG9uLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHRyeVN0YW5kVXAoaGVybzogSGVybykge1xyXG4gICAgICAgIGlmIChoZXJvLmlzS25vY2tlZERvd24pIHtcclxuICAgICAgICAgICAgaGVyby5zdGFuZFVwKCk7XHJcblxyXG4gICAgICAgICAgICBsb2coYCR7aGVyby5uYW1lfSBpcyBzdGFuZGluZyB1cCB0aGlzIHR1cm4uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJ5UGlja1VwKGhlcm86IEhlcm8pIHtcclxuICAgICAgICBpZiAoaGVyby5nZXREcm9wcGVkV2VhcG9uKCkgIT09IFdlYXBvbi5OT05FKSB7XHJcbiAgICAgICAgICAgIGhlcm8ucGlja1VwV2VhcG9uKCk7XHJcbiAgICAgICAgICAgIGxvZyhgJHtoZXJvLm5hbWV9IGlzIHBpY2tpbmcgdXAgaGlzIHdlYXBvbiB0aGlzIHR1cm4gKHJlYXIgZmFjaW5nIGluIGFsbCBzaXggZGlyZWN0aW9ucykuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzb2x2ZUF0dGFjayhnYW1lOiBHYW1lLCBhdHRhY2tlcjogSGVybywgYXR0YWNrZWU6IEhlcm8sIHJvbGw6IG51bWJlciwgbnVtRGljZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGZhY2luZ0JvbnVzID0gYXR0YWNrZWUuaXNQcm9uZSA/IDQgOiAwO1xyXG5cclxuICAgICAgICBsb2coYXR0YWNrZXIubmFtZSArIFwiIHJvbGxlZCBcIiArIHJvbGwgKyBcIiBhbmQgYWRqRGV4IGlzIFwiXHJcbiAgICAgICAgICAgICsgKGF0dGFja2VlLmlzUHJvbmUgPyAoYXR0YWNrZXIuYWRqdXN0ZWREeCArIGZhY2luZ0JvbnVzICsgXCIgKFwiICsgYXR0YWNrZXIuYWRqdXN0ZWREeCArIFwiICsgXCIgKyBmYWNpbmdCb251cyArIFwiLCB0YXJnZXQgaXMgcHJvbmUsIGkuZS4sIGtub2NrZWQgZG93biBvciBwaWNraW5nIHVwIGEgd2VhcG9uKVwiKVxyXG4gICAgICAgICAgICAgICAgOiBhdHRhY2tlci5hZGp1c3RlZER4KSk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEEgaGl0IGlzIGEgcm9sbCB0aGF0IGlzXHJcbiAgICAgICAgICogTk9UIGFuIGF1dG9tYXRpYyBtaXNzIEFORFxyXG4gICAgICAgICAqIChiZWxvdyBvciBlcXVhbCB0byB0aGUgYXR0YWNrZXIncyBhZGpEZXggT1IgYW5kIGF1dG9tYXRpYyBoaXQpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQXV0b21hdGljTWlzcyhyb2xsLCBudW1EaWNlKSAmJiAocm9sbCA8PSBhdHRhY2tlci5hZGp1c3RlZER4ICsgZmFjaW5nQm9udXMgfHwgdGhpcy5pc0F1dG9tYXRpY0hpdChyb2xsLCBudW1EaWNlKSkpIHtcclxuICAgICAgICAgICAgbG9nKFwiSElUISEhIVwiKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBoaXRzID0gYXR0YWNrZXIuZ2V0UmVhZGllZFdlYXBvbi5kb0RhbWFnZSgpO1xyXG4gICAgICAgICAgICBpZiAoYXR0YWNrZXIuaXNDaGFyZ2luZyAmJiBhdHRhY2tlci5nZXRSZWFkaWVkV2VhcG9uLmlzUG9sZSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiUG9sZSB3ZWFwb24gY2hhcmdlIGRvZXMgZG91YmxlIGRhbWFnZSFcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmNyaXRpY2FsSGl0cysrO1xyXG4gICAgICAgICAgICAgICAgaGl0cyAqPSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRG91YmxlRGFtYWdlKHJvbGwsIG51bURpY2UpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJEb3VibGUgZGFtYWdlISAocm9sbCBvZiBcIiArIHJvbGwgKyBcIiBvbiBcIiArIG51bURpY2UgKyBcIiBkaWNlLilcIik7XHJcbiAgICAgICAgICAgICAgICBnYW1lLmNyaXRpY2FsSGl0cysrO1xyXG4gICAgICAgICAgICAgICAgaGl0cyAqPSAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaXNUcmlwbGVEYW1hZ2Uocm9sbCwgbnVtRGljZSkpIHtcclxuICAgICAgICAgICAgICAgIGxvZyhcIlRyaXBsZSBkYW1hZ2UhIChyb2xsIG9mIFwiICsgcm9sbCArIFwiIG9uIFwiICsgbnVtRGljZSArIFwiIGRpY2UuKVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxIaXRzKys7XHJcbiAgICAgICAgICAgICAgICBoaXRzICo9IDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbG9nKFwiVG90YWwgZGFtYWdlIGRvbmUgYnkgXCIgKyBhdHRhY2tlci5nZXRSZWFkaWVkV2VhcG9uLm5hbWUgKyBcIjogXCIgKyBoaXRzICsgXCIgaGl0c1wiKTtcclxuICAgICAgICAgICAgYXR0YWNrZWUudGFrZUhpdHMoaGl0cyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJdCdzIGEgbWlzc1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbG9nKFwiTWlzc2VkLiBcIik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRHJvcHBlZFdlYXBvbihyb2xsLCBudW1EaWNlKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiRHJvcHBlZCB3ZWFwb24hIFwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxNaXNzZXMrKztcclxuICAgICAgICAgICAgICAgIGF0dGFja2VyLmRyb3BXZWFwb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzQnJva2VuV2VhcG9uKHJvbGwsIG51bURpY2UpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJCcm9rZSB3ZWFwb24hIFwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxNaXNzZXMrKztcclxuICAgICAgICAgICAgICAgIGF0dGFja2VyLmJyZWFrV2VhcG9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSB0cnlBdHRhY2soZ2FtZTogR2FtZSwgYXR0YWNrZXI6IEhlcm8sIGF0dGFja2VlOiBIZXJvKSB7XHJcbiAgICAgICAgbG9nKGF0dGFja2VyLm5hbWUgKyBcIiBnZXRzIGhpcyB0dXJuIHRvIGF0dGFjay5cIik7XHJcbiAgICAgICAgaWYgKCFhdHRhY2tlci5pc0RlZmVuZGluZygpKSB7XHJcbiAgICAgICAgICAgIGlmIChhdHRhY2tlci5pc0NvbnNjaW91cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhdHRhY2tlci5pc0tub2NrZWREb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFja2VyLmdldFJlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2tlci5pc0NoYXJnaW5nKSBsb2coXCJIZSdzIGNoYXJnaW5nIHdpdGggcG9sZSB3ZWFwb24gKGRvdWJsZSBkYW1hZ2UgaWYgaGUgaGl0cykuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnVtRGljZSA9IGF0dGFja2VlLmlzRGVmZW5kaW5nKCkgPyA0IDogMztcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKFwiUm9sbGluZyB0byBoaXQgb24gXCIgKyBudW1EaWNlICsgXCIgZGljZS5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZUF0dGFjayhnYW1lLCBhdHRhY2tlciwgYXR0YWNrZWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xsRGljZShudW1EaWNlKSwgbnVtRGljZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZyhcIkJ1dCBoZSdzIG5vdCBhYmxlIHRvIGF0dGFjayBiZWNhdXNlIGhlIGhhcyBoYXMgbm8gcmVhZGllZCB3ZWFwb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxvZyhcIkJ1dCBoZSdzIG5vdCBhYmxlIHRvIGF0dGFjayBiZWNhdXNlIGhlIHdhcyBrbm9ja2VkIGRvd24uXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGxvZyhcIkJ1dCBoZSdzIG5vdCBhYmxlIHRvIGF0dGFjayBiZWNhdXNlIGhlJ3MgXCIgKyAoYXR0YWNrZXIuaXNBbGl2ZSA/IFwidW5jb25zY2lvdXMuXCIgOiBcImRlYWQuXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBsb2coXCJCdXQgaGUncyBkZWZlbmRpbmcuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgaXNBdXRvbWF0aWNNaXNzKHJvbGw6IG51bWJlciwgbnVtRGljZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHN3aXRjaCAobnVtRGljZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbCA+PSAxNik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsID49IDIwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgdmFsdWUgZm9yIHJvbGw6IFwiICsgcm9sbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc0F1dG9tYXRpY0hpdChyb2xsOiBudW1iZXIsIG51bURpY2U6IG51bWJlcikge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKG51bURpY2UpIHtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJvbGwgPD0gNSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIC8vIDQgZGljZSBpcyBhc3N1bWVkIHRvIGJlIGRlZmVuZGluZyAtIG5vIGF1dG1hdGljIGhpdHMgYWNjb3JkaW5nIHRvIE1lbGVlIHJ1bGVzXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgdmFsdWUgZm9yIHJvbGw6IFwiICsgcm9sbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc0RvdWJsZURhbWFnZShyb2xsOiBudW1iZXIsIG51bURpY2U6IG51bWJlcikge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKG51bURpY2UpIHtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJvbGwgPT0gNCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIC8vIDQgZGljZSBpcyBhc3N1bWVkIHRvIGJlIGRlZmVuZGluZyAtIG5vIGRvdWJsZSBkYW1hZ2UgYWNjb3JkaW5nIHRvIE1lbGVlIHJ1bGVzXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgdmFsdWUgZm9yIHJvbGw6IFwiICsgcm9sbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc1RyaXBsZURhbWFnZShyb2xsOiBudW1iZXIsIG51bURpY2U6IG51bWJlcikge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKG51bURpY2UpIHtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKHJvbGwgPT0gMyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIC8vIDQgZGljZSBpcyBhc3N1bWVkIHRvIGJlIGRlZmVuZGluZyAtIG5vIGRvdWJsZSBkYW1hZ2UgYWNjb3JkaW5nIHRvIE1lbGVlIHJ1bGVzXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgdmFsdWUgZm9yIHJvbGw6IFwiICsgcm9sbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpc0Ryb3BwZWRXZWFwb24ocm9sbDogbnVtYmVyLCBudW1EaWNlOiBudW1iZXIpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChudW1EaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsID09IDE3KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKChyb2xsID09IDIxKSB8fCAocm9sbCA9PSAyMikpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJ1bnN1cHBvcnRlZCB2YWx1ZSBmb3Igcm9sbDogXCIgKyByb2xsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzQnJva2VuV2VhcG9uKHJvbGw6IG51bWJlciwgbnVtRGljZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIHN3aXRjaCAobnVtRGljZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbCA9PSAxOCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9ICgocm9sbCA9PSAyMykgfHwgKHJvbGwgPT0gMjQpKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgdmFsdWUgZm9yIHJvbGw6IFwiICsgcm9sbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVIZXJvZXNNYXAoKSB7XHJcbiAgICAgICAgLy8gaGVyb1NldC5wdXQobmV3IEhlcm8oXCIwMDE6U1Q4O0RYMTY7REFHR0VSO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCA4LCAxNiwgV2VhcG9uLkRBR0dFUiwgQXJtb3IuTk9fQVJNT1IsIFNoaWVsZC5TTUFMTF9TSElFTEQpLCBuZXcgSW50ZWdlcigwKSk7XHJcbiAgICAgICAgdmFyIGgxO1xyXG4gICAgICAgIHZhciBoZXJvZXNMaXN0SlNPTiA9IEhlcm9lc1NpbmdsZXRvbi5nZXRIZXJvZXNMaXN0SlNPTigpO1xyXG4gICAgICAgIHZhciBoZXJvSlNPTiA9IG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXJvZXNMaXN0SlNPTi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBoZXJvSlNPTiA9IGhlcm9lc0xpc3RKU09OW2ldO1xyXG4gICAgICAgICAgICBoMSA9IG5ldyBIZXJvKGhlcm9KU09OLm5hbWUsIGhlcm9KU09OLnN0LCBoZXJvSlNPTi5keCwgaGVyb0pTT04ud2VhcG9uLCBoZXJvSlNPTi5hcm1vciwgaGVyb0pTT04uc2hpZWxkKTtcclxuICAgICAgICAgICAgLy90aGlzLnB1dEhlcm8oaDEpO1xyXG4gICAgICAgICAgICB0aGlzLmhlcm9NYXAuc2V0KGgxLm5hbWUsIGgxKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgZGlzcGxheUhlcm9lc01hcCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhHYW1lLmhlcm9NYXApKTtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIGdldEhlcm9NYXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIEdhbWUuaGVyb01hcDtcclxuICAgIH07XHJcblxyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBXZWFwb24gfSBmcm9tIFwiLi93ZWFwb25cIjtcclxuaW1wb3J0IHsgU2hpZWxkIH0gZnJvbSBcIi4vc2hpZWxkXCI7XHJcbmltcG9ydCB7IEFybW9yIH0gZnJvbSBcIi4vYXJtb3JcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhlcm8ge1xyXG5cclxuICAgIHByaXZhdGUgX25hbWU6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3N0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9keDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbWE6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3dlYXBvbjogV2VhcG9uO1xyXG4gICAgcHJpdmF0ZSBfcmVhZGllZFdlYXBvbjogV2VhcG9uO1xyXG4gICAgcHJpdmF0ZSBfYXJtb3I6IEFybW9yO1xyXG4gICAgcHJpdmF0ZSBfc2hpZWxkOiBTaGllbGQ7XHJcbiAgICBwcml2YXRlIF9rbm9ja2VkRG93bjogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3N0YW5kaW5nVXA6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9waWNraW5nVXBXZWFwb246IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9kcm9wcGVkV2VhcG9uOiBXZWFwb247XHJcbiAgICBwcml2YXRlIF9kYW1hZ2VUYWtlbjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZGFtYWdlVGFrZW5UaGlzUm91bmQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2luanVyeURleFBlbmFsdHk6IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9yZWNvdmVyaW5nOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfZGVmZW5kaW5nOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfY2hhcmdpbmc6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBzdDogbnVtYmVyLCBkeDogbnVtYmVyLCB3ZWFwb246IFdlYXBvbiwgYXJtb3I6IEFybW9yLCBzaGllbGQ6IFNoaWVsZCkge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuX3N0ID0gc3Q7XHJcbiAgICAgICAgdGhpcy5fZHggPSBkeDtcclxuICAgICAgICB0aGlzLl9tYSA9IDEwOyAvLyBoYXJkLWNvZGVkIGZvciBodW1hbnNcclxuICAgICAgICB0aGlzLl9yZWFkaWVkV2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHRoaXMuX2FybW9yID0gYXJtb3I7XHJcbiAgICAgICAgdGhpcy5fc2hpZWxkID0gc2hpZWxkO1xyXG4gICAgICAgIHRoaXMuX2tub2NrZWREb3duID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3RhbmRpbmdVcCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3BpY2tpbmdVcFdlYXBvbiA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3dlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICB0aGlzLl9kcm9wcGVkV2VhcG9uID0gV2VhcG9uLk5PTkU7XHJcblxyXG4gICAgICAgIHRoaXMuX2RhbWFnZVRha2VuID0gMDtcclxuICAgICAgICB0aGlzLl9kYW1hZ2VUYWtlblRoaXNSb3VuZCA9IDA7XHJcbiAgICAgICAgdGhpcy5faW5qdXJ5RGV4UGVuYWx0eSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3JlY292ZXJpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9kZWZlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9jaGFyZ2luZyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2V0U1QoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3Q7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYWRqU1QoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5tYXgodGhpcy5fc3QgLSB0aGlzLl9kYW1hZ2VUYWtlbiwgMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2V0TUEoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWE7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgYWRqdXN0ZWRNQSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYSAtIHRoaXMuX2FybW9yLm1hQWRqO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldERYKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R4O1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFkanVzdGVkRHgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZHggLSB0aGlzLl9hcm1vci5keEFkaiAtIHRoaXMuX3NoaWVsZC5keEFkaiAtICh0aGlzLl9pbmp1cnlEZXhQZW5hbHR5ID8gMiA6IDApIC0gKHRoaXMuaXNTdHJlbmd0aExvd1BlbmFsdHkgPyAzIDogMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZGFtYWdlVGFrZW5UaGlzUm91bmQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNBbGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4gPiAwKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc0NvbnNjaW91cygpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4gPiAxKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc0tub2NrZWREb3duKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9rbm9ja2VkRG93bjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHN0YW5kVXAoKSB7XHJcbiAgICAgICAgdGhpcy5fc3RhbmRpbmdVcCA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlc2UgcnVsZXMgbWF5YmUgc2hvdWxkIGdvIGludG8gR2FtZSAoYmV0dGVyIGNvaGVzaW9uKVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbmV3Um91bmQoKSB7XHJcbiAgICAgICAgdGhpcy5fY2hhcmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9kZWZlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9kYW1hZ2VUYWtlblRoaXNSb3VuZCA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YW5kaW5nVXApIHtcclxuICAgICAgICAgICAgdGhpcy5fa25vY2tlZERvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhbmRpbmdVcCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9waWNraW5nVXBXZWFwb24pICAvLyB0ZWNobmljYWxseSBcIndhc1wiIHBpY2tpbmcgdXAgd2VhcG9uIGxhc3Qgcm91bmRcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlYWRpZWRXZWFwb24gPSB0aGlzLl9kcm9wcGVkV2VhcG9uO1xyXG4gICAgICAgICAgICB0aGlzLl9kcm9wcGVkV2VhcG9uID0gV2VhcG9uLk5PTkU7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpY2tpbmdVcFdlYXBvbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBEZXggcGVuYWx0eSBkdWUgdG8gaW5qdXJ5IGxhc3RzIG9uZSBjb21wbGV0ZSByb3VuZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmp1cnlEZXhQZW5hbHR5ICYmIHRoaXMuX3JlY292ZXJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5qdXJ5RGV4UGVuYWx0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWNvdmVyaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX2luanVyeURleFBlbmFsdHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjb3ZlcmluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgdGFrZUhpdHMoaGl0czogbnVtYmVyKSB7XHJcbiAgICAgICAgdmFyIGFybW9yUG9pbnRzID0gdGhpcy5fYXJtb3IuaGl0c1N0b3BwZWQgKyB0aGlzLl9zaGllbGQuaGl0c1N0b3BwZWQ7XHJcbiAgICAgICAgdmFyIGRhbWFnZURvbmUgPSBoaXRzIC0gYXJtb3JQb2ludHM7XHJcbiAgICAgICAgaWYgKGRhbWFnZURvbmUgPCAwKSBkYW1hZ2VEb25lID0gMDtcclxuXHJcblxyXG4gICAgICAgIGxvZyh0aGlzLl9uYW1lICsgXCIgdGFraW5nIFwiICsgaGl0cyArIFwiIGhpdHMuXCIpO1xyXG4gICAgICAgIGxvZyh0aGlzLl9hcm1vci5uYW1lICsgXCIgc3RvcHMgXCIgKyB0aGlzLl9hcm1vci5oaXRzU3RvcHBlZCk7XHJcbiAgICAgICAgbG9nKHRoaXMuX3NoaWVsZC5uYW1lICsgXCIgc3RvcHMgXCIgKyB0aGlzLl9zaGllbGQuaGl0c1N0b3BwZWQpO1xyXG4gICAgICAgIGxvZyh0aGlzLl9uYW1lICsgXCIgdGFraW5nIFwiICsgZGFtYWdlRG9uZSArIFwiIGRhbWFnZS5cIik7XHJcblxyXG4gICAgICAgIHRoaXMudGFrZURhbWFnZShkYW1hZ2VEb25lKTtcclxuICAgICAgICByZXR1cm4gZGFtYWdlRG9uZTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZnRlciBpdCdzIGdvdCBwYXN0IGFybW9yLCBldGMuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0YWtlRGFtYWdlKGRhbWFnZURvbmU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2RhbWFnZVRha2VuICs9IGRhbWFnZURvbmU7XHJcbiAgICAgICAgdGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQgKz0gZGFtYWdlRG9uZTtcclxuICAgICAgICB0aGlzLl9pbmp1cnlEZXhQZW5hbHR5ID0gdGhpcy5zdWZmZXJpbmdEZXhQZW5hbHR5KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pbmp1cnlEZXhQZW5hbHR5KSBsb2codGhpcy5fbmFtZSArIFwiIGhhcyBhbiBhZGpEeCBwZW5hbHR5IG9mIC0yIGZvciByZW1haW5kZXIgb2YgdGhpcyByb3VuZCBhbmQgdGhlIE5FWFQgcm91bmQuXCIpO1xyXG4gICAgICAgIGxvZyh0aGlzLl9uYW1lICsgXCIgaGFzIG5vdyB0YWtlbiBcIiArIHRoaXMuX2RhbWFnZVRha2VuICsgXCIgcG9pbnRzIG9mIGRhbWFnZSwgU1QgPSBcIiArIHRoaXMuX3N0ICsgKHRoaXMuX2RhbWFnZVRha2VuID49IHRoaXMuX3N0ID8gXCIgYW5kIGlzIERFQUQuXCIgOiAodGhpcy5fc3QgLSB0aGlzLl9kYW1hZ2VUYWtlbiA9PT0gMSA/IFwiIGFuZCBpcyBVTkNPTlNDSU9VUy5cIiA6IFwiLlwiKSkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQgPj0gOCkge1xyXG4gICAgICAgICAgICB0aGlzLl9rbm9ja2VkRG93biA9IHRydWU7XHJcbiAgICAgICAgICAgIGxvZyh0aGlzLl9uYW1lICsgXCIgaGFzIGJlZW4ga25vY2tlZCBkb3duIGJ5IGRhbWFnZS5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmlzU3RyZW5ndGhMb3dQZW5hbHR5KSBsb2codGhpcy5fbmFtZSArIFwiIGhhcyBhbiBhZGRpdGlvbmFsIERYIGFkanVzdG1lbnQgb2YgLTMgZHVlIHRvIFNUIDw9IDMuXCIpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHN1ZmZlcmluZ0RleFBlbmFsdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9kYW1hZ2VUYWtlblRoaXNSb3VuZCA+PSA1IHx8IHRoaXMuX3JlY292ZXJpbmcpO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzU3RyZW5ndGhMb3dQZW5hbHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fc3QgLSB0aGlzLl9kYW1hZ2VUYWtlbiA8PSAzKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHNldERlZmVuZGluZygpIHtcclxuICAgICAgICB0aGlzLl9kZWZlbmRpbmcgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgaXNEZWZlbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmVuZGluZztcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHNldENoYXJnaW5nKGlzQ2hhcmdpbmc6IGJvb2xlYW4pIHtcclxuICAgICAgICAvLyAgICAgICAgbG9nKFwiSGVybzogc2V0Q2hhcmdlIHRvIFwiICsgaXNDaGFyZ2luZyk7XHJcbiAgICAgICAgdGhpcy5fY2hhcmdpbmcgPSBpc0NoYXJnaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzQ2hhcmdpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJnaW5nO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzUHJvbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpY2tpbmdVcFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc1BpY2tpbmdVcFdlYXBvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGlja2luZ1VwV2VhcG9uO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0V2VhcG9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZWFwb247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgZ2V0UmVhZGllZFdlYXBvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZGllZFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGRyb3BXZWFwb24oKSB7XHJcbiAgICAgICAgdGhpcy5fZHJvcHBlZFdlYXBvbiA9IHRoaXMuX3JlYWRpZWRXZWFwb247XHJcbiAgICAgICAgdGhpcy5fcmVhZGllZFdlYXBvbiA9IFdlYXBvbi5OT05FO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgYnJlYWtXZWFwb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmVhZGllZFdlYXBvbiA9IFdlYXBvbi5OT05FO1xyXG4gICAgICAgIHRoaXMuX2Ryb3BwZWRXZWFwb24gPSBXZWFwb24uTk9ORTsgLy8gc2hvdWxkbid0IG5lZWQgdGhpcywgYnV0IGp1c3QgaW4gY2FzZVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJvcHBlZFdlYXBvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZHJvcHBlZFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHBpY2tVcFdlYXBvbigpIHtcclxuICAgICAgICB0aGlzLl9waWNraW5nVXBXZWFwb24gPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldEFybW9yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcm1vcjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHNldEFybW9yKGFybW9yOiBBcm1vcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcm1vciA9IGFybW9yO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFybW9yUG9pbnRzKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FybW9yLmhpdHNTdG9wcGVkICsgdGhpcy5fc2hpZWxkLmhpdHNTdG9wcGVkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldFNoaWVsZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hpZWxkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuX25hbWV9XFxuJHt0aGlzLl9hcm1vci50b1N0cmluZygpfVxcbiR7dGhpcy5fcmVhZGllZFdlYXBvbi50b1N0cmluZygpfWA7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgY2FuRG9EYW1hZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNDb25zY2lvdXMgJiYgKHRoaXMuX3JlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FIHx8IHRoaXMuX2Ryb3BwZWRXZWFwb24gIT09IFdlYXBvbi5OT05FKVxyXG4gICAgfTtcclxuXHJcbn1cclxuXHJcbiIsImltcG9ydCB7IFdlYXBvbiB9IGZyb20gXCIuL3dlYXBvblwiO1xyXG5pbXBvcnQgeyBBcm1vciB9IGZyb20gXCIuL2FybW9yXCI7XHJcbmltcG9ydCB7IFNoaWVsZCB9IGZyb20gXCIuL3NoaWVsZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhlcm9lc1NpbmdsZXRvbiB7XHJcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85NzUzODQxLzExNjgzNDJcclxuICAgIHByaXZhdGUgc3RhdGljIGxpc3RIZWlnaHQgPSAxNTtcclxuICAgIHByaXZhdGUgc3RhdGljIGhlcm9lc0xpc3RKU09OID1cclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDAxOlNUODtEWDE2O0RBR0dFUjtOT19BUk1PUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDAyOlNUODtEWDE2O0RBR0dFUjtMRUFUSEVSO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAwMzpTVDg7RFgxNjtEQUdHRVI7Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAwNDpTVDg7RFgxNjtEQUdHRVI7UExBVEU7U01BTExfU0hJRUxEXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAwNTpTVDg7RFgxNjtEQUdHRVI7Tk9fQVJNT1I7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAwNjpTVDg7RFgxNjtEQUdHRVI7TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMDc6U1Q4O0RYMTY7REFHR0VSO0NIQUlOO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMDg6U1Q4O0RYMTY7REFHR0VSO1BMQVRFO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMDk6U1Q5O0RYMTU7UkFQSUVSO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMTA6U1Q5O0RYMTU7UkFQSUVSO0xFQVRIRVI7U01BTExfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDExOlNUOTtEWDE1O1JBUElFUjtDSEFJTjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDEyOlNUOTtEWDE1O1JBUElFUjtQTEFURTtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDEzOlNUOTtEWDE1O1JBUElFUjtOT19BUk1PUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDE0OlNUOTtEWDE1O1JBUElFUjtMRUFUSEVSO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAxNTpTVDk7RFgxNTtSQVBJRVI7Q0hBSU47TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAxNjpTVDk7RFgxNTtSQVBJRVI7UExBVEU7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAxNzpTVDk7RFgxNTtDTFVCO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDE4OlNUOTtEWDE1O0NMVUI7TEVBVEhFUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDE5OlNUOTtEWDE1O0NMVUI7Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMjA6U1Q5O0RYMTU7Q0xVQjtQTEFURTtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAyMTpTVDk7RFgxNTtDTFVCO05PX0FSTU9SO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDIyOlNUOTtEWDE1O0NMVUI7TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDIzOlNUOTtEWDE1O0NMVUI7Q0hBSU47TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMjQ6U1Q5O0RYMTU7Q0xVQjtQTEFURTtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAyNTpTVDk7RFgxNTtKQVZFTElOO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDI2OlNUOTtEWDE1O0pBVkVMSU47TEVBVEhFUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDI3OlNUOTtEWDE1O0pBVkVMSU47Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMjg6U1Q5O0RYMTU7SkFWRUxJTjtQTEFURTtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAyOTpTVDk7RFgxNTtKQVZFTElOO05PX0FSTU9SO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDMwOlNUOTtEWDE1O0pBVkVMSU47TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDMxOlNUOTtEWDE1O0pBVkVMSU47Q0hBSU47TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMzI6U1Q5O0RYMTU7SkFWRUxJTjtQTEFURTtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAzMzpTVDEwO0RYMTQ7SEFNTUVSO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDM0OlNUMTA7RFgxNDtIQU1NRVI7TEVBVEhFUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDM1OlNUMTA7RFgxNDtIQU1NRVI7Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwMzY6U1QxMDtEWDE0O0hBTU1FUjtQTEFURTtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjAzNzpTVDEwO0RYMTQ7SEFNTUVSO05PX0FSTU9SO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDM4OlNUMTA7RFgxNDtIQU1NRVI7TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDM5OlNUMTA7RFgxNDtIQU1NRVI7Q0hBSU47TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNDA6U1QxMDtEWDE0O0hBTU1FUjtQTEFURTtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA0MTpTVDEwO0RYMTQ7Q1VUTEFTUztOT19BUk1PUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNDI6U1QxMDtEWDE0O0NVVExBU1M7TEVBVEhFUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA0MzpTVDEwO0RYMTQ7Q1VUTEFTUztDSEFJTjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNDQ6U1QxMDtEWDE0O0NVVExBU1M7UExBVEU7U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDQ1OlNUMTA7RFgxNDtDVVRMQVNTO05PX0FSTU9SO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA0NjpTVDEwO0RYMTQ7Q1VUTEFTUztMRUFUSEVSO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDQ3OlNUMTA7RFgxNDtDVVRMQVNTO0NIQUlOO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA0ODpTVDEwO0RYMTQ7Q1VUTEFTUztQTEFURTtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNDk6U1QxMTtEWDEzO1NIT1JUU1dPUkQ7Tk9fQVJNT1I7U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDUwOlNUMTE7RFgxMztTSE9SVFNXT1JEO0xFQVRIRVI7U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNTE6U1QxMTtEWDEzO1NIT1JUU1dPUkQ7Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDUyOlNUMTE7RFgxMztTSE9SVFNXT1JEO1BMQVRFO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA1MzpTVDExO0RYMTM7U0hPUlRTV09SRDtOT19BUk1PUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNTQ6U1QxMTtEWDEzO1NIT1JUU1dPUkQ7TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA1NTpTVDExO0RYMTM7U0hPUlRTV09SRDtDSEFJTjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNTY6U1QxMTtEWDEzO1NIT1JUU1dPUkQ7UExBVEU7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDU3OlNUMTE7RFgxMztNQUNFO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA1ODpTVDExO0RYMTM7TUFDRTtMRUFUSEVSO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDU5OlNUMTE7RFgxMztNQUNFO0NIQUlOO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA2MDpTVDExO0RYMTM7TUFDRTtQTEFURTtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNjE6U1QxMTtEWDEzO01BQ0U7Tk9fQVJNT1I7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDYyOlNUMTE7RFgxMztNQUNFO0xFQVRIRVI7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNjM6U1QxMTtEWDEzO01BQ0U7Q0hBSU47TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDY0OlNUMTE7RFgxMztNQUNFO1BMQVRFO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA2NTpTVDExO0RYMTM7U1BFQVI7Tk9fQVJNT1I7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA2NjpTVDExO0RYMTM7U1BFQVI7TEVBVEhFUjtOT19TSElFTERcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNQRUFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNjc6U1QxMTtEWDEzO1NQRUFSO0NIQUlOO05PX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNjg6U1QxMTtEWDEzO1NQRUFSO1BMQVRFO05PX1NISUVMRFwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNjk6U1QxMjtEWDEyO0JST0FEU1dPUkQ7Tk9fQVJNT1I7U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDcwOlNUMTI7RFgxMjtCUk9BRFNXT1JEO0xFQVRIRVI7U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNzE6U1QxMjtEWDEyO0JST0FEU1dPUkQ7Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDcyOlNUMTI7RFgxMjtCUk9BRFNXT1JEO1BMQVRFO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA3MzpTVDEyO0RYMTI7QlJPQURTV09SRDtOT19BUk1PUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNzQ6U1QxMjtEWDEyO0JST0FEU1dPUkQ7TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA3NTpTVDEyO0RYMTI7QlJPQURTV09SRDtDSEFJTjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwNzY6U1QxMjtEWDEyO0JST0FEU1dPUkQ7UExBVEU7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDc3OlNUMTM7RFgxMTtNT1JOSU5HU1RBUjtOT19BUk1PUjtTTUFMTF9TSElFTERcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDc4OlNUMTM7RFgxMTtNT1JOSU5HU1RBUjtMRUFUSEVSO1NNQUxMX1NISUVMRFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA3OTpTVDEzO0RYMTE7TU9STklOR1NUQVI7Q0hBSU47U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA4MDpTVDEzO0RYMTE7TU9STklOR1NUQVI7UExBVEU7U01BTExfU0hJRUxEXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA4MTpTVDEzO0RYMTE7TU9STklOR1NUQVI7Tk9fQVJNT1I7TEFSR0VfU0hJRUxEXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA4MjpTVDEzO0RYMTE7TU9STklOR1NUQVI7TEVBVEhFUjtMQVJHRV9TSElFTERcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwODM6U1QxMztEWDExO01PUk5JTkdTVEFSO0NIQUlOO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwODQ6U1QxMztEWDExO01PUk5JTkdTVEFSO1BMQVRFO0xBUkdFX1NISUVMRFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwODU6U1QxMztEWDExO0hBTEJFUkQ7Tk9fQVJNT1I7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDg2OlNUMTM7RFgxMTtIQUxCRVJEO0xFQVRIRVI7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwODc6U1QxMztEWDExO0hBTEJFUkQ7Q0hBSU47Tk9fU0hJRUxEXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDg4OlNUMTM7RFgxMTtIQUxCRVJEO1BMQVRFO05PX1NISUVMRFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA4OTpTVDE0O0RYMTA7VFdPX0hBTkRFRF9TV09SRDtOT19BUk1PUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwOTA6U1QxNDtEWDEwO1RXT19IQU5ERURfU1dPUkQ7TEVBVEhFUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA5MTpTVDE0O0RYMTA7VFdPX0hBTkRFRF9TV09SRDtDSEFJTjtOT19TSElFTERcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwOTI6U1QxNDtEWDEwO1RXT19IQU5ERURfU1dPUkQ7UExBVEU7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDkzOlNUMTU7RFg5O0JBVFRMRUFYRTtOT19BUk1PUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMDk0OlNUMTU7RFg5O0JBVFRMRUFYRTtMRUFUSEVSO05PX1NISUVMRFwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA5NTpTVDE1O0RYOTtCQVRUTEVBWEU7Q0hBSU47Tk9fU0hJRUxEXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA5NjpTVDE1O0RYOTtCQVRUTEVBWEU7UExBVEU7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA5NzpTVDE1O0RYOTtQSUtFX0FYRTtOT19BUk1PUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIwOTg6U1QxNTtEWDk7UElLRV9BWEU7TEVBVEhFUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjA5OTpTVDE1O0RYOTtQSUtFX0FYRTtDSEFJTjtOT19TSElFTERcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIxMDA6U1QxNTtEWDk7UElLRV9BWEU7UExBVEU7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMTAxOlNUMTY7RFg4O0JBVFRMRUFYRTtOT19BUk1PUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJuYW1lXCI6IFwiMTAyOlNUMTY7RFg4O0JBVFRMRUFYRTtMRUFUSEVSO05PX1NISUVMRFwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjEwMzpTVDE2O0RYODtCQVRUTEVBWEU7Q0hBSU47Tk9fU0hJRUxEXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjEwNDpTVDE2O0RYODtCQVRUTEVBWEU7UExBVEU7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjEwNTpTVDE2O0RYODtQSUtFX0FYRTtOT19BUk1PUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIxMDY6U1QxNjtEWDg7UElLRV9BWEU7TEVBVEhFUjtOT19TSElFTERcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwibmFtZVwiOiBcIjEwNzpTVDE2O0RYODtQSUtFX0FYRTtDSEFJTjtOT19TSElFTERcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcIm5hbWVcIjogXCIxMDg6U1QxNjtEWDg7UElLRV9BWEU7UExBVEU7Tk9fU0hJRUxEXCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH1cclxuICAgICAgICBdO1xyXG4gICAgc3RhdGljIGdldEhlcm9lc0xpc3RKU09OKCkge1xyXG4gICAgICAgIHJldHVybiBIZXJvZXNTaW5nbGV0b24uaGVyb2VzTGlzdEpTT047XHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGdldExpc3RIZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlcm9lc1NpbmdsZXRvbi5saXN0SGVpZ2h0O1xyXG4gICAgfTtcclxufVxyXG4iLCJleHBvcnQgY2xhc3MgU2hpZWxkIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGhpdHNTdG9wcGVkOiBudW1iZXI7XHJcbiAgICBkeEFkajogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBoaXRzU3RvcHBlZDogbnVtYmVyLCBkeEFkajogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaGl0c1N0b3BwZWQgPSBoaXRzU3RvcHBlZDtcclxuICAgICAgICB0aGlzLmR4QWRqID0gZHhBZGo7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgTk9fU0hJRUxEID0gbmV3IFNoaWVsZChcIk5vIHNoaWVsZFwiLCAwLCAwKTtcclxuICAgIHN0YXRpYyBTTUFMTF9TSElFTEQgPSBuZXcgU2hpZWxkKFwiU21hbGwgc2hpZWxkXCIsIDEsIDApO1xyXG4gICAgc3RhdGljIExBUkdFX1NISUVMRCA9IG5ldyBTaGllbGQoXCJMYXJnZSBzaGllbGRcIiwgMiwgMSk7XHJcbn1cclxuIiwiaW1wb3J0IHsgcm9sbERpY2UgfSBmcm9tIFwiLi9kaWVcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYXBvbiB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBzdDogbnVtYmVyO1xyXG4gICAgZGljZTogbnVtYmVyO1xyXG4gICAgbW9kaWZpZXI6IG51bWJlcjtcclxuICAgIGlzVHdvSGFuZGVkOiBib29sZWFuO1xyXG4gICAgaXNUaHJvd246IGJvb2xlYW47XHJcbiAgICBpc1BvbGU6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHN0OiBudW1iZXIsXHJcbiAgICAgICAgZGljZTogbnVtYmVyLFxyXG4gICAgICAgIG1vZGlmaWVyOiBudW1iZXIsXHJcbiAgICAgICAgaXNUd29IYW5kZWQ6IGJvb2xlYW4sXHJcbiAgICAgICAgaXNUaHJvd246IGJvb2xlYW4sXHJcbiAgICAgICAgaXNQb2xlOiBib29sZWFuLFxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnN0ID0gc3Q7XHJcbiAgICAgICAgdGhpcy5kaWNlID0gZGljZTtcclxuICAgICAgICB0aGlzLm1vZGlmaWVyID0gbW9kaWZpZXI7XHJcbiAgICAgICAgdGhpcy5pc1R3b0hhbmRlZCA9IGlzVHdvSGFuZGVkO1xyXG4gICAgICAgIHRoaXMuaXNQb2xlID0gaXNQb2xlO1xyXG4gICAgICAgIHRoaXMuaXNUaHJvd24gPSBpc1Rocm93bjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZG9EYW1hZ2UoKSB7XHJcbiAgICAgICAgbG9nKFxyXG4gICAgICAgICAgICBcIlJvbGxpbmcgZm9yIHdlYXBvbiBkb2luZyBcIlxyXG4gICAgICAgICAgICArIHRoaXMuZGljZVxyXG4gICAgICAgICAgICArIFwiZFwiXHJcbiAgICAgICAgICAgICsgKCh0aGlzLm1vZGlmaWVyID4gMCkgPyBcIitcIiA6IFwiXCIpXHJcbiAgICAgICAgICAgICsgKCh0aGlzLm1vZGlmaWVyICE9PSAwKSA/IHRoaXMubW9kaWZpZXIgOiBcIlwiKVxyXG4gICAgICAgICAgICArIFwiIGRhbWFnZS5cIik7XHJcbiAgICAgICAgbGV0IGRhbWFnZSA9IDA7XHJcbiAgICAgICAgZGFtYWdlICs9IHJvbGxEaWNlKHRoaXMuZGljZSk7XHJcbiAgICAgICAgZGFtYWdlICs9IHRoaXMubW9kaWZpZXI7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kaWZpZXIgIT09IDApIGxvZygoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIikgKyB0aGlzLm1vZGlmaWVyKTtcclxuICAgICAgICBpZiAoZGFtYWdlIDwgMCkgZGFtYWdlID0gMDtcclxuICAgICAgICBsb2coYFRvdGFsIHdlYXBvbiBkYW1hZ2U6ICR7ZGFtYWdlfWApO1xyXG4gICAgICAgIHJldHVybiBkYW1hZ2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lICsgXCIgKFwiICsgdGhpcy5kaWNlICsgXCJEXCIgKyAoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIikgKyAoKHRoaXMubW9kaWZpZXIgIT09IDApID8gdGhpcy5tb2RpZmllciA6IFwiXCIpICsgXCIpXCI7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBOT05FID0gbmV3IFdlYXBvbihcIk5vbmVcIiwgMCwgMCwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgREFHR0VSID0gbmV3IFdlYXBvbihcIkRhZ2dlclwiLCAwLCAxLCAtMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBSQVBJRVIgPSBuZXcgV2VhcG9uKFwiUmFwaWVyXCIsIDksIDEsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIENMVUIgPSBuZXcgV2VhcG9uKFwiQ2x1YlwiLCA5LCAxLCAwLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEhBTU1FUiA9IG5ldyBXZWFwb24oXCJIYW1tZXJcIiwgMTAsIDEsIDEsIHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQ1VUTEFTUyA9IG5ldyBXZWFwb24oXCJDdXRsYXNzXCIsIDEwLCAyLCAtMiwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgU0hPUlRTV09SRCA9IG5ldyBXZWFwb24oXCJTaG9ydHN3b3JkXCIsIDExLCAyLCAtMSwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgTUFDRSA9IG5ldyBXZWFwb24oXCJNYWNlXCIsIDExLCAyLCAtMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBTTUFMTF9BWCA9IG5ldyBXZWFwb24oXCJTbWFsbCBheFwiLCAxMSwgMSwgMiwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBCUk9BRFNXT1JEID0gbmV3IFdlYXBvbihcIkJyb2Fkc3dvcmRcIiwgMTIsIDIsIDAsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIE1PUk5JTkdTVEFSID0gbmV3IFdlYXBvbihcIk1vcm5pbmdzdGFyXCIsIDEzLCAyLCAxLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBUV09fSEFOREVEX1NXT1JEID0gbmV3IFdlYXBvbihcIlR3by1oYW5kZWQgc3dvcmRcIiwgMTQsIDMsIC0xLCBmYWxzZSwgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEJBVFRMRUFYRSA9IG5ldyBXZWFwb24oXCJCYXR0bGVheGVcIiwgMTUsIDMsIDAsIGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gcG9sZSB3ZWFwb25zXHJcbiAgICBzdGF0aWMgSkFWRUxJTiA9IG5ldyBXZWFwb24oXCJKYXZlbGluXCIsIDksIDEsIC0xLCB0cnVlLCBmYWxzZSwgdHJ1ZSk7XHJcbiAgICBzdGF0aWMgU1BFQVIgPSBuZXcgV2VhcG9uKFwiU3BlYXJcIiwgMTEsIDEsIDEsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgc3RhdGljIEhBTEJFUkQgPSBuZXcgV2VhcG9uKFwiSGFsYmVyZFwiLCAxMywgMiwgLTEsIGZhbHNlLCB0cnVlLCB0cnVlKTtcclxuICAgIHN0YXRpYyBQSUtFX0FYRSA9IG5ldyBXZWFwb24oXCJQaWtlIGF4ZVwiLCAxNSwgMiwgMiwgZmFsc2UsIHRydWUsIHRydWUpOyAgICAvLyBBbmQgbm93IHJldHVybiB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb25cclxuXHJcbn1cclxuXHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgR2FtZSB9IGZyb20gXCIuLi9tZWxlZS9nYW1lXCI7XHJcbmltcG9ydCB7IEhlcm8gfSBmcm9tIFwiLi4vbWVsZWUvaGVyb1wiO1xyXG5pbXBvcnQgeyBsb2csIHNldE11dGUgfSBmcm9tIFwiLi4vbG9nZ2VyXCI7XHJcblxyXG5jb25zdCBjdHg6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xyXG5cclxubGV0IHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCA9IGZhbHNlO1xyXG5sZXQgZGVmZW5kVnNQb2xlQ2hhcmdlID0gZmFsc2U7XHJcblxyXG5jdHgucG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcIndvcmtlciB3YWl0aW5nXCIgfSk7XHJcblxyXG5jdHguYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudDogYW55KSB7XHJcbiAgICAvKipcclxuICAgICAqIHBhcnNlIHRoZSBtZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhO1xyXG4gICAgY29uc29sZS5sb2coYFdvcmtlcjogZ290IG1lc3NhZ2UgJHtkYXRhLmNtZH1gKTtcclxuICAgIHN3aXRjaCAoZGF0YS5jbWQpIHtcclxuICAgICAgICBjYXNlIFwid2FrZSB1cFwiOlxyXG4gICAgICAgICAgICBjdHgucG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcIndvcmtlciB3YWl0aW5nXCIgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zdCBoZXJvU2V0ID0gbmV3IEFycmF5PEhlcm8+KCk7ICAvLyBsaXN0IG9mIGhlcm9lcyB0byBmaWdodFxyXG5cclxuICAgICAgICAgICAgR2FtZS5jcmVhdGVIZXJvZXNNYXAoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlSGVyb01hcCA9IEdhbWUuZ2V0SGVyb01hcCgpO1xyXG4gICAgICAgICAgICBkYXRhLnNlbGVjdGVkSGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKGhlcm9OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoZXJvID0gY29tcGxldGVIZXJvTWFwLmdldChoZXJvTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGVybykgaGVyb1NldC5wdXNoKGhlcm8pO1xyXG4gICAgICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDb25maWd1cmUgc2ltdWxhdG9yIG9wdGlvbnNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNldE11dGUoIWRhdGEuaXNWZXJib3NlKTtcclxuICAgICAgICAgICAgcG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kID0gZGF0YS5pc1BvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZDtcclxuICAgICAgICAgICAgZGVmZW5kVnNQb2xlQ2hhcmdlID0gZGF0YS5pc0RlZmVuZFZzUG9sZUNoYXJnZTtcclxuXHJcbiAgICAgICAgICAgIHRyeUFsbENvbWJpbmF0aW9ucyhoZXJvU2V0LCBkYXRhLmJvdXRDb3VudCk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmZ1bmN0aW9uIHRyeUFsbENvbWJpbmF0aW9ucyhoZXJvU2V0OiBBcnJheTxIZXJvPiwgYm91dENvdW50OiBudW1iZXIpIHtcclxuICAgIGxldCBtYXRjaHVwV2luczogeyBbaW5kZXg6IHN0cmluZ106IG51bWJlciB9ID0ge307ICAvLyBtYXAgb2YgaGVybyBhbmQgaW50ZWdlclxyXG4gICAgbGV0IGhlcm9XaW5zOiB7IFtpbmRleDogc3RyaW5nXTogbnVtYmVyIH0gPSB7fTtcclxuICAgIGxldCBnYW1lID0gbnVsbDtcclxuICAgIGxldCBzY29yZSA9IFsyXTtcclxuICAgIGxldCBwcm9ncmVzcyA9IDA7XHJcbiAgICAvLyBob3cgbWFueSBib3V0cyB0b3RhbCBpcyBOICogTi0xICogYm91dENvdW50XHJcbiAgICBsZXQgdG90YWxJdGVyYXRpb25zID0gaGVyb1NldC5sZW5ndGggKiAoaGVyb1NldC5sZW5ndGggLSAxKSAqIGJvdXRDb3VudCAvIDI7XHJcbiAgICBsZXQgaXRlcmF0aW9uQ291bnQgPSAwO1xyXG4gICAgaGVyb1NldC5mb3JFYWNoKGZ1bmN0aW9uIChoZXJvMSkge1xyXG4gICAgICAgIGhlcm9XaW5zW2hlcm8xLm5hbWVdID0gMDtcclxuICAgICAgICBoZXJvU2V0LmZvckVhY2goaGVybzIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaGVybzEgIT09IGhlcm8yKSBtYXRjaHVwV2luc1toZXJvMS5uYW1lICsgXCIvXCIgKyBoZXJvMi5uYW1lXSA9IDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuICAgIGxldCBsYXN0VXBkYXRlVGltZSA9IG5ldyBEYXRlKCk7IC8vIGZvciB0aHJvdHRsaW5nIHVwZGF0ZXNcclxuXHJcbiAgICBmb3IgKGxldCBoMSA9IDA7IGgxIDwgaGVyb1NldC5sZW5ndGg7IGgxKyspIHtcclxuICAgICAgICBsZXQgaGVybzEgPSBoZXJvU2V0W2gxXTtcclxuICAgICAgICBsZXQgaDIgPSAwO1xyXG4gICAgICAgIGxldCBoZXJvMiA9IGhlcm9TZXRbaDJdO1xyXG5cclxuICAgICAgICBmb3IgKGgyID0gaDEgKyAxOyBoMiA8IGhlcm9TZXQubGVuZ3RoOyBoMisrKSB7XHJcbiAgICAgICAgICAgIGhlcm8yID0gaGVyb1NldFtoMl07XHJcbiAgICAgICAgICAgIGxldCBzdW1Sb3VuZHMgPSAwO1xyXG4gICAgICAgICAgICBzY29yZVswXSA9IDA7XHJcbiAgICAgICAgICAgIHNjb3JlWzFdID0gMDtcclxuICAgICAgICAgICAgbG9nKCdNYXRjaHVwOiAnICsgaGVybzEubmFtZSArICcgdnMuICcgKyBoZXJvMi5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGJvdXQgPSAwOyBib3V0IDwgYm91dENvdW50OyBib3V0KyspIHtcclxuICAgICAgICAgICAgICAgIGxvZyhcIkJvdXQ6IFwiICsgYm91dCArIDEgKyBcIiBvZiBcIiArIGJvdXRDb3VudCk7XHJcbiAgICAgICAgICAgICAgICBpdGVyYXRpb25Db3VudCsrO1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBEb24ndCBwb3N0IHVwZGF0ZXMgdG9vIG9mdGVuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWUuZ2V0VGltZSgpIC0gbGFzdFVwZGF0ZVRpbWUuZ2V0VGltZSgpID4gNTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgICAgICogdXBkYXRlIHByb2dyZXNzIGJhciBvbiBwYWdlIChhc3N1bWVzIG1heCBpcyAxMDAwMClcclxuICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyA9IE1hdGguY2VpbCgoaXRlcmF0aW9uQ291bnQgLyB0b3RhbEl0ZXJhdGlvbnMpICogMTAwICogMTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjdHgucG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcInByb2dyZXNzVXBkYXRlXCIsIFwicHJvZ3Jlc3NcIjogcHJvZ3Jlc3MgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZVRpbWUgPSBjdXJyZW50VGltZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjbG9uZSBoZXJvZXMgKHJlc2V0cyB0aGVtKSBwcmlvciB0byBmaWdodGluZ1xyXG4gICAgICAgICAgICAgICAgbGV0IGZpZ2h0aW5nSGVybzEgPSBPYmplY3QuY3JlYXRlKGhlcm8xKTtcclxuICAgICAgICAgICAgICAgIGxldCBmaWdodGluZ0hlcm8yID0gT2JqZWN0LmNyZWF0ZShoZXJvMik7XHJcbiAgICAgICAgICAgICAgICBnYW1lID0gbmV3IEdhbWUoZmlnaHRpbmdIZXJvMSwgZmlnaHRpbmdIZXJvMiwgcG9sZVdlYXBvbnNDaGFyZ2VGaXJzdFJvdW5kLCBkZWZlbmRWc1BvbGVDaGFyZ2UpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHdpbm5pbmdGaWdodGVyID0gZ2FtZS5maWdodFRvVGhlRGVhdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAod2lubmluZ0ZpZ2h0ZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbG9zaW5nRmlnaHRlciA9ICh3aW5uaW5nRmlnaHRlciA9PT0gZmlnaHRpbmdIZXJvMSA/IGZpZ2h0aW5nSGVybzIgOiBmaWdodGluZ0hlcm8xKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAod2lubmluZ0ZpZ2h0ZXIgPT09IGZpZ2h0aW5nSGVybzEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmVbMF0rKztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29yZVsxXSsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB3aW5uaW5nRmlnaHRlci5uYW1lICsgXCIvXCIgKyBsb3NpbmdGaWdodGVyLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2h1cFdpbnNba2V5XSsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3VtUm91bmRzICs9IGdhbWUucm91bmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFVwZGF0ZSB0aGUgdG90YWwgc3RhdHMgZm9yIHRoZXNlIGhlcm9lc1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaGVyb1dpbnNbaGVybzEubmFtZV0gKz0gc2NvcmVbMF07XHJcbiAgICAgICAgICAgIGhlcm9XaW5zW2hlcm8yLm5hbWVdICs9IHNjb3JlWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFB1dCBzdGF0cyBiYWNrIG9uIHBhZ2VcclxuICAgICAqL1xyXG4gICAgY3R4LnBvc3RNZXNzYWdlKHsgXCJjbWRcIjogXCJwcm9ncmVzc1VwZGF0ZVwiLCBcInByb2dyZXNzXCI6IDEwMCoxMDAgfSk7XHJcbiAgICBjb25zb2xlLmxvZyhgQ3JlYXRpbmcgdGFibGVzIGluIHdvcmtlci4uLmApO1xyXG4gICAgY29uc3QgaGVyb1dpbnNUYWJsZUhUTUwgPSBjcmVhdGVUYWJsZUZyb21Qcm9wZXJ0aWVzKGhlcm9XaW5zLCAoaGVyb1NldC5sZW5ndGggLSAxKSAqIGJvdXRDb3VudCxcclxuICAgICAgICBgUmVzdWx0cyBmb3IgJHtoZXJvU2V0Lmxlbmd0aH0gaGVyb2VzLCBwYWlyZWQgdXAgZm9yICR7Ym91dENvdW50fSBib3V0cyBlYWNoOmAsIGZhbHNlKTtcclxuICAgIGNvbnN0IG1hdGNodXBXaW5zVGFibGVIVE1MOiBzdHJpbmcgPSBjcmVhdGVUYWJsZUZyb21Qcm9wZXJ0aWVzKG1hdGNodXBXaW5zLCBib3V0Q291bnQsXHJcbiAgICAgICAgYFBhaXJ3aXNlIHJlc3VsdHMgZm9yICR7aGVyb1NldC5sZW5ndGh9IGhlcm9lcywgcGFpcmVkIHVwIGZvciAke2JvdXRDb3VudH0gYm91dHMgZWFjaDpgLCB0cnVlKTtcclxuICAgIGN0eC5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgXCJjbWRcIjogXCJmaW5pc2hlZFwiLFxyXG4gICAgICAgIFwiaGVyb1dpbnNcIjogaGVyb1dpbnMsXHJcbiAgICAgICAgXCJtYXRjaHVwV2luc1wiOiBtYXRjaHVwV2lucyxcclxuICAgICAgICBcImhlcm9XaW5zVGFibGVIVE1MXCI6IGhlcm9XaW5zVGFibGVIVE1MLFxyXG4gICAgICAgIFwibWF0Y2h1cFdpbnNUYWJsZUhUTUxcIjogbWF0Y2h1cFdpbnNUYWJsZUhUTUxcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVUYWJsZUZyb21Qcm9wZXJ0aWVzKGhlcm9XaW5zOiB7IFtpbmRleDogc3RyaW5nXTogbnVtYmVyIH0sIHRvdGFsQ291bnQ6IG51bWJlciwgY2FwdGlvbjogc3RyaW5nLCBpc1ZlcnN1czogYm9vbGVhbik6IHN0cmluZyB7XHJcbiAgICAvLyB0Ymwuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIC8vIHRibC5jbGFzc05hbWUgPSBcInNvcnRhYmxlIHRhYmxlIHRhYmxlLXN0cmlwZWQgdGFibGUtY29uZGVuc2VkIGNhcHRpb24tdG9wXCI7IC8vIGJvb3RzdHJhcCAtLT4gY2xhc3M9XCJ0YWJsZSB0YWJsZS1zdHJpcGVkXCJcclxuICAgIC8vIC8vIHRibC5jbGFzc05hbWUgPSBcInNvcnRhYmxlXCI7ICAvLyBzb3J0dGFibGUuanMgaXMgdGhlIGhvb2tcclxuICAgIC8vIHRibC5zZXRBdHRyaWJ1dGUoXCJib3JkZXJcIiwgXCIwXCIpO1xyXG5cclxuICAgIC8vIDxjYXB0aW9uPlJlc3VsdHMgZm9yIDIgaGVyb2VzLCBwYWlyZWQgdXAgZm9yIDIgYm91dHMgZWFjaDwvY2FwdGlvbj48dGhlYWQ+PHRyPjx0aCBjbGFzcz1cIlwiPkhlcm88L3RoPjx0aCBpZD1cIndpbnNcIiBjbGFzcz1cIiBzb3J0dGFibGVfc29ydGVkX3JldmVyc2VcIiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0O1wiPldpbnM8c3BhbiBpZD1cInNvcnR0YWJsZV9zb3J0cmV2aW5kXCI+Jm5ic3A74pa0PC9zcGFuPjwvdGg+PHRoIGNsYXNzPVwiXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj4lIHRvdGFsPC90aD48L3RyPjwvdGhlYWQ+PHRib2R5Pjx0ciBjbGFzcz1cInN1Y2Nlc3NcIj48dGQ+MDA2OlNUODtEWDE2O0RBR0dFUjtMRUFUSEVSO0xBUkdFX1NISUVMRDwvdGQ+PHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+MjwvdGQ+PHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+MTAwPC90ZD48L3RyPjx0ciBjbGFzcz1cImRhbmdlclwiPjx0ZD4wMDU6U1Q4O0RYMTY7REFHR0VSO05PX0FSTU9SO0xBUkdFX1NISUVMRDwvdGQ+PHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+MDwvdGQ+PHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+MDwvdGQ+PC90cj48L3Rib2R5Pjx0Zm9vdD48L3Rmb290PjwvdGFibGU+XHJcblxyXG4gICAgLy8gLyoqXHJcbiAgICAvLyAgKiBhZGQgY2FwdGlvblxyXG4gICAgLy8gICovXHJcbiAgICAvLyBsZXQgdGJjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FwdGlvbicpO1xyXG4gICAgLy8gdGJjYXB0aW9uLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNhcHRpb24pKTtcclxuICAgIC8vIHRibC5hcHBlbmRDaGlsZCh0YmNhcHRpb24pO1xyXG4gICAgLy8gbGV0IHRiaGVhZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoZWFkJyk7XHJcbiAgICAvLyBsZXQgdHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpO1xyXG4gICAgLy8gbGV0IHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcclxuICAgIGxldCBodG1sID0gYDxjYXB0aW9uPiR7Y2FwdGlvbn08L2NhcHRpb24+PHRoZWFkPmA7XHJcbiAgICAvLyBpZiAoaXNWZXJzdXMpIHtcclxuICAgIC8vICAgICB0ZC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIkhlcm8gMVwiKSk7XHJcbiAgICAvLyAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgLy8gICAgIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcclxuICAgIC8vICAgICB0ZC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcInZzIEhlcm8gMlwiKSk7XHJcbiAgICAvLyAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgLy8gfSBlbHNlIHtcclxuICAgIC8vICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RoJyk7XHJcbiAgICAvLyAgICAgdGQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJIZXJvXCIpKTtcclxuICAgIC8vICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAvLyB9XHJcbiAgICBpZiAoaXNWZXJzdXMpIHtcclxuICAgICAgICBodG1sICs9IGA8dHI+PHRoPkhlcm8gMTwvdGg+PHRoPnZzIEhlcm8gMjwvdGg+YFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBodG1sICs9IGA8dHI+PHRoPkhlcm88L3RoPmBcclxuICAgIH1cclxuICAgIC8vIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGgnKTtcclxuICAgIC8vIHRkLmlkID0gKGlzVmVyc3VzID8gXCJtYXRjaFwiIDogXCJcIikgKyBcIndpbnNcIjtcclxuICAgIC8vIHRkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiV2luc1wiKSk7XHJcbiAgICAvLyAvLyB0ZC5zZXRBdHRyaWJ1dGUoXCJhbGlnblwiLCBcInJpZ2h0XCIpO1xyXG4gICAgLy8gdGQuc3R5bGUudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgLy8gdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgLy8gdGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0aCcpO1xyXG4gICAgLy8gdGQuc3R5bGUudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgLy8gdGQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCIlIHRvdGFsXCIpKTtcclxuICAgIC8vIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgIC8vIHRiaGVhZC5hcHBlbmRDaGlsZCh0cik7XHJcbiAgICAvLyB0YmwuYXBwZW5kQ2hpbGQodGJoZWFkKTtcclxuICAgIGh0bWwgKz0gYDx0aCBpZD1cIiR7aXNWZXJzdXMgPyAnbWF0Y2gnIDogJyd9d2luc1wiIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+V2luczwvdGg+PHRoIGNsYXNzPVwiXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj4lIHRvdGFsPC90aD48L3RyPjwvdGhlYWQ+YDtcclxuICAgIC8vIGxldCB0YmR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGJvZHknKTtcclxuICAgIC8vIGxldCBwZXJjZW50YWdlV2luID0gMDtcclxuICAgIC8vIGZvciAobGV0IHByb3BlcnR5IGluIGhlcm9XaW5zKSB7XHJcbiAgICAvLyAgICAgaWYgKGhlcm9XaW5zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgbGV0IHRib2R5ID0gJyc7XHJcbiAgICBsZXQgcGVyY2VudGFnZVdpbiA9IDA7XHJcbiAgICBsZXQgcGN0Q2xhc3M6IHN0cmluZztcclxuICAgIGZvciAobGV0IHByb3BlcnR5IGluIGhlcm9XaW5zKSB7XHJcbiAgICAgICAgaWYgKGhlcm9XaW5zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICBwZXJjZW50YWdlV2luID0gcGFyc2VJbnQoKChoZXJvV2luc1twcm9wZXJ0eV0gLyB0b3RhbENvdW50KSAqIDEwMCkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIHBjdENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChwZXJjZW50YWdlV2luID4gNzApXHJcbiAgICAgICAgICAgICAgICBwY3RDbGFzcyA9IGAgY2xhc3M9XCJhbGVydC1zdWNjZXNzXCJgO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChwZXJjZW50YWdlV2luIDwgMzApXHJcbiAgICAgICAgICAgICAgICBwY3RDbGFzcyA9IGAgY2xhc3M9XCJhbGVydC1kYW5nZXJcImA7XHJcbiAgICAgICAgICAgIHRib2R5ICs9IGA8dHIke3BjdENsYXNzfT5gO1xyXG4gICAgICAgICAgICBpZiAoaXNWZXJzdXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoZXJvZXMgPSBwcm9wZXJ0eS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICB0Ym9keSArPSBgPHRkPiR7aGVyb2VzWzBdfTwvdGQ+PHRkPiR7aGVyb2VzWzFdfTwvdGQ+YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRib2R5ICs9IGA8dGQ+JHtwcm9wZXJ0eX08L3RkPmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHRyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndHInKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGlzVmVyc3VzKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGxldCBoZXJvZXMgPSBwcm9wZXJ0eS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGhlcm9lc1swXSkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgdGQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaGVyb2VzWzFdKSk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHRyLmFwcGVuZENoaWxkKHRkKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0ZC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShwcm9wZXJ0eSkpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIC8vIGFkZCB0aGUgY29sdW1uIGZvciB0aGUgbnVtYmVyIG9mIHdpbnNcclxuICAgICAgICAgICAgLy8gICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGQuc3R5bGUudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHRkLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGhlcm9XaW5zW3Byb3BlcnR5XSArIFwiXCIpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB0ci5hcHBlbmRDaGlsZCh0ZCk7XHJcbiAgICAgICAgICAgIHRib2R5ICs9IGA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj4ke2hlcm9XaW5zW3Byb3BlcnR5XX08L3RkPmBcclxuICAgICAgICAgICAgLy8gICAgICAgICB0ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RkJyk7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdGQuc3R5bGUudGV4dEFsaWduID0gXCJyaWdodFwiO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHBlcmNlbnRhZ2VXaW4gPSBwYXJzZUludCgoKGhlcm9XaW5zW3Byb3BlcnR5XSAvIHRvdGFsQ291bnQpICogMTAwKS50b0ZpeGVkKDIpKTtcclxuICAgICAgICAgICAgLy8gICAgICAgICB0ZC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiICsgcGVyY2VudGFnZVdpbikpO1xyXG4gICAgICAgICAgICB0Ym9keSArPSBgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+JHtwZXJjZW50YWdlV2lufTwvdGQ+PC90cj5gXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHBlcmNlbnRhZ2VXaW4gPiA3MCkgeyB0ci5jbGFzc05hbWUgPSBcInN1Y2Nlc3NcIjsgfVxyXG4gICAgICAgICAgICAvLyAgICAgICAgIGVsc2UgaWYgKHBlcmNlbnRhZ2VXaW4gPCAzMCkgeyB0ci5jbGFzc05hbWUgPSBcImRhbmdlclwiOyB9XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgdHIuYXBwZW5kQ2hpbGQodGQpO1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIHRiZHkuYXBwZW5kQ2hpbGQodHIpO1xyXG4gICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIH1cclxuICAgIGh0bWwgKz0gYDx0Ym9keT4ke3Rib2R5fTwvdGJvZHk+YDtcclxuICAgIC8vIHRibC5hcHBlbmRDaGlsZCh0YmR5KTtcclxuICAgIC8vIHJldHVybiB0YmwuaW5uZXJIVE1MO1xyXG4gICAgLy8gY29uc29sZS5sb2coYFdvcmtlciBnZW5lcmF0ZWQgdGhpcyBIVE1MOlxcbiR7aHRtbH1gKTtcclxuICAgIHJldHVybiBodG1sO1xyXG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9