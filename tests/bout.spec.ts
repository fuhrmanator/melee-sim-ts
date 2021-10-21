import { Bout } from "../src/melee/bout";
import { HeroesSingleton } from "../src/melee/heroesSingleton";
import { Hero } from "../src/melee/hero";
import { Weapon } from "../src/melee/weapon";
import { Roll } from "../src/melee/roll";

function summonMyrmidon(name?: string) {
    const heroStats = HeroesSingleton.getMyrmidon();
    return new Hero(name || heroStats.id, heroStats.st, heroStats.dx, heroStats.weapon, heroStats.armor, heroStats.shield);
}

describe("attackee facing bonus", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    it("should be 0 for opponent that is not prone", () => {
        expect(bout.facingBonusToAttack(hero1)).toBe(0);
    })
    it("should be 4 for opponent that is prone", () => {
        hero1.dropWeapon();
        bout.tryPickUp(hero1);
        expect(bout.facingBonusToAttack(hero1)).toBe(4);
    })
})

describe("Fight to the death", () => {
    const hero1 = summonMyrmidon('Fred');
    hero1.weapon = Weapon.SHORTSWORD;
    const hero2 = summonMyrmidon('Barney');
    const bout = new Bout(hero1, hero2, false, false);
    it("should result in a winner of either hero or none (a tie)", () => {
        const winner = bout.fightToTheDeath();
        try {
            expect(winner).toBe(hero1);
        } catch (error) {
            try {
                expect(winner).toBe(hero2);
            } catch (error) {
                // tie
                expect(winner).toBe(null);
            }
        }
    })
})

describe("Automatic hit", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    const roll = new Roll(3);
    it("should not result in an automatic hit for a roll total of 7", () => {
        roll.rolls = [3, 3, 1];
        expect(bout.isAutomaticHit(roll)).toBe(false);
    });
    it("should not result in an automatic hit for a roll total of 6", () => {
        roll.rolls = [3, 2, 1];
        expect(bout.isAutomaticHit(roll)).toBe(false);
    });
    it("should result in an automatic hit for a roll total of 5", () => {
        roll.rolls = [3, 1, 1];
        expect(bout.isAutomaticHit(roll)).toBe(true);
    });
    it("should result in an automatic hit for a roll total of 4", () => {
        roll.rolls = [2, 1, 1];
        expect(bout.isAutomaticHit(roll)).toBe(true);
    });
    it("should result in an automatic hit for a roll total of 3", () => {
        roll.rolls = [1, 1, 1];
        expect(bout.isAutomaticHit(roll)).toBe(true);
    });
    it("should not result in an automatic hit for any roll of 4 dice", () => {
        roll.rolls = [1, 1, 1, 1];
        expect(bout.isAutomaticHit(roll)).toBe(false);
    });
})

describe("Automatic miss", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    const roll = new Roll(3);
    it("should NOT result in an automatic miss for a roll total of 14 on three dice", () => {
        roll.rolls = [5, 5, 4];
        expect(bout.isAutomaticMiss(roll)).toBe(false);
    });
    it("should NOT result in an automatic miss for a roll total of 15 on three dice", () => {
        roll.rolls = [5, 5, 5];
        expect(bout.isAutomaticMiss(roll)).toBe(false);
    });
    it("should result in an automatic miss for a roll total of 16 on three dice", () => {
        roll.rolls = [5, 5, 6];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should result in an automatic miss for a roll total of 17 on three dice", () => {
        roll.rolls = [5, 6, 6];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should result in an automatic miss for a roll total of 18 on three dice", () => {
        roll.rolls = [5, 6, 6];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should NOT result in an automatic miss for a roll total of 18 on four dice", () => {
        roll.rolls = [6, 6, 5, 1];
        expect(bout.isAutomaticMiss(roll)).toBe(false);
    });
    it("should NOT result in an automatic miss for a roll total of 19 on four dice", () => {
        roll.rolls = [6, 6, 5, 2];
        expect(bout.isAutomaticMiss(roll)).toBe(false);
    });
    it("should result in an automatic miss for a roll total of 20 on four dice", () => {
        roll.rolls = [6, 6, 5, 3];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should result in an automatic miss for a roll total of 21 on four dice", () => {
        roll.rolls = [6, 6, 5, 4];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should result in an automatic miss for a roll total of 22 on four dice", () => {
        roll.rolls = [6, 6, 5, 5];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should result in an automatic miss for a roll total of 23 on four dice", () => {
        roll.rolls = [6, 6, 5, 6];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });
    it("should result in an automatic miss for a roll total of 24 on four dice", () => {
        roll.rolls = [6, 6, 6, 6];
        expect(bout.isAutomaticMiss(roll)).toBe(true);
    });

})

