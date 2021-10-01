import { Armor } from "../src/melee/armor";

describe("No armor", () => {
    it("should be called 'No armor'", () => {
        expect(Armor.NO_ARMOR.name).toBe("No armor");
    })
    it("should stop 0 hits", () => {
        expect(Armor.NO_ARMOR.hitsStopped).toBe(0);
    })
    it("should reduce movement by 0", () => {
        expect(Armor.NO_ARMOR.maAdj).toBe(0);
    })
    it("should reduce dex by 0", () => {
        expect(Armor.NO_ARMOR.dxAdj).toBe(0);
    })
})

describe("Leather armor", () => {
    it("should be called 'Leather'", () => {
        expect(Armor.LEATHER.name).toBe("Leather");
    })
    it("should stop 2 hits", () => {
        expect(Armor.LEATHER.hitsStopped).toBe(2);
    })
    it("should reduce movement by 2", () => {
        expect(Armor.LEATHER.maAdj).toBe(2);
    })
    it("should reduce dex by 2", () => {
        expect(Armor.LEATHER.dxAdj).toBe(2);
    })
})

describe("Chain armor", () => {
    it("should be called 'Chain'", () => {
        expect(Armor.CHAIN.name).toBe("Chain");
    })
    it("should stop 3 hits", () => {
        expect(Armor.CHAIN.hitsStopped).toBe(3);
    })
    it("should reduce movement by 4", () => {
        expect(Armor.CHAIN.maAdj).toBe(4);
    })
    it("should reduce dex by 4", () => {
        expect(Armor.CHAIN.dxAdj).toBe(4);
    })
})

describe("Plate armor", () => {
    it("should be called 'Plate'", () => {
        expect(Armor.PLATE.name).toBe("Plate");
    })
    it("should stop 5 hits", () => {
        expect(Armor.PLATE.hitsStopped).toBe(5);
    })
    it("should reduce movement by 6", () => {
        expect(Armor.PLATE.maAdj).toBe(6);
    })
    it("should reduce dex by 6", () => {
        expect(Armor.PLATE.dxAdj).toBe(6);
    })
})