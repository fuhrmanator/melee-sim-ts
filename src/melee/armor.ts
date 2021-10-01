export class Armor {
    name: string;
    hitsStopped: number;
    maAdj: number;
    dxAdj: number;
    constructor(name: string, hitsStopped: number, maAdj: number, dxAdj: number) {
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.maAdj = maAdj;
        this.dxAdj = dxAdj;
    }
    static NO_ARMOR = new Armor("No armor", 0, 0, 0);
    static LEATHER = new Armor("Leather", 2, 2, 2);
    static CHAIN = new Armor("Chain", 3, 4, 4);
    static PLATE = new Armor("Plate", 5, 6, 6);
}