describe("Breaking weapons", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    const roll = new Roll(3);
    it("should NOT result in a broken weapon for a roll total of 16 on three dice", () => {
        roll.rolls = [5, 5, 6];
        expect(bout.isBrokenWeapon(roll)).toBe(false);
    });
    it("should NOT result in a broken weapon for a roll total of 17 on three dice", () => {
        roll.rolls = [5, 6, 6];
        expect(bout.isBrokenWeapon(roll)).toBe(false);
    });
    it("should result in a broken weapon for a roll total of 18 on three dice", () => {
        roll.rolls = [6, 6, 6];
        expect(bout.isBrokenWeapon(roll)).toBe(true);
    });
    it("should NOT result in a broken weapon for a roll total of 20 on four dice", () => {
        roll.rolls = [6, 6, 6, 2];
        expect(bout.isBrokenWeapon(roll)).toBe(false);
    });
    it("should NOT result in a broken weapon for a roll total of 21 on four dice", () => {
        roll.rolls = [6, 6, 6, 3];
        expect(bout.isBrokenWeapon(roll)).toBe(false);
    });
    it("should NOT result in a broken weapon for a roll total of 22 on four dice", () => {
        roll.rolls = [6, 6, 6, 4];
        expect(bout.isBrokenWeapon(roll)).toBe(false);
    });
    it("should result in a broken weapon for a roll total of 23 on four dice", () => {
        roll.rolls = [6, 6, 6, 5];
        expect(bout.isBrokenWeapon(roll)).toBe(true);
    });
    it("should result in a broken weapon for a roll total of 24 on four dice", () => {
        roll.rolls = [6, 6, 6, 6];
        expect(bout.isBrokenWeapon(roll)).toBe(true);
    });
})

describe("Dropping weapons", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    const roll = new Roll(3);
    it("should NOT result in a dropped weapon for a roll total of 16 on three dice", () => {
        roll.rolls = [5, 5, 6];
        expect(bout.isDroppedWeapon(roll)).toBe(false);
    });
    it("should result in a dropped weapon for a roll total of 17 on three dice", () => {
        roll.rolls = [5, 6, 6];
        expect(bout.isDroppedWeapon(roll)).toBe(true);
    });
    it("should NOT result in a dropped weapon for a roll total of 18 on three dice", () => {
        roll.rolls = [6, 6, 6];
        expect(bout.isDroppedWeapon(roll)).toBe(false);
    });

    it("should NOT result in a dropped weapon for a roll total of 20 on four dice", () => {
        roll.rolls = [6, 6, 6, 2];
        expect(bout.isDroppedWeapon(roll)).toBe(false);
    });
    it("should result in a dropped weapon for a roll total of 21 on four dice", () => {
        roll.rolls = [6, 6, 6, 3];
        expect(bout.isDroppedWeapon(roll)).toBe(true);
    });
    it("should result in a dropped weapon for a roll total of 22 on four dice", () => {
        roll.rolls = [6, 6, 6, 4];
        expect(bout.isDroppedWeapon(roll)).toBe(true);
    });
    it("should NOT result in a dropped weapon for a roll total of 23 on four dice", () => {
        roll.rolls = [6, 6, 6, 5];
        expect(bout.isDroppedWeapon(roll)).toBe(false);
    });
    it("should NOT result in a dropped weapon for a roll total of 24 on four dice", () => {
        roll.rolls = [6, 6, 6, 6];
        expect(bout.isDroppedWeapon(roll)).toBe(false);
    });
})

