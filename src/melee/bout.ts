import { Hero } from "./hero";
import { Weapon } from "./weapon";
import { log } from "../logger";
import { rollDice } from "./die";
import { HeroesSingleton } from "./heroesSingleton"
import { Roll } from "./roll";

export class Bout {

    static heroMap = new Map<string, Hero>(); // singleton
    hero1: Hero;
    hero2: Hero;
    round: number;
    winHero1: boolean;
    winHero2: boolean;
    criticalMisses: number;
    criticalHits: number;
    poleCharge: boolean;
    defendOnPoleCharge: boolean;

    constructor(hero1: Hero, hero2: Hero, poleCharge: boolean, defendOnPoleCharge: boolean) {
        this.hero1 = hero1;
        this.hero2 = hero2;
        this.round = 0;
        this.winHero1 = false;
        this.winHero2 = false;
        this.criticalMisses = 0;
        this.criticalHits = 0;
        this.poleCharge = poleCharge;
        this.defendOnPoleCharge = defendOnPoleCharge;
        log("New Game with pole charge set to " + this.poleCharge + " and defend on pole charge set to " + this.defendOnPoleCharge);
    };

    fightToTheDeath() {
        let winner = null;
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


            log("---> Round " + this.round);
            log("Hero 1: " + this.hero1.name + ", ST: " + this.hero1.st + "(" + this.hero1.adjST + ")");
            log("Hero 2: " + this.hero2.name + ", ST: " + this.hero2.st + "(" + this.hero2.adjST + ")");

            let firstAttacker = this.hero1, secondAttacker = this.hero2;

            /* highest adjDx attacks first */
            if (this.hero1.adjustedDx < this.hero2.adjustedDx) {
                firstAttacker = this.hero2;
                secondAttacker = this.hero1;
            }
            /* roll to see who attacks first */
            else if (this.hero1.adjustedDx == this.hero2.adjustedDx) {

                log(`Adjusted dexterity (${this.hero1.adjustedDx}) is the same for both fighters; rolling to decide attack order`);
                if (Math.random() < 0.5) {
                    firstAttacker = this.hero2;
                    secondAttacker = this.hero1;
                }
            }

            log(`${firstAttacker.name} (adjDx = ${firstAttacker.adjustedDx}) attacks before ${secondAttacker.name} (adjDx = ${secondAttacker.adjustedDx})`);

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
        } else if (this.hero2.canDoDamage) {
            winner = this.hero2;
        } else {
            winner = null;
        }

