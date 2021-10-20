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
var isMute = true;
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

/***/ "./src/melee/bout.ts":
/*!***************************!*\
  !*** ./src/melee/bout.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bout = void 0;
var hero_1 = __webpack_require__(/*! ./hero */ "./src/melee/hero.ts");
var weapon_1 = __webpack_require__(/*! ./weapon */ "./src/melee/weapon.ts");
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var heroesSingleton_1 = __webpack_require__(/*! ./heroesSingleton */ "./src/melee/heroesSingleton.ts");
var roll_1 = __webpack_require__(/*! ./roll */ "./src/melee/roll.ts");
var Bout = /** @class */ (function () {
    function Bout(hero1, hero2, poleCharge, defendOnPoleCharge) {
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
    Bout.prototype.fightToTheDeath = function () {
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
            (0, logger_1.log)("Hero 1: " + this.hero1.name + ", ST: " + this.hero1.st + "(" + this.hero1.adjST + ")");
            (0, logger_1.log)("Hero 2: " + this.hero2.name + ", ST: " + this.hero2.st + "(" + this.hero2.adjST + ")");
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
            this.hero1.setCharging((this.poleCharge) && (this.round == 1) && this.hero1.readiedWeapon.isPole);
            this.hero2.setCharging((this.poleCharge) && (this.round == 1) && this.hero2.readiedWeapon.isPole);
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
    Bout.prototype.tryDefending = function (defender, attacker, defendOnPoleCharge) {
        if (!defender.isKnockedDown
            && defender.readiedWeapon !== weapon_1.Weapon.NONE
            && defender.sufferingDexPenalty()
            && defender.adjustedDx < 8) {
            defender.setDefending();
            (0, logger_1.log)(defender.name + " is defending this turn because adjDX < 8 and temporarily penalized.");
        }
        else if (defendOnPoleCharge
            && !defender.isKnockedDown
            && defender.readiedWeapon !== weapon_1.Weapon.NONE
            && attacker.readiedWeapon !== weapon_1.Weapon.NONE
            && attacker.readiedWeapon.isPole
            && attacker.isCharging
            && !defender.isCharging // don't defend if also charging with pole weapon
        ) {
            defender.setDefending();
            (0, logger_1.log)(defender.name + " is defending this turn because attacker is charging with pole weapon.");
        }
    };
    Bout.prototype.tryStandUp = function (hero) {
        if (hero.isKnockedDown) {
            hero.standUp();
            (0, logger_1.log)(hero.name + " is standing up this turn.");
        }
    };
    Bout.prototype.tryPickUp = function (hero) {
        if (hero.getDroppedWeapon() !== weapon_1.Weapon.NONE) {
            hero.pickUpWeapon();
            (0, logger_1.log)(hero.name + " is picking up his weapon this turn (rear facing in all six directions).");
        }
    };
    Bout.prototype.facingBonusToAttack = function (attackee) {
        return attackee.isProne ? 4 : 0;
    };
    Bout.prototype.resolveAttack = function (game, attacker, attackee, roll) {
        var facingBonus = this.facingBonusToAttack(attackee);
        (0, logger_1.log)(attacker.name + " rolled " + roll.total + " and adjDex is "
            + (attackee.isProne ? (attacker.adjustedDx + facingBonus + " (" + attacker.adjustedDx + " + " + facingBonus + ", target is prone, i.e., knocked down or picking up a weapon)")
                : attacker.adjustedDx));
        /**
         * A hit is a roll that is
         * NOT an automatic miss AND
         * (below or equal to the attacker's adjDex OR and automatic hit)
         */
        if (!this.isAutomaticMiss(roll) && (roll.total <= attacker.adjustedDx + facingBonus || this.isAutomaticHit(roll))) {
            (0, logger_1.log)("HIT!!!!");
            var hits = attacker.readiedWeapon.doDamage();
            if (attacker.isCharging && attacker.readiedWeapon.isPole) {
                (0, logger_1.log)("Pole weapon charge does double damage!");
                game.criticalHits++;
                hits *= 2;
            }
            if (this.isDoubleDamage(roll)) {
                (0, logger_1.log)("Double damage! (roll of " + roll.total + " on " + roll.numberOfDice + " dice.)");
                game.criticalHits++;
                hits *= 2;
            }
            else if (this.isTripleDamage(roll)) {
                (0, logger_1.log)("Triple damage! (roll of " + roll.total + " on " + roll.numberOfDice + " dice.)");
                game.criticalHits++;
                hits *= 3;
            }
            (0, logger_1.log)("Total damage done by " + attacker.readiedWeapon.name + ": " + hits + " hits");
            attackee.takeHits(hits);
        }
        else {
            /**
             * It's a miss
             */
            (0, logger_1.log)("Missed. ");
            if (this.isDroppedWeapon(roll)) {
                (0, logger_1.log)("Dropped weapon! ");
                game.criticalMisses++;
                attacker.dropWeapon();
            }
            else if (this.isBrokenWeapon(roll)) {
                (0, logger_1.log)("Broke weapon! ");
                game.criticalMisses++;
                attacker.breakWeapon();
            }
        }
    };
    ;
    Bout.prototype.tryAttack = function (game, attacker, attackee) {
        (0, logger_1.log)(attacker.name + " gets his turn to attack.");
        if (!attacker.isDefending()) {
            if (attacker.isConscious) {
                if (!attacker.isKnockedDown) {
                    if (attacker.readiedWeapon !== weapon_1.Weapon.NONE) {
                        if (attacker.isCharging)
                            (0, logger_1.log)("He's charging with pole weapon (double damage if he hits).");
                        var numDice = attackee.isDefending() ? 4 : 3;
                        (0, logger_1.log)("Rolling to hit on " + numDice + " dice.");
                        this.resolveAttack(game, attacker, attackee, new roll_1.Roll(numDice));
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
    Bout.prototype.isAutomaticMiss = function (roll) {
        var result = false;
        switch (roll.numberOfDice) {
            case 3:
                result = (roll.total >= 16);
                break;
            case 4:
                result = (roll.total >= 20);
                break;
            default:
                throw new RangeError("unsupported number of dice: " + roll.numberOfDice);
        }
        return result;
    };
    Bout.prototype.isAutomaticHit = function (roll) {
        var result = false;
        switch (roll.numberOfDice) {
            case 3:
                result = (roll.total <= 5);
                break;
            case 4:
                // 4 dice is assumed to be defending - no automatic hits according to Melee rules
                result = false;
                break;
            default:
                throw new RangeError("unsupported number of dice: " + roll.numberOfDice);
        }
        return result;
    };
    Bout.prototype.isDoubleDamage = function (roll) {
        var result = false;
        switch (roll.numberOfDice) {
            case 3:
                result = (roll.total == 4);
                break;
            case 4:
                // 4 dice is assumed to be defending - no double damage according to Melee rules
                result = false;
                break;
            default:
                throw new RangeError("unsupported number of dice: " + roll.numberOfDice);
        }
        return result;
    };
    Bout.prototype.isTripleDamage = function (roll) {
        var result = false;
        switch (roll.numberOfDice) {
            case 3:
                result = (roll.total == 3);
                break;
            case 4:
                // 4 dice is assumed to be defending - no double damage according to Melee rules
                result = false;
                break;
            default:
                throw new RangeError("unsupported number of dice: " + roll.numberOfDice);
        }
        return result;
    };
    Bout.prototype.isDroppedWeapon = function (roll) {
        var result = false;
        switch (roll.numberOfDice) {
            case 3:
                result = (roll.total == 17);
                break;
            case 4:
                result = ((roll.total == 21) || (roll.total == 22));
                break;
            default:
                throw new RangeError("unsupported number of dice: " + roll.numberOfDice);
        }
        return result;
    };
    Bout.prototype.isBrokenWeapon = function (roll) {
        var result = false;
        switch (roll.numberOfDice) {
            case 3:
                result = (roll.total == 18);
                break;
            case 4:
                result = ((roll.total == 23) || (roll.total == 24));
                break;
            default:
                throw new RangeError("unsupported number of dice: " + roll.numberOfDice);
        }
        return result;
    };
    ;
    Bout.createHeroesMap = function () {
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
    Bout.prototype.displayHeroesMap = function () {
        console.log(Object.keys(Bout.heroMap));
    };
    ;
    Bout.getHeroMap = function () {
        return Bout.heroMap;
    };
    ;
    Bout.heroMap = new Map(); // singleton
    return Bout;
}());
exports.Bout = Bout;


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
    Object.defineProperty(Hero.prototype, "st", {
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
    Object.defineProperty(Hero.prototype, "ma", {
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
    Object.defineProperty(Hero.prototype, "dx", {
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
    Object.defineProperty(Hero.prototype, "weapon", {
        get: function () {
            return this._weapon;
        },
        set: function (weapon) {
            this._weapon = weapon;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Hero.prototype, "readiedWeapon", {
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
    Object.defineProperty(Hero.prototype, "armor", {
        get: function () {
            return this._armor;
        },
        set: function (armor) {
            this._armor = armor;
        },
        enumerable: false,
        configurable: true
    });
    ;
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
    HeroesSingleton.getMyrmidon = function () {
        return { "id": "069", "st": 12, "dx": 12, "weapon": weapon_1.Weapon.BROADSWORD, "armor": armor_1.Armor.NO_ARMOR, "shield": shield_1.Shield.SMALL_SHIELD };
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

/***/ "./src/melee/roll.ts":
/*!***************************!*\
  !*** ./src/melee/roll.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roll = void 0;
var die_1 = __webpack_require__(/*! ./die */ "./src/melee/die.ts");
var Roll = /** @class */ (function () {
    function Roll(numberOfDice, _modifier) {
        this._modifier = _modifier;
        this._rolls = Roll.rolled(numberOfDice);
    }
    Object.defineProperty(Roll.prototype, "rolls", {
        get: function () {
            return this._rolls;
        },
        set: function (rolls) {
            this._rolls = rolls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Roll.prototype, "modifier", {
        get: function () {
            return this._modifier;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Roll.prototype, "numberOfDice", {
        get: function () {
            return this._rolls.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Roll.prototype, "total", {
        get: function () {
            return this._rolls.reduce(function (a, b) { return a + b; }) + (this._modifier || 0);
        },
        enumerable: false,
        configurable: true
    });
    Roll.rolled = function (n) {
        var rolls = [];
        for (var index = 0; index < n; index++) {
            rolls.push((0, die_1.roll)());
        }
        return rolls;
    };
    return Roll;
}());
exports.Roll = Roll;


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
var logger_1 = __webpack_require__(/*! ../logger */ "./src/logger.ts");
var roll_1 = __webpack_require__(/*! ../melee/roll */ "./src/melee/roll.ts");
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
        var damage = new roll_1.Roll(this.dice, this.modifier).total;
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
var bout_1 = __webpack_require__(/*! ../melee/bout */ "./src/melee/bout.ts");
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
            bout_1.Bout.createHeroesMap();
            var completeHeroMap_1 = bout_1.Bout.getHeroMap();
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
                game = new bout_1.Bout(fightingHero1, fightingHero2, poleWeaponsChargeFirstRound, defendVsPoleCharge);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLndvcmtlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFNBQWdCLEdBQUcsQ0FBQyxPQUFlO0lBQy9CLHFDQUFxQztJQUNyQyxJQUFJLENBQUMsTUFBTTtRQUFFLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUhELGtCQUdDO0FBRUQsU0FBZ0IsT0FBTyxDQUFDLFlBQXFCO0lBQ3pDLE1BQU0sR0FBRyxZQUFZLENBQUM7QUFDMUIsQ0FBQztBQUZELDBCQUVDOzs7Ozs7Ozs7Ozs7OztBQ1JEO0lBS0ksZUFBWSxJQUFZLEVBQUUsV0FBbUIsRUFBRSxLQUFhLEVBQUUsS0FBYTtRQUN2RSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUN2QixDQUFDO0lBQ00sY0FBUSxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFDLGFBQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN4QyxXQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEMsV0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9DLFlBQUM7Q0FBQTtBQWZZLHNCQUFLOzs7Ozs7Ozs7Ozs7OztBQ0FsQixzRUFBOEI7QUFDOUIsNEVBQWtDO0FBQ2xDLHVFQUFnQztBQUVoQyx1R0FBbUQ7QUFDbkQsc0VBQThCO0FBRTlCO0lBYUksY0FBWSxLQUFXLEVBQUUsS0FBVyxFQUFFLFVBQW1CLEVBQUUsa0JBQTJCO1FBQ2xGLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGtCQUFrQixDQUFDO1FBQzdDLGdCQUFHLEVBQUMsbUNBQW1DLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxvQ0FBb0MsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoSSxDQUFDO0lBQUEsQ0FBQztJQUVGLDhCQUFlLEdBQWY7UUFDSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEI7Ozs7OztXQU1HO1FBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzdHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUd0QixnQkFBRyxFQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsZ0JBQUcsRUFBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztZQUM1RixnQkFBRyxFQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBRTVGLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFFNUQsaUNBQWlDO1lBQ2pDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUU7Z0JBQy9DLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMzQixjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUMvQjtZQUNELG1DQUFtQztpQkFDOUIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtnQkFFckQsZ0JBQUcsRUFBQyx5QkFBdUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLG9FQUFpRSxDQUFDLENBQUM7Z0JBQ25ILElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsRUFBRTtvQkFDckIsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7b0JBQzNCLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUMvQjthQUNKO1lBRUQsZ0JBQUcsRUFBSSxhQUFhLENBQUMsSUFBSSxrQkFBYSxhQUFhLENBQUMsVUFBVSx5QkFBb0IsY0FBYyxDQUFDLElBQUksa0JBQWEsY0FBYyxDQUFDLFVBQVUsTUFBRyxDQUFDLENBQUM7WUFFaEosSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUVuRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDdkQ7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3ZCO2FBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUMvQixNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUN2QjthQUFNO1lBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNqQjtRQUVELElBQUksTUFBTSxJQUFJLElBQUksRUFBRTtZQUNoQixnQkFBRyxFQUFDLHlDQUF1QyxNQUFNLENBQUMsSUFBTSxDQUFDLENBQUM7U0FDN0Q7YUFDSTtZQUNELGdCQUFHLEVBQUMsK0JBQStCLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7T0FFRztJQUNLLDJCQUFZLEdBQXBCLFVBQXFCLFFBQWMsRUFBRSxRQUFjLEVBQUUsa0JBQTJCO1FBQzVFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYTtlQUNwQixRQUFRLENBQUMsYUFBYSxLQUFLLGVBQU0sQ0FBQyxJQUFJO2VBQ3RDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtlQUM5QixRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUU1QixRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEIsZ0JBQUcsRUFBSSxRQUFRLENBQUMsSUFBSSx5RUFBc0UsQ0FBQyxDQUFDO1NBQy9GO2FBQ0ksSUFBSSxrQkFBa0I7ZUFDcEIsQ0FBQyxRQUFRLENBQUMsYUFBYTtlQUN2QixRQUFRLENBQUMsYUFBYSxLQUFLLGVBQU0sQ0FBQyxJQUFJO2VBQ3RDLFFBQVEsQ0FBQyxhQUFhLEtBQUssZUFBTSxDQUFDLElBQUk7ZUFDdEMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNO2VBQzdCLFFBQVEsQ0FBQyxVQUFVO2VBQ25CLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBRSxpREFBaUQ7VUFDNUU7WUFFRSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDeEIsZ0JBQUcsRUFBSSxRQUFRLENBQUMsSUFBSSwyRUFBd0UsQ0FBQyxDQUFDO1NBQ2pHO0lBQ0wsQ0FBQztJQUVPLHlCQUFVLEdBQWxCLFVBQW1CLElBQVU7UUFDekIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUVmLGdCQUFHLEVBQUksSUFBSSxDQUFDLElBQUksK0JBQTRCLENBQUMsQ0FBQztTQUNqRDtJQUNMLENBQUM7SUFFTSx3QkFBUyxHQUFoQixVQUFpQixJQUFVO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLEtBQUssZUFBTSxDQUFDLElBQUksRUFBRTtZQUN6QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsZ0JBQUcsRUFBSSxJQUFJLENBQUMsSUFBSSw2RUFBMEUsQ0FBQyxDQUFDO1NBQy9GO0lBQ0wsQ0FBQztJQUVNLGtDQUFtQixHQUExQixVQUEyQixRQUFjO1FBQ3JDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVPLDRCQUFhLEdBQXJCLFVBQXNCLElBQVUsRUFBRSxRQUFjLEVBQUUsUUFBYyxFQUFFLElBQVU7UUFDeEUsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXZELGdCQUFHLEVBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxpQkFBaUI7Y0FDekQsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEdBQUcsV0FBVyxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsVUFBVSxHQUFHLEtBQUssR0FBRyxXQUFXLEdBQUcsK0RBQStELENBQUM7Z0JBQzFLLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUVoQzs7OztXQUlHO1FBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxVQUFVLEdBQUcsV0FBVyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtZQUMvRyxnQkFBRyxFQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRWYsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUM3QyxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3RELGdCQUFHLEVBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxDQUFDO2FBQ2I7WUFDRCxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzNCLGdCQUFHLEVBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsQ0FBQztnQkFDdEYsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUNwQixJQUFJLElBQUksQ0FBQyxDQUFDO2FBQ2I7aUJBQ0ksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxnQkFBRyxFQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLENBQUM7Z0JBQ3RGLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxJQUFJLENBQUMsQ0FBQzthQUNiO1lBQ0QsZ0JBQUcsRUFBQyx1QkFBdUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1lBQ25GLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FFM0I7YUFBTTtZQUNIOztlQUVHO1lBQ0gsZ0JBQUcsRUFBQyxVQUFVLENBQUMsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVCLGdCQUFHLEVBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7YUFDekI7aUJBQ0ksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoQyxnQkFBRyxFQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQzFCO1NBRUo7SUFFTCxDQUFDO0lBQUEsQ0FBQztJQUVNLHdCQUFTLEdBQWpCLFVBQWtCLElBQVUsRUFBRSxRQUFjLEVBQUUsUUFBYztRQUN4RCxnQkFBRyxFQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsMkJBQTJCLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3pCLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUU7b0JBQ3pCLElBQUksUUFBUSxDQUFDLGFBQWEsS0FBSyxlQUFNLENBQUMsSUFBSSxFQUFFO3dCQUN4QyxJQUFJLFFBQVEsQ0FBQyxVQUFVOzRCQUFFLGdCQUFHLEVBQUMsNERBQTRELENBQUMsQ0FBQzt3QkFDM0YsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDL0MsZ0JBQUcsRUFBQyxvQkFBb0IsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUM7d0JBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQ3ZDLElBQUksV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUJBQzFCO3lCQUFNO3dCQUVILGdCQUFHLEVBQUMsbUVBQW1FLENBQUMsQ0FBQztxQkFDNUU7aUJBQ0o7cUJBQU07b0JBRUgsZ0JBQUcsRUFBQywwREFBMEQsQ0FBQyxDQUFDO2lCQUNuRTthQUNKO2lCQUFNO2dCQUVILGdCQUFHLEVBQUMsMkNBQTJDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDcEc7U0FDSjthQUFNO1lBRUgsZ0JBQUcsRUFBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQzlCO0lBRUwsQ0FBQztJQUFBLENBQUM7SUFFRiw4QkFBZSxHQUFmLFVBQWdCLElBQVU7UUFDdEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLFFBQVEsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN2QixLQUFLLENBQUM7Z0JBQ0YsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDNUIsTUFBTTtZQUVWLEtBQUssQ0FBQztnQkFDRixNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QixNQUFNO1lBRVY7Z0JBQ0ksTUFBTSxJQUFJLFVBQVUsQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDaEY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsNkJBQWMsR0FBZCxVQUFlLElBQVU7UUFDckIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLFFBQVEsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN2QixLQUFLLENBQUM7Z0JBQ0YsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsTUFBTTtZQUVWLEtBQUssQ0FBQztnQkFDRixpRkFBaUY7Z0JBQ2pGLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsTUFBTTtZQUVWO2dCQUNJLE1BQU0sSUFBSSxVQUFVLENBQUMsOEJBQThCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ2hGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELDZCQUFjLEdBQWQsVUFBZSxJQUFVO1FBQ3JCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNuQixRQUFRLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdkIsS0FBSyxDQUFDO2dCQUNGLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsZ0ZBQWdGO2dCQUNoRixNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNmLE1BQU07WUFFVjtnQkFDSSxNQUFNLElBQUksVUFBVSxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNoRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCw2QkFBYyxHQUFkLFVBQWUsSUFBVTtRQUNyQixJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3ZCLEtBQUssQ0FBQztnQkFDRixNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixNQUFNO1lBRVYsS0FBSyxDQUFDO2dCQUNGLGdGQUFnRjtnQkFDaEYsTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDZixNQUFNO1lBRVY7Z0JBQ0ksTUFBTSxJQUFJLFVBQVUsQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDaEY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsOEJBQWUsR0FBZixVQUFnQixJQUFVO1FBQ3RCLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNuQixRQUFRLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdkIsS0FBSyxDQUFDO2dCQUNGLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQzVCLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxNQUFNO1lBRVY7Z0JBQ0ksTUFBTSxJQUFJLFVBQVUsQ0FBQyw4QkFBOEIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDaEY7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsNkJBQWMsR0FBZCxVQUFlLElBQVU7UUFDckIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLFFBQVEsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN2QixLQUFLLENBQUM7Z0JBQ0YsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDNUIsTUFBTTtZQUVWLEtBQUssQ0FBQztnQkFDRixNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELE1BQU07WUFFVjtnQkFDSSxNQUFNLElBQUksVUFBVSxDQUFDLDhCQUE4QixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNoRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFBQSxDQUFDO0lBRUssb0JBQWUsR0FBdEI7UUFDSSxpSkFBaUo7UUFDakosSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFNLGNBQWMsR0FBRyxpQ0FBZSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDM0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVDLFFBQVEsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsRUFBRSxHQUFHLElBQUksV0FBSSxDQUFDLGlDQUFlLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0SSxtQkFBbUI7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNqQztJQUNMLENBQUM7SUFBQSxDQUFDO0lBRU0sK0JBQWdCLEdBQXhCO1FBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFBQSxDQUFDO0lBRUssZUFBVSxHQUFqQjtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBQUEsQ0FBQztJQTFWSyxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQWdCLENBQUMsQ0FBQyxZQUFZO0lBNFYxRCxXQUFDO0NBQUE7QUE5Vlksb0JBQUk7Ozs7Ozs7Ozs7Ozs7O0FDUGpCLHVFQUFnQztBQUVoQyxTQUFnQixJQUFJO0lBQ2hCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvQyxnQkFBRyxFQUFDLGVBQWEsSUFBTSxDQUFDLENBQUM7SUFDekIsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUpELG9CQUlDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLE9BQWU7SUFDcEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5QixNQUFNLElBQUksSUFBSSxFQUFFLENBQUM7S0FDcEI7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBTkQsNEJBTUM7QUFFRCxTQUFnQixhQUFhO0lBQ3pCLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQWdCLFlBQVk7SUFDeEIsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUZELG9DQUVDOzs7Ozs7Ozs7Ozs7OztBQ3RCRCw0RUFBa0M7QUFHbEMsdUVBQWdDO0FBRWhDO0lBc0JJLGNBQVksSUFBWSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsTUFBYyxFQUFFLEtBQVksRUFBRSxNQUFjO1FBQzFGLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QjtRQUN2QyxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQztRQUVsQyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDM0IsQ0FBQztJQUVELHNCQUFXLG9CQUFFO2FBQWI7WUFDSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsQ0FBQzs7O09BQUE7SUFFRCxzQkFBVyxzQkFBSTthQUFmO1lBQ0ksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsb0JBQUU7YUFBYjtZQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFFRixzQkFBVyx1QkFBSzthQUFoQjtZQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUYsc0JBQVcsb0JBQUU7YUFBYjtZQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFFRixzQkFBVyw0QkFBVTthQUFyQjtZQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUN4QyxDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFFRixzQkFBVyxvQkFBRTthQUFiO1lBQ0ksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3BCLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVGLHNCQUFXLDRCQUFVO2FBQXJCO1lBQ0ksT0FBTyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RJLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVGLHNCQUFXLHNDQUFvQjthQUEvQjtZQUNJLE9BQU8sSUFBSSxDQUFDLHFCQUFxQixDQUFDO1FBQ3RDLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVGLHNCQUFXLHlCQUFPO2FBQWxCO1lBQ0ksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDOzs7T0FBQTtJQUFBLENBQUM7SUFFRixzQkFBVyw2QkFBVzthQUF0QjtZQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUYsc0JBQVcsK0JBQWE7YUFBeEI7WUFDSSxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUssc0JBQU8sR0FBZDtRQUNJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFBQSxDQUFDO0lBRUY7O09BRUc7SUFDSSx1QkFBUSxHQUFmO1FBQ0ksSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDNUI7YUFDSSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRyxpREFBaUQ7U0FDbEY7WUFDSSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7WUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7U0FDakM7UUFFRDs7V0FFRztRQUNILElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQztZQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUM1QjthQUNJLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzdCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQUFBLENBQUM7SUFFSyx1QkFBUSxHQUFmLFVBQWdCLElBQVk7UUFDeEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDckUsSUFBSSxVQUFVLEdBQUcsSUFBSSxHQUFHLFdBQVcsQ0FBQztRQUNwQyxJQUFJLFVBQVUsR0FBRyxDQUFDO1lBQUUsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUduQyxnQkFBRyxFQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQztRQUMvQyxnQkFBRyxFQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVELGdCQUFHLEVBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDOUQsZ0JBQUcsRUFBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFFdkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QixPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBQUEsQ0FBQztJQUVGOztPQUVHO0lBQ0kseUJBQVUsR0FBakIsVUFBa0IsVUFBa0I7UUFDaEMsSUFBSSxDQUFDLFlBQVksSUFBSSxVQUFVLENBQUM7UUFDaEMsSUFBSSxDQUFDLHFCQUFxQixJQUFJLFVBQVUsQ0FBQztRQUN6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFcEQsSUFBSSxJQUFJLENBQUMsaUJBQWlCO1lBQUUsZ0JBQUcsRUFBQyxJQUFJLENBQUMsS0FBSyxHQUFHLDZFQUE2RSxDQUFDLENBQUM7UUFDNUgsZ0JBQUcsRUFBQyxJQUFJLENBQUMsS0FBSyxHQUFHLGlCQUFpQixHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMU4sSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksQ0FBQyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLGdCQUFHLEVBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxtQ0FBbUMsQ0FBQyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxJQUFJLENBQUMsb0JBQW9CO1lBQUUsZ0JBQUcsRUFBQyxJQUFJLENBQUMsS0FBSyxHQUFHLHdEQUF3RCxDQUFDLENBQUM7SUFFOUcsQ0FBQztJQUFBLENBQUM7SUFFSyxrQ0FBbUIsR0FBMUI7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLHFCQUFxQixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUFBLENBQUM7SUFFRixzQkFBVyxzQ0FBb0I7YUFBL0I7WUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVLLDJCQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUFBLENBQUM7SUFFSywwQkFBVyxHQUFsQjtRQUNJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBQUEsQ0FBQztJQUVLLDBCQUFXLEdBQWxCLFVBQW1CLFVBQW1CO1FBQ2xDLGtEQUFrRDtRQUNsRCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztJQUNoQyxDQUFDO0lBQUEsQ0FBQztJQUVGLHNCQUFXLDRCQUFVO2FBQXJCO1lBQ0ksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFCLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVGLHNCQUFXLHlCQUFPO2FBQWxCO1lBQ0ksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUYsc0JBQVcsbUNBQWlCO2FBQTVCO1lBQ0ksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7UUFDakMsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUYsc0JBQVcsd0JBQU07YUFBakI7WUFDSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQzthQUVELFVBQWtCLE1BQWM7WUFDNUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDMUIsQ0FBQzs7O09BSkE7SUFBQSxDQUFDO0lBSUQsQ0FBQztJQUVGLHNCQUFXLCtCQUFhO2FBQXhCO1lBQ0ksT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQy9CLENBQUM7OztPQUFBO0lBQUEsQ0FBQztJQUVLLHlCQUFVLEdBQWpCO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzFDLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQztJQUN0QyxDQUFDO0lBQUEsQ0FBQztJQUVLLDBCQUFXLEdBQWxCO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxlQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLHdDQUF3QztJQUMvRSxDQUFDO0lBQUEsQ0FBQztJQUVLLCtCQUFnQixHQUF2QjtRQUNJLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQixDQUFDO0lBQUEsQ0FBQztJQUVLLDJCQUFZLEdBQW5CO1FBQ0ksSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQUEsQ0FBQztJQUVGLHNCQUFXLHVCQUFLO2FBQWhCO1lBQ0ksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7YUFFRCxVQUFpQixLQUFZO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLENBQUM7OztPQUpBO0lBQUEsQ0FBQztJQUlELENBQUM7SUFFRixzQkFBVyw2QkFBVzthQUF0QjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDOUQsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUYsc0JBQVcsMkJBQVM7YUFBcEI7WUFDSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDeEIsQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBRUssdUJBQVEsR0FBZjtRQUNJLE9BQVUsSUFBSSxDQUFDLEtBQUssV0FBTSxJQUFJLENBQUMsR0FBRyxXQUFNLElBQUksQ0FBQyxHQUFHLFNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFNLENBQUM7SUFDckgsQ0FBQztJQUFBLENBQUM7SUFFRixzQkFBVyw2QkFBVzthQUF0QjtZQUNJLE9BQU8sSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEtBQUssZUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLGVBQU0sQ0FBQyxJQUFJLENBQUM7UUFDM0csQ0FBQzs7O09BQUE7SUFBQSxDQUFDO0lBclBhLGNBQVMsR0FBRyxDQUFDLENBQUM7SUF1UGpDLFdBQUM7Q0FBQTtBQXhQWSxvQkFBSTs7Ozs7Ozs7Ozs7Ozs7QUNMakIsNEVBQWtDO0FBQ2xDLHlFQUFnQztBQUNoQyw0RUFBa0M7QUFXbEM7SUFBQTtJQWdJQSxDQUFDO0lBZFUsaUNBQWlCLEdBQXhCO1FBQ0ksT0FBTyxlQUFlLENBQUMsY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFBQSxDQUFDO0lBQ0ssNkJBQWEsR0FBcEI7UUFDSSxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUM7SUFDdEMsQ0FBQztJQUFBLENBQUM7SUFDSyw2QkFBYSxHQUFwQixVQUFxQixFQUFVO1FBQzNCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGNBQUksSUFBSSxXQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBYixDQUFhLENBQUMsQ0FBQztRQUM3RCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUcsSUFBSSxDQUFDLEVBQUUsV0FBTSxJQUFJLENBQUMsRUFBRSxXQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFNLEVBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBWSxFQUFFLGdCQUFhLENBQUM7UUFDeEwsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUNNLDJCQUFXLEdBQWxCO1FBQ0ksT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDcEksQ0FBQztJQTlIRCw2Q0FBNkM7SUFDOUIsMEJBQVUsR0FBRyxFQUFFLENBQUM7SUFDaEIsOEJBQWMsR0FDekI7UUFDSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxD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Q0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDOUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNqSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDOUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUM5RyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFF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QUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3BILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDeEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN2SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3JILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNsSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2pILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDL0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ2xILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDakgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQy9HLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDaEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUMvRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQzdHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDN0csRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUN4SCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3ZILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDckgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsWUFBWSxFQUFFO1FBQ3hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxZQUFZLEVBQUU7UUFDdkgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFlBQVksRUFBRTtRQUNySCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsVUFBVSxFQUFF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LEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ25ILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNoSCxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxhQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxlQUFNLENBQUMsU0FBUyxFQUFFO1FBQ2hILEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLGFBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQU0sQ0FBQyxTQUFTLEVBQUU7UUFDbEgsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsYUFBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsZUFBTSxDQUFD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QixJQUFJLE1BQU0sR0FBRyxJQUFJLFdBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEQsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUM7WUFBRSxnQkFBRyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvRSxJQUFJLE1BQU0sR0FBRyxDQUFDO1lBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzQixnQkFBRyxFQUFDLDBCQUF3QixNQUFRLENBQUMsQ0FBQztRQUN0QyxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQUEsQ0FBQztJQUVLLHlCQUFRLEdBQWY7UUFDSSxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEksQ0FBQztJQUFBLENBQUM7SUFFSyxXQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEQsYUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsYUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELFdBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxhQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUQsY0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEUsaUJBQVUsR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3RFLFdBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pELGVBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRSxpQkFBVSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JFLGtCQUFXLEdBQUcsSUFBSSxNQUFN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LElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztJQUN0QixJQUFJLFFBQWdCLENBQUM7SUFDckIsS0FBSyxJQUFJLFFBQVEsSUFBSSxRQUFRLEVBQUU7UUFDM0IsSUFBSSxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ25DLGFBQWEsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxhQUFhLEdBQUcsRUFBRTtnQkFDbEIsUUFBUSxHQUFHLDBCQUF3QixDQUFDO2lCQUNuQyxJQUFJLGFBQWEsR0FBRyxFQUFFO2dCQUN2QixRQUFRLEdBQUcseUJBQXVCLENBQUM7WUFDdkMsS0FBSyxJQUFJLFFBQU0sUUFBUSxNQUFHLENBQUM7WUFDM0IsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsS0FBSyxJQUFJLFNBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxpQkFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLFVBQU8sQ0FBQzthQUN6RDtpQkFBTTtnQkFDSCxLQUFLLElBQUksU0FBTyxRQUFRLFVBQU87YUFDbEM7WUFDRCxLQUFLLElBQUksc0NBQWtDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBTztZQUNwRSxLQUFLLElBQUksc0NBQWtDLGFBQWEsZUFBWTtTQUN2RTtLQUNKO0lBQ0QsSUFBSSxJQUFJLFlBQVUsS0FBSyxhQUFVLENBQUM7SUFDbEMsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9sb2dnZXIudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2FybW9yLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9ib3V0LnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS9kaWUudHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2hlcm8udHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrLy4vc3JjL21lbGVlL2hlcm9lc1NpbmdsZXRvbi50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvcm9sbC50cyIsIndlYnBhY2s6Ly93ZWJ3b3JrZXItdHNjLXdlYnBhY2svLi9zcmMvbWVsZWUvc2hpZWxkLnRzIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy9tZWxlZS93ZWFwb24udHMiLCJ3ZWJwYWNrOi8vd2Vid29ya2VyLXRzYy13ZWJwYWNrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYndvcmtlci10c2Mtd2VicGFjay8uL3NyYy93b3JrZXIvd29ya2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBpc011dGUgPSB0cnVlO1xyXG5leHBvcnQgZnVuY3Rpb24gbG9nKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgLy8gaWYgKCFpc011dGUpIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgaWYgKCFpc011dGUpIHBvc3RNZXNzYWdlKHsgXCJjbWRcIjogXCJsb2dcIiwgXCJtZXNzYWdlXCI6IG1lc3NhZ2UgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRNdXRlKGNoYW5nZUlzTXV0ZTogYm9vbGVhbikge1xyXG4gICAgaXNNdXRlID0gY2hhbmdlSXNNdXRlO1xyXG59XHJcbiIsImV4cG9ydCBjbGFzcyBBcm1vciB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBoaXRzU3RvcHBlZDogbnVtYmVyO1xyXG4gICAgbWFBZGo6IG51bWJlcjtcclxuICAgIGR4QWRqOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGhpdHNTdG9wcGVkOiBudW1iZXIsIG1hQWRqOiBudW1iZXIsIGR4QWRqOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuaGl0c1N0b3BwZWQgPSBoaXRzU3RvcHBlZDtcclxuICAgICAgICB0aGlzLm1hQWRqID0gbWFBZGo7XHJcbiAgICAgICAgdGhpcy5keEFkaiA9IGR4QWRqO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIE5PX0FSTU9SID0gbmV3IEFybW9yKFwiTm8gYXJtb3JcIiwgMCwgMCwgMCk7XHJcbiAgICBzdGF0aWMgTEVBVEhFUiA9IG5ldyBBcm1vcihcIkxlYXRoZXJcIiwgMiwgMiwgMik7XHJcbiAgICBzdGF0aWMgQ0hBSU4gPSBuZXcgQXJtb3IoXCJDaGFpblwiLCAzLCA0LCA0KTtcclxuICAgIHN0YXRpYyBQTEFURSA9IG5ldyBBcm1vcihcIlBsYXRlXCIsIDUsIDYsIDYpO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgeyBIZXJvIH0gZnJvbSBcIi4vaGVyb1wiO1xyXG5pbXBvcnQgeyBXZWFwb24gfSBmcm9tIFwiLi93ZWFwb25cIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5pbXBvcnQgeyByb2xsRGljZSB9IGZyb20gXCIuL2RpZVwiO1xyXG5pbXBvcnQgeyBIZXJvZXNTaW5nbGV0b24gfSBmcm9tIFwiLi9oZXJvZXNTaW5nbGV0b25cIlxyXG5pbXBvcnQgeyBSb2xsIH0gZnJvbSBcIi4vcm9sbFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJvdXQge1xyXG5cclxuICAgIHN0YXRpYyBoZXJvTWFwID0gbmV3IE1hcDxzdHJpbmcsIEhlcm8+KCk7IC8vIHNpbmdsZXRvblxyXG4gICAgaGVybzE6IEhlcm87XHJcbiAgICBoZXJvMjogSGVybztcclxuICAgIHJvdW5kOiBudW1iZXI7XHJcbiAgICB3aW5IZXJvMTogYm9vbGVhbjtcclxuICAgIHdpbkhlcm8yOiBib29sZWFuO1xyXG4gICAgY3JpdGljYWxNaXNzZXM6IG51bWJlcjtcclxuICAgIGNyaXRpY2FsSGl0czogbnVtYmVyO1xyXG4gICAgcG9sZUNoYXJnZTogYm9vbGVhbjtcclxuICAgIGRlZmVuZE9uUG9sZUNoYXJnZTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihoZXJvMTogSGVybywgaGVybzI6IEhlcm8sIHBvbGVDaGFyZ2U6IGJvb2xlYW4sIGRlZmVuZE9uUG9sZUNoYXJnZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuaGVybzEgPSBoZXJvMTtcclxuICAgICAgICB0aGlzLmhlcm8yID0gaGVybzI7XHJcbiAgICAgICAgdGhpcy5yb3VuZCA9IDA7XHJcbiAgICAgICAgdGhpcy53aW5IZXJvMSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMud2luSGVybzIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyaXRpY2FsTWlzc2VzID0gMDtcclxuICAgICAgICB0aGlzLmNyaXRpY2FsSGl0cyA9IDA7XHJcbiAgICAgICAgdGhpcy5wb2xlQ2hhcmdlID0gcG9sZUNoYXJnZTtcclxuICAgICAgICB0aGlzLmRlZmVuZE9uUG9sZUNoYXJnZSA9IGRlZmVuZE9uUG9sZUNoYXJnZTtcclxuICAgICAgICBsb2coXCJOZXcgR2FtZSB3aXRoIHBvbGUgY2hhcmdlIHNldCB0byBcIiArIHRoaXMucG9sZUNoYXJnZSArIFwiIGFuZCBkZWZlbmQgb24gcG9sZSBjaGFyZ2Ugc2V0IHRvIFwiICsgdGhpcy5kZWZlbmRPblBvbGVDaGFyZ2UpO1xyXG4gICAgfTtcclxuXHJcbiAgICBmaWdodFRvVGhlRGVhdGgoKSB7XHJcbiAgICAgICAgbGV0IHdpbm5lciA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXMgbG9uZyBhcyBib3RoIGFyZSBzdGlsbCBjb25zY2lvdXMgYW5kIGF0IGxlYXN0IG9uZSBjYW4gZG8gZGFtYWdlXHJcbiAgICAgICAgICogTm90ZTogZXZlbiB0aG91Z2ggb25lIGhlcm8gYnJlYWtzIGEgd2VhcG9uLCB0aGUgb3RoZXIgY291bGQgYWxzb1xyXG4gICAgICAgICAqIGJyZWFrIGl0IHJlc3VsdGluZyBpbiBhIHRpZS5cclxuICAgICAgICAgKiBObyBIVEggaXMgY29uc2lkZXJlZC5cclxuICAgICAgICAgKiBObyBzZWNvbmQgd2VhcG9uIGlzIGNvbnNpZGVyZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgd2hpbGUgKCh0aGlzLmhlcm8xLmlzQ29uc2Npb3VzICYmIHRoaXMuaGVybzIuaXNDb25zY2lvdXMpICYmICh0aGlzLmhlcm8xLmNhbkRvRGFtYWdlIHx8IHRoaXMuaGVybzIuY2FuRG9EYW1hZ2UpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucm91bmQrKztcclxuICAgICAgICAgICAgdGhpcy5oZXJvMS5uZXdSb3VuZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmhlcm8yLm5ld1JvdW5kKCk7XHJcblxyXG5cclxuICAgICAgICAgICAgbG9nKFwiLS0tPiBSb3VuZCBcIiArIHRoaXMucm91bmQpO1xyXG4gICAgICAgICAgICBsb2coXCJIZXJvIDE6IFwiICsgdGhpcy5oZXJvMS5uYW1lICsgXCIsIFNUOiBcIiArIHRoaXMuaGVybzEuc3QgKyBcIihcIiArIHRoaXMuaGVybzEuYWRqU1QgKyBcIilcIik7XHJcbiAgICAgICAgICAgIGxvZyhcIkhlcm8gMjogXCIgKyB0aGlzLmhlcm8yLm5hbWUgKyBcIiwgU1Q6IFwiICsgdGhpcy5oZXJvMi5zdCArIFwiKFwiICsgdGhpcy5oZXJvMi5hZGpTVCArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBmaXJzdEF0dGFja2VyID0gdGhpcy5oZXJvMSwgc2Vjb25kQXR0YWNrZXIgPSB0aGlzLmhlcm8yO1xyXG5cclxuICAgICAgICAgICAgLyogaGlnaGVzdCBhZGpEeCBhdHRhY2tzIGZpcnN0ICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhlcm8xLmFkanVzdGVkRHggPCB0aGlzLmhlcm8yLmFkanVzdGVkRHgpIHtcclxuICAgICAgICAgICAgICAgIGZpcnN0QXR0YWNrZXIgPSB0aGlzLmhlcm8yO1xyXG4gICAgICAgICAgICAgICAgc2Vjb25kQXR0YWNrZXIgPSB0aGlzLmhlcm8xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIHJvbGwgdG8gc2VlIHdobyBhdHRhY2tzIGZpcnN0ICovXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuaGVybzEuYWRqdXN0ZWREeCA9PSB0aGlzLmhlcm8yLmFkanVzdGVkRHgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsb2coYEFkanVzdGVkIGRleHRlcml0eSAoJHt0aGlzLmhlcm8xLmFkanVzdGVkRHh9KSBpcyB0aGUgc2FtZSBmb3IgYm90aCBmaWdodGVyczsgcm9sbGluZyB0byBkZWNpZGUgYXR0YWNrIG9yZGVyYCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0QXR0YWNrZXIgPSB0aGlzLmhlcm8yO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlY29uZEF0dGFja2VyID0gdGhpcy5oZXJvMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbG9nKGAke2ZpcnN0QXR0YWNrZXIubmFtZX0gKGFkakR4ID0gJHtmaXJzdEF0dGFja2VyLmFkanVzdGVkRHh9KSBhdHRhY2tzIGJlZm9yZSAke3NlY29uZEF0dGFja2VyLm5hbWV9IChhZGpEeCA9ICR7c2Vjb25kQXR0YWNrZXIuYWRqdXN0ZWREeH0pYCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmhlcm8xLnNldENoYXJnaW5nKCh0aGlzLnBvbGVDaGFyZ2UpICYmICh0aGlzLnJvdW5kID09IDEpICYmIHRoaXMuaGVybzEucmVhZGllZFdlYXBvbi5pc1BvbGUpO1xyXG4gICAgICAgICAgICB0aGlzLmhlcm8yLnNldENoYXJnaW5nKCh0aGlzLnBvbGVDaGFyZ2UpICYmICh0aGlzLnJvdW5kID09IDEpICYmIHRoaXMuaGVybzIucmVhZGllZFdlYXBvbi5pc1BvbGUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cnlEZWZlbmRpbmcodGhpcy5oZXJvMSwgdGhpcy5oZXJvMiwgdGhpcy5kZWZlbmRPblBvbGVDaGFyZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeURlZmVuZGluZyh0aGlzLmhlcm8yLCB0aGlzLmhlcm8xLCB0aGlzLmRlZmVuZE9uUG9sZUNoYXJnZSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyeVN0YW5kVXAoZmlyc3RBdHRhY2tlcik7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5U3RhbmRVcChzZWNvbmRBdHRhY2tlcik7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5UGlja1VwKGZpcnN0QXR0YWNrZXIpO1xyXG4gICAgICAgICAgICB0aGlzLnRyeVBpY2tVcChzZWNvbmRBdHRhY2tlcik7XHJcbiAgICAgICAgICAgIHRoaXMudHJ5QXR0YWNrKHRoaXMsIGZpcnN0QXR0YWNrZXIsIHNlY29uZEF0dGFja2VyKTtcclxuICAgICAgICAgICAgdGhpcy50cnlBdHRhY2sodGhpcywgc2Vjb25kQXR0YWNrZXIsIGZpcnN0QXR0YWNrZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaGVybzEuY2FuRG9EYW1hZ2UpIHtcclxuICAgICAgICAgICAgd2lubmVyID0gdGhpcy5oZXJvMTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaGVybzIuY2FuRG9EYW1hZ2UpIHtcclxuICAgICAgICAgICAgd2lubmVyID0gdGhpcy5oZXJvMjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5uZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbm5lciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxvZyhgLS0tLS0tLT4gVGhlIHdpbm5lciBvZiB0aGlzIGJvdXQgaXMgJHt3aW5uZXIubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZyhcIi0tLS0tLS0+IFRoaXMgYm91dCB3YXMgYSBUSUUhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gd2lubmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJpdmF0ZSAoc3RhdGljKSBmdW5jdGlvbnMsIG11c3QgYmUgcGFzc2VkIGEgXCJ0aGlzXCIgaWYgeW91IG5lZWQgYWNjZXNzIHRvIEdhbWVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSB0cnlEZWZlbmRpbmcoZGVmZW5kZXI6IEhlcm8sIGF0dGFja2VyOiBIZXJvLCBkZWZlbmRPblBvbGVDaGFyZ2U6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoIWRlZmVuZGVyLmlzS25vY2tlZERvd25cclxuICAgICAgICAgICAgJiYgZGVmZW5kZXIucmVhZGllZFdlYXBvbiAhPT0gV2VhcG9uLk5PTkVcclxuICAgICAgICAgICAgJiYgZGVmZW5kZXIuc3VmZmVyaW5nRGV4UGVuYWx0eSgpXHJcbiAgICAgICAgICAgICYmIGRlZmVuZGVyLmFkanVzdGVkRHggPCA4KSB7XHJcblxyXG4gICAgICAgICAgICBkZWZlbmRlci5zZXREZWZlbmRpbmcoKTtcclxuICAgICAgICAgICAgbG9nKGAke2RlZmVuZGVyLm5hbWV9IGlzIGRlZmVuZGluZyB0aGlzIHR1cm4gYmVjYXVzZSBhZGpEWCA8IDggYW5kIHRlbXBvcmFyaWx5IHBlbmFsaXplZC5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZGVmZW5kT25Qb2xlQ2hhcmdlXHJcbiAgICAgICAgICAgICYmICFkZWZlbmRlci5pc0tub2NrZWREb3duXHJcbiAgICAgICAgICAgICYmIGRlZmVuZGVyLnJlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FXHJcbiAgICAgICAgICAgICYmIGF0dGFja2VyLnJlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FXHJcbiAgICAgICAgICAgICYmIGF0dGFja2VyLnJlYWRpZWRXZWFwb24uaXNQb2xlXHJcbiAgICAgICAgICAgICYmIGF0dGFja2VyLmlzQ2hhcmdpbmdcclxuICAgICAgICAgICAgJiYgIWRlZmVuZGVyLmlzQ2hhcmdpbmcgIC8vIGRvbid0IGRlZmVuZCBpZiBhbHNvIGNoYXJnaW5nIHdpdGggcG9sZSB3ZWFwb25cclxuICAgICAgICApIHtcclxuXHJcbiAgICAgICAgICAgIGRlZmVuZGVyLnNldERlZmVuZGluZygpO1xyXG4gICAgICAgICAgICBsb2coYCR7ZGVmZW5kZXIubmFtZX0gaXMgZGVmZW5kaW5nIHRoaXMgdHVybiBiZWNhdXNlIGF0dGFja2VyIGlzIGNoYXJnaW5nIHdpdGggcG9sZSB3ZWFwb24uYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdHJ5U3RhbmRVcChoZXJvOiBIZXJvKSB7XHJcbiAgICAgICAgaWYgKGhlcm8uaXNLbm9ja2VkRG93bikge1xyXG4gICAgICAgICAgICBoZXJvLnN0YW5kVXAoKTtcclxuXHJcbiAgICAgICAgICAgIGxvZyhgJHtoZXJvLm5hbWV9IGlzIHN0YW5kaW5nIHVwIHRoaXMgdHVybi5gKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyeVBpY2tVcChoZXJvOiBIZXJvKSB7XHJcbiAgICAgICAgaWYgKGhlcm8uZ2V0RHJvcHBlZFdlYXBvbigpICE9PSBXZWFwb24uTk9ORSkge1xyXG4gICAgICAgICAgICBoZXJvLnBpY2tVcFdlYXBvbigpO1xyXG4gICAgICAgICAgICBsb2coYCR7aGVyby5uYW1lfSBpcyBwaWNraW5nIHVwIGhpcyB3ZWFwb24gdGhpcyB0dXJuIChyZWFyIGZhY2luZyBpbiBhbGwgc2l4IGRpcmVjdGlvbnMpLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmFjaW5nQm9udXNUb0F0dGFjayhhdHRhY2tlZTogSGVybykge1xyXG4gICAgICAgIHJldHVybiBhdHRhY2tlZS5pc1Byb25lID8gNCA6IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZXNvbHZlQXR0YWNrKGdhbWU6IEJvdXQsIGF0dGFja2VyOiBIZXJvLCBhdHRhY2tlZTogSGVybywgcm9sbDogUm9sbCkge1xyXG4gICAgICAgIGNvbnN0IGZhY2luZ0JvbnVzID0gdGhpcy5mYWNpbmdCb251c1RvQXR0YWNrKGF0dGFja2VlKTtcclxuXHJcbiAgICAgICAgbG9nKGF0dGFja2VyLm5hbWUgKyBcIiByb2xsZWQgXCIgKyByb2xsLnRvdGFsICsgXCIgYW5kIGFkakRleCBpcyBcIlxyXG4gICAgICAgICAgICArIChhdHRhY2tlZS5pc1Byb25lID8gKGF0dGFja2VyLmFkanVzdGVkRHggKyBmYWNpbmdCb251cyArIFwiIChcIiArIGF0dGFja2VyLmFkanVzdGVkRHggKyBcIiArIFwiICsgZmFjaW5nQm9udXMgKyBcIiwgdGFyZ2V0IGlzIHByb25lLCBpLmUuLCBrbm9ja2VkIGRvd24gb3IgcGlja2luZyB1cCBhIHdlYXBvbilcIilcclxuICAgICAgICAgICAgICAgIDogYXR0YWNrZXIuYWRqdXN0ZWREeCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIGhpdCBpcyBhIHJvbGwgdGhhdCBpc1xyXG4gICAgICAgICAqIE5PVCBhbiBhdXRvbWF0aWMgbWlzcyBBTkRcclxuICAgICAgICAgKiAoYmVsb3cgb3IgZXF1YWwgdG8gdGhlIGF0dGFja2VyJ3MgYWRqRGV4IE9SIGFuZCBhdXRvbWF0aWMgaGl0KVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmICghdGhpcy5pc0F1dG9tYXRpY01pc3Mocm9sbCkgJiYgKHJvbGwudG90YWwgPD0gYXR0YWNrZXIuYWRqdXN0ZWREeCArIGZhY2luZ0JvbnVzIHx8IHRoaXMuaXNBdXRvbWF0aWNIaXQocm9sbCkpKSB7XHJcbiAgICAgICAgICAgIGxvZyhcIkhJVCEhISFcIik7XHJcblxyXG4gICAgICAgICAgICBsZXQgaGl0cyA9IGF0dGFja2VyLnJlYWRpZWRXZWFwb24uZG9EYW1hZ2UoKTtcclxuICAgICAgICAgICAgaWYgKGF0dGFja2VyLmlzQ2hhcmdpbmcgJiYgYXR0YWNrZXIucmVhZGllZFdlYXBvbi5pc1BvbGUpIHtcclxuICAgICAgICAgICAgICAgIGxvZyhcIlBvbGUgd2VhcG9uIGNoYXJnZSBkb2VzIGRvdWJsZSBkYW1hZ2UhXCIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5jcml0aWNhbEhpdHMrKztcclxuICAgICAgICAgICAgICAgIGhpdHMgKj0gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0RvdWJsZURhbWFnZShyb2xsKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiRG91YmxlIGRhbWFnZSEgKHJvbGwgb2YgXCIgKyByb2xsLnRvdGFsICsgXCIgb24gXCIgKyByb2xsLm51bWJlck9mRGljZSArIFwiIGRpY2UuKVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxIaXRzKys7XHJcbiAgICAgICAgICAgICAgICBoaXRzICo9IDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5pc1RyaXBsZURhbWFnZShyb2xsKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiVHJpcGxlIGRhbWFnZSEgKHJvbGwgb2YgXCIgKyByb2xsLnRvdGFsICsgXCIgb24gXCIgKyByb2xsLm51bWJlck9mRGljZSArIFwiIGRpY2UuKVwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxIaXRzKys7XHJcbiAgICAgICAgICAgICAgICBoaXRzICo9IDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbG9nKFwiVG90YWwgZGFtYWdlIGRvbmUgYnkgXCIgKyBhdHRhY2tlci5yZWFkaWVkV2VhcG9uLm5hbWUgKyBcIjogXCIgKyBoaXRzICsgXCIgaGl0c1wiKTtcclxuICAgICAgICAgICAgYXR0YWNrZWUudGFrZUhpdHMoaGl0cyk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJdCdzIGEgbWlzc1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbG9nKFwiTWlzc2VkLiBcIik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRHJvcHBlZFdlYXBvbihyb2xsKSkge1xyXG4gICAgICAgICAgICAgICAgbG9nKFwiRHJvcHBlZCB3ZWFwb24hIFwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxNaXNzZXMrKztcclxuICAgICAgICAgICAgICAgIGF0dGFja2VyLmRyb3BXZWFwb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmlzQnJva2VuV2VhcG9uKHJvbGwpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJCcm9rZSB3ZWFwb24hIFwiKTtcclxuICAgICAgICAgICAgICAgIGdhbWUuY3JpdGljYWxNaXNzZXMrKztcclxuICAgICAgICAgICAgICAgIGF0dGFja2VyLmJyZWFrV2VhcG9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSB0cnlBdHRhY2soZ2FtZTogQm91dCwgYXR0YWNrZXI6IEhlcm8sIGF0dGFja2VlOiBIZXJvKSB7XHJcbiAgICAgICAgbG9nKGF0dGFja2VyLm5hbWUgKyBcIiBnZXRzIGhpcyB0dXJuIHRvIGF0dGFjay5cIik7XHJcbiAgICAgICAgaWYgKCFhdHRhY2tlci5pc0RlZmVuZGluZygpKSB7XHJcbiAgICAgICAgICAgIGlmIChhdHRhY2tlci5pc0NvbnNjaW91cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFhdHRhY2tlci5pc0tub2NrZWREb3duKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dGFja2VyLnJlYWRpZWRXZWFwb24gIT09IFdlYXBvbi5OT05FKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2tlci5pc0NoYXJnaW5nKSBsb2coXCJIZSdzIGNoYXJnaW5nIHdpdGggcG9sZSB3ZWFwb24gKGRvdWJsZSBkYW1hZ2UgaWYgaGUgaGl0cykuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBudW1EaWNlID0gYXR0YWNrZWUuaXNEZWZlbmRpbmcoKSA/IDQgOiAzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2coXCJSb2xsaW5nIHRvIGhpdCBvbiBcIiArIG51bURpY2UgKyBcIiBkaWNlLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNvbHZlQXR0YWNrKGdhbWUsIGF0dGFja2VyLCBhdHRhY2tlZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBSb2xsKG51bURpY2UpKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nKFwiQnV0IGhlJ3Mgbm90IGFibGUgdG8gYXR0YWNrIGJlY2F1c2UgaGUgaGFzIGhhcyBubyByZWFkaWVkIHdlYXBvbi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nKFwiQnV0IGhlJ3Mgbm90IGFibGUgdG8gYXR0YWNrIGJlY2F1c2UgaGUgd2FzIGtub2NrZWQgZG93bi5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbG9nKFwiQnV0IGhlJ3Mgbm90IGFibGUgdG8gYXR0YWNrIGJlY2F1c2UgaGUncyBcIiArIChhdHRhY2tlci5pc0FsaXZlID8gXCJ1bmNvbnNjaW91cy5cIiA6IFwiZGVhZC5cIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGxvZyhcIkJ1dCBoZSdzIGRlZmVuZGluZy5cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgaXNBdXRvbWF0aWNNaXNzKHJvbGw6IFJvbGwpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChyb2xsLm51bWJlck9mRGljZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbC50b3RhbCA+PSAxNik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsLnRvdGFsID49IDIwKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgbnVtYmVyIG9mIGRpY2U6IFwiICsgcm9sbC5udW1iZXJPZkRpY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGlzQXV0b21hdGljSGl0KHJvbGw6IFJvbGwpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChyb2xsLm51bWJlck9mRGljZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbC50b3RhbCA8PSA1KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgLy8gNCBkaWNlIGlzIGFzc3VtZWQgdG8gYmUgZGVmZW5kaW5nIC0gbm8gYXV0b21hdGljIGhpdHMgYWNjb3JkaW5nIHRvIE1lbGVlIHJ1bGVzXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwidW5zdXBwb3J0ZWQgbnVtYmVyIG9mIGRpY2U6IFwiICsgcm9sbC5udW1iZXJPZkRpY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGlzRG91YmxlRGFtYWdlKHJvbGw6IFJvbGwpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgc3dpdGNoIChyb2xsLm51bWJlck9mRGljZSkge1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAocm9sbC50b3RhbCA9PSA0KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgLy8gNCBkaWNlIGlzIGFzc3VtZWQgdG8gYmUgZGVmZW5kaW5nIC0gbm8gZG91YmxlIGRhbWFnZSBhY2NvcmRpbmcgdG8gTWVsZWUgcnVsZXNcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJ1bnN1cHBvcnRlZCBudW1iZXIgb2YgZGljZTogXCIgKyByb2xsLm51bWJlck9mRGljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNUcmlwbGVEYW1hZ2Uocm9sbDogUm9sbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKHJvbGwubnVtYmVyT2ZEaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsLnRvdGFsID09IDMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAvLyA0IGRpY2UgaXMgYXNzdW1lZCB0byBiZSBkZWZlbmRpbmcgLSBubyBkb3VibGUgZGFtYWdlIGFjY29yZGluZyB0byBNZWxlZSBydWxlc1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInVuc3VwcG9ydGVkIG51bWJlciBvZiBkaWNlOiBcIiArIHJvbGwubnVtYmVyT2ZEaWNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBpc0Ryb3BwZWRXZWFwb24ocm9sbDogUm9sbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKHJvbGwubnVtYmVyT2ZEaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsLnRvdGFsID09IDE3KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKChyb2xsLnRvdGFsID09IDIxKSB8fCAocm9sbC50b3RhbCA9PSAyMikpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJ1bnN1cHBvcnRlZCBudW1iZXIgb2YgZGljZTogXCIgKyByb2xsLm51bWJlck9mRGljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCcm9rZW5XZWFwb24ocm9sbDogUm9sbCkge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICBzd2l0Y2ggKHJvbGwubnVtYmVyT2ZEaWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IChyb2xsLnRvdGFsID09IDE4KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gKChyb2xsLnRvdGFsID09IDIzKSB8fCAocm9sbC50b3RhbCA9PSAyNCkpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJ1bnN1cHBvcnRlZCBudW1iZXIgb2YgZGljZTogXCIgKyByb2xsLm51bWJlck9mRGljZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBjcmVhdGVIZXJvZXNNYXAoKSB7XHJcbiAgICAgICAgLy8gaGVyb1NldC5wdXQobmV3IEhlcm8oXCIwMDE6U1Q4O0RYMTY7REFHR0VSO05PX0FSTU9SO1NNQUxMX1NISUVMRFwiLCA4LCAxNiwgV2VhcG9uLkRBR0dFUiwgQXJtb3IuTk9fQVJNT1IsIFNoaWVsZC5TTUFMTF9TSElFTEQpLCBuZXcgSW50ZWdlcigwKSk7XHJcbiAgICAgICAgbGV0IGgxO1xyXG4gICAgICAgIGNvbnN0IGhlcm9lc0xpc3RKU09OID0gSGVyb2VzU2luZ2xldG9uLmdldEhlcm9lc0xpc3RKU09OKCk7XHJcbiAgICAgICAgbGV0IGhlcm9KU09OID0gbnVsbDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlcm9lc0xpc3RKU09OLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGhlcm9KU09OID0gaGVyb2VzTGlzdEpTT05baV07XHJcbiAgICAgICAgICAgIGgxID0gbmV3IEhlcm8oSGVyb2VzU2luZ2xldG9uLmdldE5hbWVGcm9tSUQoaGVyb0pTT04uaWQpLCBoZXJvSlNPTi5zdCwgaGVyb0pTT04uZHgsIGhlcm9KU09OLndlYXBvbiwgaGVyb0pTT04uYXJtb3IsIGhlcm9KU09OLnNoaWVsZCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5wdXRIZXJvKGgxKTtcclxuICAgICAgICAgICAgdGhpcy5oZXJvTWFwLnNldChoMS5uYW1lLCBoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIGRpc3BsYXlIZXJvZXNNYXAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coT2JqZWN0LmtleXMoQm91dC5oZXJvTWFwKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHN0YXRpYyBnZXRIZXJvTWFwKCkge1xyXG4gICAgICAgIHJldHVybiBCb3V0Lmhlcm9NYXA7XHJcbiAgICB9O1xyXG5cclxufVxyXG5cclxuIiwiaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGwoKSB7XHJcbiAgICBjb25zdCByb2xsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNiArIDEpO1xyXG4gICAgbG9nKGBEaWUgcm9sbDogJHtyb2xsfWApO1xyXG4gICAgcmV0dXJuIHJvbGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsRGljZShudW1EaWNlOiBudW1iZXIpIHtcclxuICAgIGxldCByZXN1bHQgPSAwO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1EaWNlOyBpKyspIHtcclxuICAgICAgICByZXN1bHQgKz0gcm9sbCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJvbGxUaHJlZURpY2UoKSB7XHJcbiAgICByZXR1cm4gcm9sbERpY2UoMyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByb2xsRm91ckRpY2UoKSB7XHJcbiAgICByZXR1cm4gcm9sbERpY2UoNCk7XHJcbn0iLCJpbXBvcnQgeyBXZWFwb24gfSBmcm9tIFwiLi93ZWFwb25cIjtcclxuaW1wb3J0IHsgU2hpZWxkIH0gZnJvbSBcIi4vc2hpZWxkXCI7XHJcbmltcG9ydCB7IEFybW9yIH0gZnJvbSBcIi4vYXJtb3JcIjtcclxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEhlcm8ge1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgY3VycmVudElkID0gMDtcclxuICAgIHByaXZhdGUgX2lkOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9uYW1lOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9zdDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZHg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX21hOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF93ZWFwb246IFdlYXBvbjtcclxuICAgIHByaXZhdGUgX3JlYWRpZWRXZWFwb246IFdlYXBvbjtcclxuICAgIHByaXZhdGUgX2FybW9yOiBBcm1vcjtcclxuICAgIHByaXZhdGUgX3NoaWVsZDogU2hpZWxkO1xyXG4gICAgcHJpdmF0ZSBfa25vY2tlZERvd246IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9zdGFuZGluZ1VwOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcGlja2luZ1VwV2VhcG9uOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfZHJvcHBlZFdlYXBvbjogV2VhcG9uO1xyXG4gICAgcHJpdmF0ZSBfZGFtYWdlVGFrZW46IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2RhbWFnZVRha2VuVGhpc1JvdW5kOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9pbmp1cnlEZXhQZW5hbHR5OiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcmVjb3ZlcmluZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2RlZmVuZGluZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2NoYXJnaW5nOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3Q6IG51bWJlciwgZHg6IG51bWJlciwgd2VhcG9uOiBXZWFwb24sIGFybW9yOiBBcm1vciwgc2hpZWxkOiBTaGllbGQpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IEhlcm8uY3VycmVudElkKys7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5fc3QgPSBzdDtcclxuICAgICAgICB0aGlzLl9keCA9IGR4O1xyXG4gICAgICAgIHRoaXMuX21hID0gMTA7IC8vIGhhcmQtY29kZWQgZm9yIGh1bWFuc1xyXG4gICAgICAgIHRoaXMuX3JlYWRpZWRXZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgdGhpcy5fYXJtb3IgPSBhcm1vcjtcclxuICAgICAgICB0aGlzLl9zaGllbGQgPSBzaGllbGQ7XHJcbiAgICAgICAgdGhpcy5fa25vY2tlZERvd24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zdGFuZGluZ1VwID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcGlja2luZ1VwV2VhcG9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fd2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHRoaXMuX2Ryb3BwZWRXZWFwb24gPSBXZWFwb24uTk9ORTtcclxuXHJcbiAgICAgICAgdGhpcy5fZGFtYWdlVGFrZW4gPSAwO1xyXG4gICAgICAgIHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kID0gMDtcclxuICAgICAgICB0aGlzLl9pbmp1cnlEZXhQZW5hbHR5ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVjb3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2RlZmVuZGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2NoYXJnaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBpZCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHN0KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0O1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFkalNUKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4sIDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1hKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFkanVzdGVkTUEoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWEgLSB0aGlzLl9hcm1vci5tYUFkajtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBkeCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9keDtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBhZGp1c3RlZER4KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2R4IC0gdGhpcy5fYXJtb3IuZHhBZGogLSB0aGlzLl9zaGllbGQuZHhBZGogLSAodGhpcy5faW5qdXJ5RGV4UGVuYWx0eSA/IDIgOiAwKSAtICh0aGlzLmlzU3RyZW5ndGhMb3dQZW5hbHR5ID8gMyA6IDApO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGRhbWFnZVRha2VuVGhpc1JvdW5kKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGlzQWxpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9zdCAtIHRoaXMuX2RhbWFnZVRha2VuID4gMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNDb25zY2lvdXMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLl9zdCAtIHRoaXMuX2RhbWFnZVRha2VuID4gMSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNLbm9ja2VkRG93bigpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fa25vY2tlZERvd247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzdGFuZFVwKCkge1xyXG4gICAgICAgIHRoaXMuX3N0YW5kaW5nVXAgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZXNlIHJ1bGVzIG1heWJlIHNob3VsZCBnbyBpbnRvIEdhbWUgKGJldHRlciBjb2hlc2lvbilcclxuICAgICAqL1xyXG4gICAgcHVibGljIG5ld1JvdW5kKCkge1xyXG4gICAgICAgIHRoaXMuX2NoYXJnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZGVmZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGFuZGluZ1VwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2tub2NrZWREb3duID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YW5kaW5nVXAgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5fcGlja2luZ1VwV2VhcG9uKSAgLy8gdGVjaG5pY2FsbHkgXCJ3YXNcIiBwaWNraW5nIHVwIHdlYXBvbiBsYXN0IHJvdW5kXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWFkaWVkV2VhcG9uID0gdGhpcy5fZHJvcHBlZFdlYXBvbjtcclxuICAgICAgICAgICAgdGhpcy5fZHJvcHBlZFdlYXBvbiA9IFdlYXBvbi5OT05FO1xyXG4gICAgICAgICAgICB0aGlzLl9waWNraW5nVXBXZWFwb24gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogRGV4IHBlbmFsdHkgZHVlIHRvIGluanVyeSBsYXN0cyBvbmUgY29tcGxldGUgcm91bmRcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAodGhpcy5faW5qdXJ5RGV4UGVuYWx0eSAmJiB0aGlzLl9yZWNvdmVyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luanVyeURleFBlbmFsdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVjb3ZlcmluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLl9pbmp1cnlEZXhQZW5hbHR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlY292ZXJpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRha2VIaXRzKGhpdHM6IG51bWJlcikge1xyXG4gICAgICAgIHZhciBhcm1vclBvaW50cyA9IHRoaXMuX2FybW9yLmhpdHNTdG9wcGVkICsgdGhpcy5fc2hpZWxkLmhpdHNTdG9wcGVkO1xyXG4gICAgICAgIHZhciBkYW1hZ2VEb25lID0gaGl0cyAtIGFybW9yUG9pbnRzO1xyXG4gICAgICAgIGlmIChkYW1hZ2VEb25lIDwgMCkgZGFtYWdlRG9uZSA9IDA7XHJcblxyXG5cclxuICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIHRha2luZyBcIiArIGhpdHMgKyBcIiBoaXRzLlwiKTtcclxuICAgICAgICBsb2codGhpcy5fYXJtb3IubmFtZSArIFwiIHN0b3BzIFwiICsgdGhpcy5fYXJtb3IuaGl0c1N0b3BwZWQpO1xyXG4gICAgICAgIGxvZyh0aGlzLl9zaGllbGQubmFtZSArIFwiIHN0b3BzIFwiICsgdGhpcy5fc2hpZWxkLmhpdHNTdG9wcGVkKTtcclxuICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIHRha2luZyBcIiArIGRhbWFnZURvbmUgKyBcIiBkYW1hZ2UuXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnRha2VEYW1hZ2UoZGFtYWdlRG9uZSk7XHJcbiAgICAgICAgcmV0dXJuIGRhbWFnZURvbmU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWZ0ZXIgaXQncyBnb3QgcGFzdCBhcm1vciwgZXRjLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdGFrZURhbWFnZShkYW1hZ2VEb25lOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kYW1hZ2VUYWtlbiArPSBkYW1hZ2VEb25lO1xyXG4gICAgICAgIHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kICs9IGRhbWFnZURvbmU7XHJcbiAgICAgICAgdGhpcy5faW5qdXJ5RGV4UGVuYWx0eSA9IHRoaXMuc3VmZmVyaW5nRGV4UGVuYWx0eSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faW5qdXJ5RGV4UGVuYWx0eSkgbG9nKHRoaXMuX25hbWUgKyBcIiBoYXMgYW4gYWRqRHggcGVuYWx0eSBvZiAtMiBmb3IgcmVtYWluZGVyIG9mIHRoaXMgcm91bmQgYW5kIHRoZSBORVhUIHJvdW5kLlwiKTtcclxuICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIGhhcyBub3cgdGFrZW4gXCIgKyB0aGlzLl9kYW1hZ2VUYWtlbiArIFwiIHBvaW50cyBvZiBkYW1hZ2UsIFNUID0gXCIgKyB0aGlzLl9zdCArICh0aGlzLl9kYW1hZ2VUYWtlbiA+PSB0aGlzLl9zdCA/IFwiIGFuZCBpcyBERUFELlwiIDogKHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4gPT09IDEgPyBcIiBhbmQgaXMgVU5DT05TQ0lPVVMuXCIgOiBcIi5cIikpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2RhbWFnZVRha2VuVGhpc1JvdW5kID49IDgpIHtcclxuICAgICAgICAgICAgdGhpcy5fa25vY2tlZERvd24gPSB0cnVlO1xyXG4gICAgICAgICAgICBsb2codGhpcy5fbmFtZSArIFwiIGhhcyBiZWVuIGtub2NrZWQgZG93biBieSBkYW1hZ2UuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pc1N0cmVuZ3RoTG93UGVuYWx0eSkgbG9nKHRoaXMuX25hbWUgKyBcIiBoYXMgYW4gYWRkaXRpb25hbCBEWCBhZGp1c3RtZW50IG9mIC0zIGR1ZSB0byBTVCA8PSAzLlwiKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzdWZmZXJpbmdEZXhQZW5hbHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5fZGFtYWdlVGFrZW5UaGlzUm91bmQgPj0gNSB8fCB0aGlzLl9yZWNvdmVyaW5nKTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc1N0cmVuZ3RoTG93UGVuYWx0eSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX3N0IC0gdGhpcy5fZGFtYWdlVGFrZW4gPD0gMyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZXREZWZlbmRpbmcoKSB7XHJcbiAgICAgICAgdGhpcy5fZGVmZW5kaW5nID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGlzRGVmZW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZWZlbmRpbmc7XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBzZXRDaGFyZ2luZyhpc0NoYXJnaW5nOiBib29sZWFuKSB7XHJcbiAgICAgICAgLy8gICAgICAgIGxvZyhcIkhlcm86IHNldENoYXJnZSB0byBcIiArIGlzQ2hhcmdpbmcpO1xyXG4gICAgICAgIHRoaXMuX2NoYXJnaW5nID0gaXNDaGFyZ2luZztcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc0NoYXJnaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGFyZ2luZztcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBpc1Byb25lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9waWNraW5nVXBXZWFwb247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgaXNQaWNraW5nVXBXZWFwb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpY2tpbmdVcFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCB3ZWFwb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHNldCB3ZWFwb24od2VhcG9uOiBXZWFwb24pIHtcclxuICAgICAgICB0aGlzLl93ZWFwb24gPSB3ZWFwb247XHJcbiAgICB9O1xyXG5cclxuICAgIHB1YmxpYyBnZXQgcmVhZGllZFdlYXBvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZGllZFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGRyb3BXZWFwb24oKSB7XHJcbiAgICAgICAgdGhpcy5fZHJvcHBlZFdlYXBvbiA9IHRoaXMuX3JlYWRpZWRXZWFwb247XHJcbiAgICAgICAgdGhpcy5fcmVhZGllZFdlYXBvbiA9IFdlYXBvbi5OT05FO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgYnJlYWtXZWFwb24oKSB7XHJcbiAgICAgICAgdGhpcy5fcmVhZGllZFdlYXBvbiA9IFdlYXBvbi5OT05FO1xyXG4gICAgICAgIHRoaXMuX2Ryb3BwZWRXZWFwb24gPSBXZWFwb24uTk9ORTsgLy8gc2hvdWxkbid0IG5lZWQgdGhpcywgYnV0IGp1c3QgaW4gY2FzZVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0RHJvcHBlZFdlYXBvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZHJvcHBlZFdlYXBvbjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHBpY2tVcFdlYXBvbigpIHtcclxuICAgICAgICB0aGlzLl9waWNraW5nVXBXZWFwb24gPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFybW9yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcm1vcjtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHNldCBhcm1vcihhcm1vcjogQXJtb3IpIHtcclxuICAgICAgICB0aGlzLl9hcm1vciA9IGFybW9yO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGFybW9yUG9pbnRzKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FybW9yLmhpdHNTdG9wcGVkICsgdGhpcy5fc2hpZWxkLmhpdHNTdG9wcGVkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IGdldFNoaWVsZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hpZWxkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuX25hbWV9OlNUJHt0aGlzLl9zdH07RFgke3RoaXMuX2R4fTske3RoaXMuX3dlYXBvbi5uYW1lfTske3RoaXMuX2FybW9yLm5hbWV9OyR7dGhpcy5fc2hpZWxkLm5hbWV9YDtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIGdldCBjYW5Eb0RhbWFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc0NvbnNjaW91cyAmJiAodGhpcy5fcmVhZGllZFdlYXBvbiAhPT0gV2VhcG9uLk5PTkUgfHwgdGhpcy5fZHJvcHBlZFdlYXBvbiAhPT0gV2VhcG9uLk5PTkUpXHJcbiAgICB9O1xyXG5cclxufVxyXG5cclxuIiwiaW1wb3J0IHsgV2VhcG9uIH0gZnJvbSBcIi4vd2VhcG9uXCI7XHJcbmltcG9ydCB7IEFybW9yIH0gZnJvbSBcIi4vYXJtb3JcIjtcclxuaW1wb3J0IHsgU2hpZWxkIH0gZnJvbSBcIi4vc2hpZWxkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEhlcm9EZXNjcmlwdGlvbiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgc3Q6IG51bWJlcjtcclxuICAgIGR4OiBudW1iZXI7XHJcbiAgICB3ZWFwb246IFdlYXBvbjtcclxuICAgIGFybW9yOiBBcm1vcjtcclxuICAgIHNoaWVsZDogU2hpZWxkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSGVyb2VzU2luZ2xldG9uIHtcclxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk3NTM4NDEvMTE2ODM0MlxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbGlzdEhlaWdodCA9IDE1O1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaGVyb2VzTGlzdEpTT046IEFycmF5PEhlcm9EZXNjcmlwdGlvbj4gPVxyXG4gICAgICAgIFtcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDAxXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDJcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDAzXCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDRcIiwgXCJzdFwiOiA4LCBcImR4XCI6IDE2LCBcIndlYXBvblwiOiBXZWFwb24uREFHR0VSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwNVwiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA2XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAwN1wiLCBcInN0XCI6IDgsIFwiZHhcIjogMTYsIFwid2VhcG9uXCI6IFdlYXBvbi5EQUdHRVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDA4XCIsIFwic3RcIjogOCwgXCJkeFwiOiAxNiwgXCJ3ZWFwb25cIjogV2VhcG9uLkRBR0dFUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMDlcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxMFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTFcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxMlwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5SQVBJRVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDEzXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTRcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE1XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLlJBUElFUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMTZcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uUkFQSUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxN1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAxOFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5DTFVCLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDE5XCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIwXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIxXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDIyXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkNMVUIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjNcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjRcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uQ0xVQiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjVcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMjZcIiwgXCJzdFwiOiA5LCBcImR4XCI6IDE1LCBcIndlYXBvblwiOiBXZWFwb24uSkFWRUxJTiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyN1wiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyOFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAyOVwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzMFwiLCBcInN0XCI6IDksIFwiZHhcIjogMTUsIFwid2VhcG9uXCI6IFdlYXBvbi5KQVZFTElOLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMxXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMyXCIsIFwic3RcIjogOSwgXCJkeFwiOiAxNSwgXCJ3ZWFwb25cIjogV2VhcG9uLkpBVkVMSU4sIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDMzXCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDM0XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5IQU1NRVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzVcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzZcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzdcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwMzhcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTU1FUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjAzOVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0MFwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uSEFNTUVSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0MVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDJcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDNcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ0XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0NVwiLCBcInN0XCI6IDEwLCBcImR4XCI6IDE0LCBcIndlYXBvblwiOiBXZWFwb24uQ1VUTEFTUywgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDZcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNDdcIiwgXCJzdFwiOiAxMCwgXCJkeFwiOiAxNCwgXCJ3ZWFwb25cIjogV2VhcG9uLkNVVExBU1MsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDQ4XCIsIFwic3RcIjogMTAsIFwiZHhcIjogMTQsIFwid2VhcG9uXCI6IFdlYXBvbi5DVVRMQVNTLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA0OVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTBcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTFcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDUyXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1M1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU0hPUlRTV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTRcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTVcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLlNIT1JUU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDU2XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TSE9SVFNXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA1N1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNThcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNTlcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDYwXCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2MVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uTUFDRSwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjJcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjNcIiwgXCJzdFwiOiAxMSwgXCJkeFwiOiAxMywgXCJ3ZWFwb25cIjogV2VhcG9uLk1BQ0UsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY0XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5NQUNFLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2NVwiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY2XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA2N1wiLCBcInN0XCI6IDExLCBcImR4XCI6IDEzLCBcIndlYXBvblwiOiBXZWFwb24uU1BFQVIsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDY4XCIsIFwic3RcIjogMTEsIFwiZHhcIjogMTMsIFwid2VhcG9uXCI6IFdlYXBvbi5TUEVBUiwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNjlcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDcwXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDcxXCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3MlwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzNcIiwgXCJzdFwiOiAxMiwgXCJkeFwiOiAxMiwgXCJ3ZWFwb25cIjogV2VhcG9uLkJST0FEU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc0XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDc1XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3NlwiLCBcInN0XCI6IDEyLCBcImR4XCI6IDEyLCBcIndlYXBvblwiOiBXZWFwb24uQlJPQURTV09SRCwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzdcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA3OFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLlNNQUxMX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwNzlcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4MFwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uTU9STklOR1NUQVIsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5TTUFMTF9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgxXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODJcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5MQVJHRV9TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDgzXCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5NT1JOSU5HU1RBUiwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLkxBUkdFX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODRcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLk1PUk5JTkdTVEFSLCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTEFSR0VfU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4NVwiLCBcInN0XCI6IDEzLCBcImR4XCI6IDExLCBcIndlYXBvblwiOiBXZWFwb24uSEFMQkVSRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODZcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwODdcIiwgXCJzdFwiOiAxMywgXCJkeFwiOiAxMSwgXCJ3ZWFwb25cIjogV2VhcG9uLkhBTEJFUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDg4XCIsIFwic3RcIjogMTMsIFwiZHhcIjogMTEsIFwid2VhcG9uXCI6IFdlYXBvbi5IQUxCRVJELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA4OVwiLCBcInN0XCI6IDE0LCBcImR4XCI6IDEwLCBcIndlYXBvblwiOiBXZWFwb24uVFdPX0hBTkRFRF9TV09SRCwgXCJhcm1vclwiOiBBcm1vci5OT19BUk1PUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTBcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTFcIiwgXCJzdFwiOiAxNCwgXCJkeFwiOiAxMCwgXCJ3ZWFwb25cIjogV2VhcG9uLlRXT19IQU5ERURfU1dPUkQsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDkyXCIsIFwic3RcIjogMTQsIFwiZHhcIjogMTAsIFwid2VhcG9uXCI6IFdlYXBvbi5UV09fSEFOREVEX1NXT1JELCBcImFybW9yXCI6IEFybW9yLlBMQVRFLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5M1wiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk0XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjA5NVwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuQ0hBSU4sIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk2XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLkJBVFRMRUFYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIwOTdcIiwgXCJzdFwiOiAxNSwgXCJkeFwiOiA5LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuTk9fQVJNT1IsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk4XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkxFQVRIRVIsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMDk5XCIsIFwic3RcIjogMTUsIFwiZHhcIjogOSwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwMFwiLCBcInN0XCI6IDE1LCBcImR4XCI6IDksIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5QTEFURSwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDFcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwMlwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuTEVBVEhFUiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDNcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uQkFUVExFQVhFLCBcImFybW9yXCI6IEFybW9yLkNIQUlOLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwNFwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5CQVRUTEVBWEUsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfSxcclxuICAgICAgICAgICAgeyBcImlkXCI6IFwiMTA1XCIsIFwic3RcIjogMTYsIFwiZHhcIjogOCwgXCJ3ZWFwb25cIjogV2VhcG9uLlBJS0VfQVhFLCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwNlwiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5MRUFUSEVSLCBcInNoaWVsZFwiOiBTaGllbGQuTk9fU0hJRUxEIH0sXHJcbiAgICAgICAgICAgIHsgXCJpZFwiOiBcIjEwN1wiLCBcInN0XCI6IDE2LCBcImR4XCI6IDgsIFwid2VhcG9uXCI6IFdlYXBvbi5QSUtFX0FYRSwgXCJhcm1vclwiOiBBcm1vci5DSEFJTiwgXCJzaGllbGRcIjogU2hpZWxkLk5PX1NISUVMRCB9LFxyXG4gICAgICAgICAgICB7IFwiaWRcIjogXCIxMDhcIiwgXCJzdFwiOiAxNiwgXCJkeFwiOiA4LCBcIndlYXBvblwiOiBXZWFwb24uUElLRV9BWEUsIFwiYXJtb3JcIjogQXJtb3IuUExBVEUsIFwic2hpZWxkXCI6IFNoaWVsZC5OT19TSElFTEQgfVxyXG4gICAgICAgIF07XHJcbiAgICBzdGF0aWMgZ2V0SGVyb2VzTGlzdEpTT04oKSB7XHJcbiAgICAgICAgcmV0dXJuIEhlcm9lc1NpbmdsZXRvbi5oZXJvZXNMaXN0SlNPTjtcclxuICAgIH07XHJcbiAgICBzdGF0aWMgZ2V0TGlzdEhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gSGVyb2VzU2luZ2xldG9uLmxpc3RIZWlnaHQ7XHJcbiAgICB9O1xyXG4gICAgc3RhdGljIGdldE5hbWVGcm9tSUQoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGhlcm8gPSB0aGlzLmhlcm9lc0xpc3RKU09OLmZpbmQoaGVybyA9PiBoZXJvLmlkID09IGlkKTtcclxuICAgICAgICBjb25zdCBuYW1lID0gaGVybyA/IGAke2hlcm8uaWR9OlNUJHtoZXJvLnN0fTtEWCR7aGVyby5keH07JHtoZXJvLndlYXBvbi5uYW1lfTske2hlcm8uYXJtb3IubmFtZX07JHtoZXJvLnNoaWVsZC5uYW1lfWAudG9VcHBlckNhc2UoKS5yZXBsYWNlKC9bIC1dL2csICdfJykgOiBgKGhlcm8gaWQgJHtpZH0gbm90IGZvdW5kKWA7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0TXlybWlkb24oKTogSGVyb0Rlc2NyaXB0aW9uIHtcclxuICAgICAgICByZXR1cm4geyBcImlkXCI6IFwiMDY5XCIsIFwic3RcIjogMTIsIFwiZHhcIjogMTIsIFwid2VhcG9uXCI6IFdlYXBvbi5CUk9BRFNXT1JELCBcImFybW9yXCI6IEFybW9yLk5PX0FSTU9SLCBcInNoaWVsZFwiOiBTaGllbGQuU01BTExfU0hJRUxEIH07XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgcm9sbCB9IGZyb20gXCIuL2RpZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJvbGwge1xyXG4gICAgcHJpdmF0ZSBfcm9sbHM6IG51bWJlcltdO1xyXG4gICAgY29uc3RydWN0b3IobnVtYmVyT2ZEaWNlOiBudW1iZXIsIHByaXZhdGUgX21vZGlmaWVyPzogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fcm9sbHMgPSBSb2xsLnJvbGxlZChudW1iZXJPZkRpY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgcm9sbHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvbGxzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgcm9sbHMocm9sbHM6IG51bWJlcltdKSB7XHJcbiAgICAgICAgdGhpcy5fcm9sbHMgPSByb2xscztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG1vZGlmaWVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RpZmllcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IG51bWJlck9mRGljZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9sbHMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgdG90YWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvbGxzLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpICsgKHRoaXMuX21vZGlmaWVyIHx8IDApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcm9sbGVkKG46IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHJvbGxzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBuOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHJvbGxzLnB1c2gocm9sbCgpKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcm9sbHM7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGNsYXNzIFNoaWVsZCB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBoaXRzU3RvcHBlZDogbnVtYmVyO1xyXG4gICAgZHhBZGo6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaGl0c1N0b3BwZWQ6IG51bWJlciwgZHhBZGo6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmhpdHNTdG9wcGVkID0gaGl0c1N0b3BwZWQ7XHJcbiAgICAgICAgdGhpcy5keEFkaiA9IGR4QWRqO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIE5PX1NISUVMRCA9IG5ldyBTaGllbGQoXCJObyBzaGllbGRcIiwgMCwgMCk7XHJcbiAgICBzdGF0aWMgU01BTExfU0hJRUxEID0gbmV3IFNoaWVsZChcIlNtYWxsIHNoaWVsZFwiLCAxLCAwKTtcclxuICAgIHN0YXRpYyBMQVJHRV9TSElFTEQgPSBuZXcgU2hpZWxkKFwiTGFyZ2Ugc2hpZWxkXCIsIDIsIDEpO1xyXG59XHJcbiIsImltcG9ydCB7IGxvZyB9IGZyb20gXCIuLi9sb2dnZXJcIjtcclxuaW1wb3J0IHsgUm9sbCB9IGZyb20gXCIuLi9tZWxlZS9yb2xsXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgV2VhcG9uIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHN0OiBudW1iZXI7XHJcbiAgICBkaWNlOiBudW1iZXI7XHJcbiAgICBtb2RpZmllcjogbnVtYmVyO1xyXG4gICAgaXNUd29IYW5kZWQ6IGJvb2xlYW47XHJcbiAgICBpc1Rocm93bjogYm9vbGVhbjtcclxuICAgIGlzUG9sZTogYm9vbGVhbjtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3Q6IG51bWJlcixcclxuICAgICAgICBkaWNlOiBudW1iZXIsXHJcbiAgICAgICAgbW9kaWZpZXI6IG51bWJlcixcclxuICAgICAgICBpc1R3b0hhbmRlZDogYm9vbGVhbixcclxuICAgICAgICBpc1Rocm93bjogYm9vbGVhbixcclxuICAgICAgICBpc1BvbGU6IGJvb2xlYW4sXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3QgPSBzdDtcclxuICAgICAgICB0aGlzLmRpY2UgPSBkaWNlO1xyXG4gICAgICAgIHRoaXMubW9kaWZpZXIgPSBtb2RpZmllcjtcclxuICAgICAgICB0aGlzLmlzVHdvSGFuZGVkID0gaXNUd29IYW5kZWQ7XHJcbiAgICAgICAgdGhpcy5pc1BvbGUgPSBpc1BvbGU7XHJcbiAgICAgICAgdGhpcy5pc1Rocm93biA9IGlzVGhyb3duO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkb0RhbWFnZSgpIHtcclxuICAgICAgICBsb2coXHJcbiAgICAgICAgICAgIFwiUm9sbGluZyBmb3Igd2VhcG9uIGRvaW5nIFwiXHJcbiAgICAgICAgICAgICsgdGhpcy5kaWNlXHJcbiAgICAgICAgICAgICsgXCJkXCJcclxuICAgICAgICAgICAgKyAoKHRoaXMubW9kaWZpZXIgPiAwKSA/IFwiK1wiIDogXCJcIilcclxuICAgICAgICAgICAgKyAoKHRoaXMubW9kaWZpZXIgIT09IDApID8gdGhpcy5tb2RpZmllciA6IFwiXCIpXHJcbiAgICAgICAgICAgICsgXCIgZGFtYWdlLlwiKTtcclxuICAgICAgICBsZXQgZGFtYWdlID0gbmV3IFJvbGwodGhpcy5kaWNlLCB0aGlzLm1vZGlmaWVyKS50b3RhbDtcclxuICAgICAgICBpZiAodGhpcy5tb2RpZmllciAhPT0gMCkgbG9nKCgodGhpcy5tb2RpZmllciA+IDApID8gXCIrXCIgOiBcIlwiKSArIHRoaXMubW9kaWZpZXIpO1xyXG4gICAgICAgIGlmIChkYW1hZ2UgPCAwKSBkYW1hZ2UgPSAwO1xyXG4gICAgICAgIGxvZyhgVG90YWwgd2VhcG9uIGRhbWFnZTogJHtkYW1hZ2V9YCk7XHJcbiAgICAgICAgcmV0dXJuIGRhbWFnZTtcclxuICAgIH07XHJcblxyXG4gICAgcHVibGljIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWUgKyBcIiAoXCIgKyB0aGlzLmRpY2UgKyBcIkRcIiArICgodGhpcy5tb2RpZmllciA+IDApID8gXCIrXCIgOiBcIlwiKSArICgodGhpcy5tb2RpZmllciAhPT0gMCkgPyB0aGlzLm1vZGlmaWVyIDogXCJcIikgKyBcIilcIjtcclxuICAgIH07XHJcblxyXG4gICAgc3RhdGljIE5PTkUgPSBuZXcgV2VhcG9uKFwiTm9uZVwiLCAwLCAwLCAwLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBEQUdHRVIgPSBuZXcgV2VhcG9uKFwiRGFnZ2VyXCIsIDAsIDEsIC0xLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFJBUElFUiA9IG5ldyBXZWFwb24oXCJSYXBpZXJcIiwgOSwgMSwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQ0xVQiA9IG5ldyBXZWFwb24oXCJDbHViXCIsIDksIDEsIDAsIHRydWUsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgSEFNTUVSID0gbmV3IFdlYXBvbihcIkhhbW1lclwiLCAxMCwgMSwgMSwgdHJ1ZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBDVVRMQVNTID0gbmV3IFdlYXBvbihcIkN1dGxhc3NcIiwgMTAsIDIsIC0yLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBTSE9SVFNXT1JEID0gbmV3IFdlYXBvbihcIlNob3J0c3dvcmRcIiwgMTEsIDIsIC0xLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcclxuICAgIHN0YXRpYyBNQUNFID0gbmV3IFdlYXBvbihcIk1hY2VcIiwgMTEsIDIsIC0xLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFNNQUxMX0FYID0gbmV3IFdlYXBvbihcIlNtYWxsIGF4XCIsIDExLCAxLCAyLCB0cnVlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIEJST0FEU1dPUkQgPSBuZXcgV2VhcG9uKFwiQnJvYWRzd29yZFwiLCAxMiwgMiwgMCwgZmFsc2UsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgTU9STklOR1NUQVIgPSBuZXcgV2VhcG9uKFwiTW9ybmluZ3N0YXJcIiwgMTMsIDIsIDEsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgc3RhdGljIFRXT19IQU5ERURfU1dPUkQgPSBuZXcgV2VhcG9uKFwiVHdvLWhhbmRlZCBzd29yZFwiLCAxNCwgMywgLTEsIGZhbHNlLCB0cnVlLCBmYWxzZSk7XHJcbiAgICBzdGF0aWMgQkFUVExFQVhFID0gbmV3IFdlYXBvbihcIkJhdHRsZWF4ZVwiLCAxNSwgMywgMCwgZmFsc2UsIHRydWUsIGZhbHNlKTtcclxuXHJcbiAgICAvLyBwb2xlIHdlYXBvbnNcclxuICAgIHN0YXRpYyBKQVZFTElOID0gbmV3IFdlYXBvbihcIkphdmVsaW5cIiwgOSwgMSwgLTEsIHRydWUsIGZhbHNlLCB0cnVlKTtcclxuICAgIHN0YXRpYyBTUEVBUiA9IG5ldyBXZWFwb24oXCJTcGVhclwiLCAxMSwgMSwgMSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICBzdGF0aWMgSEFMQkVSRCA9IG5ldyBXZWFwb24oXCJIYWxiZXJkXCIsIDEzLCAyLCAtMSwgZmFsc2UsIHRydWUsIHRydWUpO1xyXG4gICAgc3RhdGljIFBJS0VfQVhFID0gbmV3IFdlYXBvbihcIlBpa2UgYXhlXCIsIDE1LCAyLCAyLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7ICAgIC8vIEFuZCBub3cgcmV0dXJuIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvblxyXG5cclxufVxyXG5cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7IEJvdXQgfSBmcm9tIFwiLi4vbWVsZWUvYm91dFwiO1xyXG5pbXBvcnQgeyBIZXJvIH0gZnJvbSBcIi4uL21lbGVlL2hlcm9cIjtcclxuaW1wb3J0IHsgbG9nLCBzZXRNdXRlIH0gZnJvbSBcIi4uL2xvZ2dlclwiO1xyXG5pbXBvcnQgeyBIZXJvZXNTaW5nbGV0b24gfSBmcm9tIFwiLi4vbWVsZWUvaGVyb2VzU2luZ2xldG9uXCI7XHJcblxyXG5jb25zdCBjdHg6IFdvcmtlciA9IHNlbGYgYXMgYW55O1xyXG5cclxubGV0IHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCA9IGZhbHNlO1xyXG5sZXQgZGVmZW5kVnNQb2xlQ2hhcmdlID0gZmFsc2U7XHJcblxyXG5jdHguYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldmVudDogYW55KSB7XHJcbiAgICAvKipcclxuICAgICAqIHBhcnNlIHRoZSBtZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhO1xyXG4gICAgY29uc29sZS5sb2coYFdvcmtlcjogZ290IG1lc3NhZ2UgJHtkYXRhLmNtZH1gKTtcclxuICAgIHN3aXRjaCAoZGF0YS5jbWQpIHtcclxuICAgICAgICBjYXNlIFwid2FrZSB1cFwiOlxyXG4gICAgICAgICAgICBjdHgucG9zdE1lc3NhZ2UoeyBcImNtZFwiOiBcIndvcmtlciB3YWl0aW5nXCIgfSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zdCBoZXJvU2V0ID0gbmV3IEFycmF5PEhlcm8+KCk7ICAvLyBsaXN0IG9mIGhlcm9lcyB0byBmaWdodFxyXG5cclxuICAgICAgICAgICAgQm91dC5jcmVhdGVIZXJvZXNNYXAoKTtcclxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlSGVyb01hcCA9IEJvdXQuZ2V0SGVyb01hcCgpO1xyXG4gICAgICAgICAgICBkYXRhLnNlbGVjdGVkSGVyb2VzLmZvckVhY2goZnVuY3Rpb24gKGhlcm9JRDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaGVybyA9IGNvbXBsZXRlSGVyb01hcC5nZXQoSGVyb2VzU2luZ2xldG9uLmdldE5hbWVGcm9tSUQoaGVyb0lEKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaGVybykgaGVyb1NldC5wdXNoKGhlcm8pOyBlbHNlIGNvbnNvbGUubG9nKGAgICEhISBEaWRuJ3QgZmluZCAke0hlcm9lc1NpbmdsZXRvbi5nZXROYW1lRnJvbUlEKGhlcm9JRCl9ICgke2hlcm9JRH0pIGluIG1hcCAhISFgKTtcclxuICAgICAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ29uZmlndXJlIHNpbXVsYXRvciBvcHRpb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzZXRNdXRlKCFkYXRhLmlzVmVyYm9zZSk7XHJcbiAgICAgICAgICAgIHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCA9IGRhdGEuaXNQb2xlV2VhcG9uc0NoYXJnZUZpcnN0Um91bmQ7XHJcbiAgICAgICAgICAgIGRlZmVuZFZzUG9sZUNoYXJnZSA9IGRhdGEuaXNEZWZlbmRWc1BvbGVDaGFyZ2U7XHJcblxyXG4gICAgICAgICAgICB0cnlBbGxDb21iaW5hdGlvbnMoaGVyb1NldCwgZGF0YS5ib3V0Q291bnQpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiB0cnlBbGxDb21iaW5hdGlvbnMoaGVyb1NldDogQXJyYXk8SGVybz4sIGJvdXRDb3VudDogbnVtYmVyKSB7XHJcbiAgICBsZXQgbWF0Y2h1cFdpbnM6IHsgW2luZGV4OiBzdHJpbmddOiBudW1iZXIgfSA9IHt9OyAgLy8gbWFwIG9mIGhlcm8gYW5kIGludGVnZXJcclxuICAgIGxldCBoZXJvV2luczogeyBbaW5kZXg6IHN0cmluZ106IG51bWJlciB9ID0ge307XHJcbiAgICBsZXQgZ2FtZSA9IG51bGw7XHJcbiAgICBsZXQgc2NvcmUgPSBbMl07XHJcbiAgICBsZXQgcHJvZ3Jlc3MgPSAwO1xyXG4gICAgLy8gaG93IG1hbnkgYm91dHMgdG90YWwgaXMgTiAqIE4tMSAqIGJvdXRDb3VudFxyXG4gICAgbGV0IHRvdGFsSXRlcmF0aW9ucyA9IGhlcm9TZXQubGVuZ3RoICogKGhlcm9TZXQubGVuZ3RoIC0gMSkgKiBib3V0Q291bnQgLyAyO1xyXG4gICAgbGV0IGl0ZXJhdGlvbkNvdW50ID0gMDtcclxuICAgIGhlcm9TZXQuZm9yRWFjaChmdW5jdGlvbiAoaGVybzEpIHtcclxuICAgICAgICBoZXJvV2luc1toZXJvMS5uYW1lXSA9IDA7XHJcbiAgICAgICAgaGVyb1NldC5mb3JFYWNoKGhlcm8yID0+IHtcclxuICAgICAgICAgICAgaWYgKGhlcm8xICE9PSBoZXJvMikgbWF0Y2h1cFdpbnNbaGVybzEubmFtZSArIFwiL1wiICsgaGVybzIubmFtZV0gPSAwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgICBsZXQgbGFzdFVwZGF0ZVRpbWUgPSBuZXcgRGF0ZSgpOyAvLyBmb3IgdGhyb3R0bGluZyB1cGRhdGVzXHJcblxyXG4gICAgZm9yIChsZXQgaDEgPSAwOyBoMSA8IGhlcm9TZXQubGVuZ3RoOyBoMSsrKSB7XHJcbiAgICAgICAgbGV0IGhlcm8xID0gaGVyb1NldFtoMV07XHJcbiAgICAgICAgbGV0IGgyID0gMDtcclxuICAgICAgICBsZXQgaGVybzIgPSBoZXJvU2V0W2gyXTtcclxuXHJcbiAgICAgICAgZm9yIChoMiA9IGgxICsgMTsgaDIgPCBoZXJvU2V0Lmxlbmd0aDsgaDIrKykge1xyXG4gICAgICAgICAgICBoZXJvMiA9IGhlcm9TZXRbaDJdO1xyXG4gICAgICAgICAgICBsZXQgc3VtUm91bmRzID0gMDtcclxuICAgICAgICAgICAgc2NvcmVbMF0gPSAwO1xyXG4gICAgICAgICAgICBzY29yZVsxXSA9IDA7XHJcbiAgICAgICAgICAgIGxvZygnTWF0Y2h1cDogJyArIGhlcm8xLm5hbWUgKyAnIHZzLiAnICsgaGVybzIubmFtZSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBib3V0ID0gMDsgYm91dCA8IGJvdXRDb3VudDsgYm91dCsrKSB7XHJcbiAgICAgICAgICAgICAgICBsb2coXCJCb3V0OiBcIiArIGJvdXQgKyAxICsgXCIgb2YgXCIgKyBib3V0Q291bnQpO1xyXG4gICAgICAgICAgICAgICAgaXRlcmF0aW9uQ291bnQrKztcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRG9uJ3QgcG9zdCB1cGRhdGVzIHRvbyBvZnRlblxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lLmdldFRpbWUoKSAtIGxhc3RVcGRhdGVUaW1lLmdldFRpbWUoKSA+IDUwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICAgICAqIHVwZGF0ZSBwcm9ncmVzcyBiYXIgb24gcGFnZSAoYXNzdW1lcyBtYXggaXMgMTAwMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgPSBNYXRoLmNlaWwoKGl0ZXJhdGlvbkNvdW50IC8gdG90YWxJdGVyYXRpb25zKSAqIDEwMCAqIDEwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnBvc3RNZXNzYWdlKHsgXCJjbWRcIjogXCJwcm9ncmVzc1VwZGF0ZVwiLCBcInByb2dyZXNzXCI6IHByb2dyZXNzIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVUaW1lID0gY3VycmVudFRpbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY2xvbmUgaGVyb2VzIChyZXNldHMgdGhlbSkgcHJpb3IgdG8gZmlnaHRpbmdcclxuICAgICAgICAgICAgICAgIGxldCBmaWdodGluZ0hlcm8xID0gT2JqZWN0LmNyZWF0ZShoZXJvMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgZmlnaHRpbmdIZXJvMiA9IE9iamVjdC5jcmVhdGUoaGVybzIpO1xyXG4gICAgICAgICAgICAgICAgZ2FtZSA9IG5ldyBCb3V0KGZpZ2h0aW5nSGVybzEsIGZpZ2h0aW5nSGVybzIsIHBvbGVXZWFwb25zQ2hhcmdlRmlyc3RSb3VuZCwgZGVmZW5kVnNQb2xlQ2hhcmdlKTtcclxuICAgICAgICAgICAgICAgIGxldCB3aW5uaW5nRmlnaHRlciA9IGdhbWUuZmlnaHRUb1RoZURlYXRoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHdpbm5pbmdGaWdodGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvc2luZ0ZpZ2h0ZXIgPSAod2lubmluZ0ZpZ2h0ZXIgPT09IGZpZ2h0aW5nSGVybzEgPyBmaWdodGluZ0hlcm8yIDogZmlnaHRpbmdIZXJvMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdpbm5pbmdGaWdodGVyID09PSBmaWdodGluZ0hlcm8xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlWzBdKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcmVbMV0rKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gd2lubmluZ0ZpZ2h0ZXIubmFtZSArIFwiL1wiICsgbG9zaW5nRmlnaHRlci5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNodXBXaW5zW2tleV0rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1bVJvdW5kcyArPSBnYW1lLnJvdW5kO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBVcGRhdGUgdGhlIHRvdGFsIHN0YXRzIGZvciB0aGVzZSBoZXJvZXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGhlcm9XaW5zW2hlcm8xLm5hbWVdICs9IHNjb3JlWzBdO1xyXG4gICAgICAgICAgICBoZXJvV2luc1toZXJvMi5uYW1lXSArPSBzY29yZVsxXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBQdXQgc3RhdHMgYmFjayBvbiBwYWdlXHJcbiAgICAgKi9cclxuICAgIGN0eC5wb3N0TWVzc2FnZSh7IFwiY21kXCI6IFwicHJvZ3Jlc3NVcGRhdGVcIiwgXCJwcm9ncmVzc1wiOiAxMDAqMTAwIH0pO1xyXG4gICAgY29uc29sZS5sb2coYCBpbiB3b3JrZXIuLi5gKTtcclxuICAgIGNvbnN0IGhlcm9XaW5zVGFibGVIVE1MID0gY3JlYXRlVGFibGVGcm9tUHJvcGVydGllcyhoZXJvV2lucywgKGhlcm9TZXQubGVuZ3RoIC0gMSkgKiBib3V0Q291bnQsXHJcbiAgICAgICAgYFJlc3VsdHMgZm9yICR7aGVyb1NldC5sZW5ndGh9IGhlcm9lcywgcGFpcmVkIHVwIGZvciAke2JvdXRDb3VudH0gYm91dHMgZWFjaDpgLCBmYWxzZSk7XHJcbiAgICBjb25zdCBtYXRjaHVwV2luc1RhYmxlSFRNTDogc3RyaW5nID0gY3JlYXRlVGFibGVGcm9tUHJvcGVydGllcyhtYXRjaHVwV2lucywgYm91dENvdW50LFxyXG4gICAgICAgIGBQYWlyd2lzZSByZXN1bHRzIGZvciAke2hlcm9TZXQubGVuZ3RofSBoZXJvZXMsIHBhaXJlZCB1cCBmb3IgJHtib3V0Q291bnR9IGJvdXRzIGVhY2g6YCwgdHJ1ZSk7XHJcbiAgICBjdHgucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgIFwiY21kXCI6IFwiZmluaXNoZWRcIixcclxuICAgICAgICBcImhlcm9XaW5zXCI6IGhlcm9XaW5zLFxyXG4gICAgICAgIFwibWF0Y2h1cFdpbnNcIjogbWF0Y2h1cFdpbnMsXHJcbiAgICAgICAgXCJoZXJvV2luc1RhYmxlSFRNTFwiOiBoZXJvV2luc1RhYmxlSFRNTCxcclxuICAgICAgICBcIm1hdGNodXBXaW5zVGFibGVIVE1MXCI6IG1hdGNodXBXaW5zVGFibGVIVE1MXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlVGFibGVGcm9tUHJvcGVydGllcyhoZXJvV2luczogeyBbaW5kZXg6IHN0cmluZ106IG51bWJlciB9LCB0b3RhbENvdW50OiBudW1iZXIsIGNhcHRpb246IHN0cmluZywgaXNWZXJzdXM6IGJvb2xlYW4pOiBzdHJpbmcge1xyXG4gICAgbGV0IGh0bWwgPSBgPGNhcHRpb24+JHtjYXB0aW9ufTwvY2FwdGlvbj48dGhlYWQ+YDtcclxuICAgIGlmIChpc1ZlcnN1cykge1xyXG4gICAgICAgIGh0bWwgKz0gYDx0cj48dGg+SGVybyAxPC90aD48dGg+dnMgSGVybyAyPC90aD5gXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGh0bWwgKz0gYDx0cj48dGg+SGVybzwvdGg+YFxyXG4gICAgfVxyXG4gICAgaHRtbCArPSBgPHRoIGlkPVwiJHtpc1ZlcnN1cyA/ICdtYXRjaCcgOiAnJ313aW5zXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj5XaW5zPC90aD48dGggY2xhc3M9XCJcIiBzdHlsZT1cInRleHQtYWxpZ246IHJpZ2h0O1wiPiUgdG90YWw8L3RoPjwvdHI+PC90aGVhZD5gO1xyXG4gICAgbGV0IHRib2R5ID0gJyc7XHJcbiAgICBsZXQgcGVyY2VudGFnZVdpbiA9IDA7XHJcbiAgICBsZXQgcGN0Q2xhc3M6IHN0cmluZztcclxuICAgIGZvciAobGV0IHByb3BlcnR5IGluIGhlcm9XaW5zKSB7XHJcbiAgICAgICAgaWYgKGhlcm9XaW5zLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICBwZXJjZW50YWdlV2luID0gcGFyc2VJbnQoKChoZXJvV2luc1twcm9wZXJ0eV0gLyB0b3RhbENvdW50KSAqIDEwMCkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgICAgIHBjdENsYXNzID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChwZXJjZW50YWdlV2luID4gNzApXHJcbiAgICAgICAgICAgICAgICBwY3RDbGFzcyA9IGAgY2xhc3M9XCJhbGVydC1zdWNjZXNzXCJgO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChwZXJjZW50YWdlV2luIDwgMzApXHJcbiAgICAgICAgICAgICAgICBwY3RDbGFzcyA9IGAgY2xhc3M9XCJhbGVydC1kYW5nZXJcImA7XHJcbiAgICAgICAgICAgIHRib2R5ICs9IGA8dHIke3BjdENsYXNzfT5gO1xyXG4gICAgICAgICAgICBpZiAoaXNWZXJzdXMpIHtcclxuICAgICAgICAgICAgICAgIGxldCBoZXJvZXMgPSBwcm9wZXJ0eS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgICAgICB0Ym9keSArPSBgPHRkPiR7aGVyb2VzWzBdfTwvdGQ+PHRkPiR7aGVyb2VzWzFdfTwvdGQ+YDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRib2R5ICs9IGA8dGQ+JHtwcm9wZXJ0eX08L3RkPmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0Ym9keSArPSBgPHRkIHN0eWxlPVwidGV4dC1hbGlnbjogcmlnaHQ7XCI+JHtoZXJvV2luc1twcm9wZXJ0eV19PC90ZD5gXHJcbiAgICAgICAgICAgIHRib2R5ICs9IGA8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOiByaWdodDtcIj4ke3BlcmNlbnRhZ2VXaW59PC90ZD48L3RyPmBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBodG1sICs9IGA8dGJvZHk+JHt0Ym9keX08L3Rib2R5PmA7XHJcbiAgICByZXR1cm4gaHRtbDtcclxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==