describe("Doing double damage", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    const roll = new Roll(3);
    it("should NOT result in double damage for a roll total of 6 on three dice", () => {
        roll.rolls = [3, 2, 1];
        expect(bout.isDoubleDamage(roll)).toBe(false);
    });
    it("should NOT result in double damage for a roll total of 5 on three dice", () => {
        roll.rolls = [3, 1, 1];
        expect(bout.isDoubleDamage(roll)).toBe(false);
    });
    it("should result in double damage for a roll total of 4 on three dice", () => {
        roll.rolls = [2, 1, 1];
        expect(bout.isDoubleDamage(roll)).toBe(true);
    });
    it("should NOT result in double damage for a roll total of 3 on three dice", () => {
        roll.rolls = [1, 1, 1];
        expect(bout.isDoubleDamage(roll)).toBe(false);
    });
    // Double damage not possible on 4 dice, since 4-die roll is for defending
    it("should NOT result in double damage for a roll total of 6 on four dice", () => {
        roll.rolls = [1, 1, 1, 3];
        expect(bout.isDoubleDamage(roll)).toBe(false);
    });
    it("should NOT result in double damage for a roll total of 5 on four dice", () => {
        roll.rolls = [1, 1, 1, 2];
        expect(bout.isDoubleDamage(roll)).toBe(false);
    });
    it("should NOT result in double damage for a roll total of 4 on four dice", () => {
        roll.rolls = [1, 1, 1, 1];
        expect(bout.isDoubleDamage(roll)).toBe(false);
    });
})

describe("Doing triple damage", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    const roll = new Roll(3);
    it("should NOT result in triple damage for a roll total of 5 on three dice", () => {
        roll.rolls = [3, 1, 1];
        expect(bout.isTripleDamage(roll)).toBe(false);
    });
    it("should NOT result in triple damage for a roll total of 4 on three dice", () => {
        roll.rolls = [2, 1, 1];
        expect(bout.isTripleDamage(roll)).toBe(false);
    });
    it("should result in triple damage for a roll total of 3 on three dice", () => {
        roll.rolls = [1, 1, 1];
        expect(bout.isTripleDamage(roll)).toBe(true);
    });
    // Triple damage not possible on 4 dice, since 4-die roll is for defending
    it("should NOT result in triple damage for a roll total of 6 on four dice", () => {
        roll.rolls = [1, 1, 1, 3];
        expect(bout.isTripleDamage(roll)).toBe(false);
    });
    it("should NOT result in triple damage for a roll total of 5 on four dice", () => {
        roll.rolls = [1, 1, 1, 2];
        expect(bout.isTripleDamage(roll)).toBe(false);
    });
    it("should NOT result in triple damage for a roll total of 4 on four dice", () => {
        roll.rolls = [1, 1, 1, 1];
        expect(bout.isTripleDamage(roll)).toBe(false);
    });
})

describe("Picking up dropped weapon", () => {
    const hero1 = summonMyrmidon();
    const bout = new Bout(hero1, hero1, false, false);
    hero1.dropWeapon();
    bout.tryPickUp(hero1);
    it("should result in hero picking up weapon", () => {
        expect(hero1.isPickingUpWeapon).toBe(true);
    })
    it("should result in hero being prone", () => {
        expect(hero1.isProne).toBe(true);
    })
    it("should result in hero having no readied weapon", () => {
        expect(hero1.readiedWeapon).toEqual(Weapon.NONE);
    })
})