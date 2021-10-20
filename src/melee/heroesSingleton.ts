import { Weapon } from "./weapon";
import { Armor } from "./armor";
import { Shield } from "./shield";

export interface HeroDescription {
    id: string;
    st: number;
    dx: number;
    weapon: Weapon;
    armor: Armor;
    shield: Shield;
}

export class HeroesSingleton {
    // http://stackoverflow.com/a/9753841/1168342
    private static listHeight = 15;
    private static heroesListJSON: Array<HeroDescription> =
        [
            { "id": "001", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "002", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "003", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "004", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "005", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "006", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "007", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "008", "st": 8, "dx": 16, "weapon": Weapon.DAGGER, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "009", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "010", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "011", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "012", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "013", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "014", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "015", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "016", "st": 9, "dx": 15, "weapon": Weapon.RAPIER, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "017", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "018", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "019", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "020", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "021", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "022", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "023", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "024", "st": 9, "dx": 15, "weapon": Weapon.CLUB, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "025", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "026", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "027", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "028", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "029", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "030", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "031", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "032", "st": 9, "dx": 15, "weapon": Weapon.JAVELIN, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "033", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "034", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "035", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "036", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "037", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "038", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "039", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "040", "st": 10, "dx": 14, "weapon": Weapon.HAMMER, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "041", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "042", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "043", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "044", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "045", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "046", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "047", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "048", "st": 10, "dx": 14, "weapon": Weapon.CUTLASS, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "049", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "050", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "051", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "052", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "053", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "054", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "055", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "056", "st": 11, "dx": 13, "weapon": Weapon.SHORTSWORD, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "057", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "058", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "059", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "060", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "061", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "062", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "063", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "064", "st": 11, "dx": 13, "weapon": Weapon.MACE, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "065", "st": 11, "dx": 13, "weapon": Weapon.SPEAR, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "066", "st": 11, "dx": 13, "weapon": Weapon.SPEAR, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "067", "st": 11, "dx": 13, "weapon": Weapon.SPEAR, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "068", "st": 11, "dx": 13, "weapon": Weapon.SPEAR, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD },
            { "id": "069", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "070", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "071", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "072", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "073", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "074", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "075", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "076", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "077", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD },
            { "id": "078", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.LEATHER, "shield": Shield.SMALL_SHIELD },
            { "id": "079", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.CHAIN, "shield": Shield.SMALL_SHIELD },
            { "id": "080", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.PLATE, "shield": Shield.SMALL_SHIELD },
            { "id": "081", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.NO_ARMOR, "shield": Shield.LARGE_SHIELD },
            { "id": "082", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.LEATHER, "shield": Shield.LARGE_SHIELD },
            { "id": "083", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.CHAIN, "shield": Shield.LARGE_SHIELD },
            { "id": "084", "st": 13, "dx": 11, "weapon": Weapon.MORNINGSTAR, "armor": Armor.PLATE, "shield": Shield.LARGE_SHIELD },
            { "id": "085", "st": 13, "dx": 11, "weapon": Weapon.HALBERD, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "086", "st": 13, "dx": 11, "weapon": Weapon.HALBERD, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "087", "st": 13, "dx": 11, "weapon": Weapon.HALBERD, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "088", "st": 13, "dx": 11, "weapon": Weapon.HALBERD, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD },
            { "id": "089", "st": 14, "dx": 10, "weapon": Weapon.TWO_HANDED_SWORD, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "090", "st": 14, "dx": 10, "weapon": Weapon.TWO_HANDED_SWORD, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "091", "st": 14, "dx": 10, "weapon": Weapon.TWO_HANDED_SWORD, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "092", "st": 14, "dx": 10, "weapon": Weapon.TWO_HANDED_SWORD, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD },
            { "id": "093", "st": 15, "dx": 9, "weapon": Weapon.BATTLEAXE, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "094", "st": 15, "dx": 9, "weapon": Weapon.BATTLEAXE, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "095", "st": 15, "dx": 9, "weapon": Weapon.BATTLEAXE, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "096", "st": 15, "dx": 9, "weapon": Weapon.BATTLEAXE, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD },
            { "id": "097", "st": 15, "dx": 9, "weapon": Weapon.PIKE_AXE, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "098", "st": 15, "dx": 9, "weapon": Weapon.PIKE_AXE, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "099", "st": 15, "dx": 9, "weapon": Weapon.PIKE_AXE, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "100", "st": 15, "dx": 9, "weapon": Weapon.PIKE_AXE, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD },
            { "id": "101", "st": 16, "dx": 8, "weapon": Weapon.BATTLEAXE, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "102", "st": 16, "dx": 8, "weapon": Weapon.BATTLEAXE, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "103", "st": 16, "dx": 8, "weapon": Weapon.BATTLEAXE, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "104", "st": 16, "dx": 8, "weapon": Weapon.BATTLEAXE, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD },
            { "id": "105", "st": 16, "dx": 8, "weapon": Weapon.PIKE_AXE, "armor": Armor.NO_ARMOR, "shield": Shield.NO_SHIELD },
            { "id": "106", "st": 16, "dx": 8, "weapon": Weapon.PIKE_AXE, "armor": Armor.LEATHER, "shield": Shield.NO_SHIELD },
            { "id": "107", "st": 16, "dx": 8, "weapon": Weapon.PIKE_AXE, "armor": Armor.CHAIN, "shield": Shield.NO_SHIELD },
            { "id": "108", "st": 16, "dx": 8, "weapon": Weapon.PIKE_AXE, "armor": Armor.PLATE, "shield": Shield.NO_SHIELD }
        ];
    static getHeroesListJSON() {
        return HeroesSingleton.heroesListJSON;
    };
    static getListHeight() {
        return HeroesSingleton.listHeight;
    };
    static getNameFromID(id: string) {
        const hero = this.heroesListJSON.find(hero => hero.id == id);
        const name = hero ? `${hero.id}:ST${hero.st};DX${hero.dx};${hero.weapon.name};${hero.armor.name};${hero.shield.name}`.toUpperCase().replace(/[ -]/g, '_') : `(hero id ${id} not found)`;
        return name;
    }
    static getMyrmidon(): HeroDescription {
        return { "id": "069", "st": 12, "dx": 12, "weapon": Weapon.BROADSWORD, "armor": Armor.NO_ARMOR, "shield": Shield.SMALL_SHIELD };
    }
}