        if (winner != null) {
            log(`-------> The winner of this bout is ${winner.name}`);
        }
        else {
            log("-------> This bout was a TIE!");
        }
        return winner;
    }

    /**
     * Private (static) functions, must be passed a "this" if you need access to Game
     */
    private tryDefending(defender: Hero, attacker: Hero, defendOnPoleCharge: boolean) {
        if (!defender.isKnockedDown
            && defender.readiedWeapon !== Weapon.NONE
            && defender.sufferingDexPenalty()
            && defender.adjustedDx < 8) {

            defender.setDefending();
            log(`${defender.name} is defending this turn because adjDX < 8 and temporarily penalized.`);
        }
        else if (defendOnPoleCharge
            && !defender.isKnockedDown
            && defender.readiedWeapon !== Weapon.NONE
            && attacker.readiedWeapon !== Weapon.NONE
            && attacker.readiedWeapon.isPole
            && attacker.isCharging
            && !defender.isCharging  // don't defend if also charging with pole weapon
        ) {

            defender.setDefending();
            log(`${defender.name} is defending this turn because attacker is charging with pole weapon.`);
        }
    }

    private tryStandUp(hero: Hero) {
        if (hero.isKnockedDown) {
            hero.standUp();

            log(`${hero.name} is standing up this turn.`);
        }
    }

    public tryPickUp(hero: Hero) {
        if (hero.getDroppedWeapon() !== Weapon.NONE) {
            hero.pickUpWeapon();
            log(`${hero.name} is picking up his weapon this turn (rear facing in all six directions).`);
        }
    }

    public facingBonusToAttack(attackee: Hero) {
        return attackee.isProne ? 4 : 0;
    }

    private resolveAttack(game: Bout, attacker: Hero, attackee: Hero, roll: Roll) {
        const facingBonus = this.facingBonusToAttack(attackee);

        log(attacker.name + " rolled " + roll.total + " and adjDex is "
            + (attackee.isProne ? (attacker.adjustedDx + facingBonus + " (" + attacker.adjustedDx + " + " + facingBonus + ", target is prone, i.e., knocked down or picking up a weapon)")
                : attacker.adjustedDx));

        /**
         * A hit is a roll that is
         * NOT an automatic miss AND
         * (below or equal to the attacker's adjDex OR and automatic hit)
         */
        if (!this.isAutomaticMiss(roll) && (roll.total <= attacker.adjustedDx + facingBonus || this.isAutomaticHit(roll))) {
            log("HIT!!!!");

            let hits = attacker.readiedWeapon.doDamage();
            if (attacker.isCharging && attacker.readiedWeapon.isPole) {
                log("Pole weapon charge does double damage!");
                game.criticalHits++;
                hits *= 2;
            }
            if (this.isDoubleDamage(roll)) {
                log("Double damage! (roll of " + roll.total + " on " + roll.numberOfDice + " dice.)");
                game.criticalHits++;
                hits *= 2;
            }
            else if (this.isTripleDamage(roll)) {
                log("Triple damage! (roll of " + roll.total + " on " + roll.numberOfDice + " dice.)");
                game.criticalHits++;
                hits *= 3;
            }
            log("Total damage done by " + attacker.readiedWeapon.name + ": " + hits + " hits");
            attackee.takeHits(hits);

        } else {
            /**
             * It's a miss
             */
            log("Missed. ");
            if (this.isDroppedWeapon(roll)) {
                log("Dropped weapon! ");
                game.criticalMisses++;
                attacker.dropWeapon();
            }
            else if (this.isBrokenWeapon(roll)) {
                log("Broke weapon! ");
                game.criticalMisses++;
                attacker.breakWeapon();
            }

        }

    };

    private tryAttack(game: Bout, attacker: Hero, attackee: Hero) {
        log(attacker.name + " gets his turn to attack.");
        if (!attacker.isDefending()) {
            if (attacker.isConscious) {
                if (!attacker.isKnockedDown) {
                    if (attacker.readiedWeapon !== Weapon.NONE) {
                        if (attacker.isCharging) log("He's charging with pole weapon (double damage if he hits).");
                        const numDice = attackee.isDefending() ? 4 : 3;
                        log("Rolling to hit on " + numDice + " dice.");
                        this.resolveAttack(game, attacker, attackee,
                            new Roll(numDice));
                    } else {

                        log("But he's not able to attack because he has has no readied weapon.");
                    }
                } else {

                    log("But he's not able to attack because he was knocked down.");
                }
            } else {

                log("But he's not able to attack because he's " + (attacker.isAlive ? "unconscious." : "dead."));
            }
        } else {

            log("But he's defending.");
        }

    };

    isAutomaticMiss(roll: Roll) {
        let result = false;
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
    }

    isAutomaticHit(roll: Roll) {
        let result = false;
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
    }

    isDoubleDamage(roll: Roll) {
        let result = false;
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
    }

    isTripleDamage(roll: Roll) {
        let result = false;
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
    }

    isDroppedWeapon(roll: Roll) {
        let result = false;
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
    }

    isBrokenWeapon(roll: Roll) {
        let result = false;
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

    static createHeroesMap() {
        // heroSet.put(new Hero("001:ST8;DX16;DAGGER;NO_ARMOR;SMALL_SHIELD", 8, 16, Weapon.DAGGER, Armor.NO_ARMOR, Shield.SMALL_SHIELD), new Integer(0));
        let h1;
        const heroesListJSON = HeroesSingleton.getHeroesListJSON();
        let heroJSON = null;
        for (let i = 0; i < heroesListJSON.length; i++) {
            heroJSON = heroesListJSON[i];
            h1 = new Hero(HeroesSingleton.getNameFromID(heroJSON.id), heroJSON.st, heroJSON.dx, heroJSON.weapon, heroJSON.armor, heroJSON.shield);
            //this.putHero(h1);
            this.heroMap.set(h1.name, h1);
        }
    };

    private displayHeroesMap() {
        console.log(Object.keys(Bout.heroMap));
    };

    static getHeroMap() {
        return Bout.heroMap;
    };

}

