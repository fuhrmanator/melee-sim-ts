import { rollDice } from "./die";
import { log } from "./logger";

export class Weapon {
    name: string;
    st: number;
    dice: number;
    modifier: number;
    isTwoHanded: boolean;
    isThrown: boolean;
    isPole: boolean;
    constructor(name: string, st: number,
        dice: number,
        modifier: number,
        isTwoHanded: boolean,
        isThrown: boolean,
        isPole: boolean,
    ) {
        this.name = name;
        this.st = st;
        this.dice = dice;
        this.modifier = modifier;
        this.isTwoHanded = isTwoHanded;
        this.isPole = isPole;
        this.isThrown = isThrown;
    }

    public doDamage() {
        log(
            "Rolling for weapon doing "
            + this.dice
            + "d"
            + ((this.modifier > 0) ? "+" : "")
            + ((this.modifier !== 0) ? this.modifier : "")
            + " damage.");
        let damage = 0;
        damage += rollDice(this.dice);
        damage += this.modifier;
        if (this.modifier !== 0) log(((this.modifier > 0) ? "+" : "") + this.modifier);
        if (damage < 0) damage = 0;
        log(`Total weapon damage: ${damage}`);
        return damage;
    };

    public toString() {
        return this.name + " (" + this.dice + "D" + ((this.modifier > 0) ? "+" : "") + ((this.modifier !== 0) ? this.modifier : "") + ")";
    };

    static NONE = new Weapon("None", 0, 0, 0, false, false, false);
    static DAGGER = new Weapon("Dagger", 0, 1, -1, true, false, false);
    static RAPIER = new Weapon("Rapier", 9, 1, 0, false, false, false);
    static CLUB = new Weapon("Club", 9, 1, 0, true, false, false);
    static HAMMER = new Weapon("Hammer", 10, 1, 1, true, false, false);
    static CUTLASS = new Weapon("Cutlass", 10, 2, -2, false, false, false);
    static SHORTSWORD = new Weapon("Shortsword", 11, 2, -1, false, false, false);
    static MACE = new Weapon("Mace", 11, 2, -1, true, false, false);
    static SMALL_AX = new Weapon("Small ax", 11, 1, 2, true, false, false);
    static BROADSWORD = new Weapon("Broadsword", 12, 2, 0, false, false, false);
    static MORNINGSTAR = new Weapon("Morningstar", 13, 2, 1, false, false, false);
    static TWO_HANDED_SWORD = new Weapon("Two-handed sword", 14, 3, -1, false, true, false);
    static BATTLEAXE = new Weapon("Battleaxe", 15, 3, 0, false, true, false);

    // pole weapons
    static JAVELIN = new Weapon("Javelin", 9, 1, -1, true, false, true);
    static SPEAR = new Weapon("Spear", 11, 1, 1, true, true, true);
    static HALBERD = new Weapon("Halberd", 13, 2, -1, false, true, true);
    static PIKE_AXE = new Weapon("Pike axe", 15, 2, 2, false, true, true);    // And now return the constructor function

}

