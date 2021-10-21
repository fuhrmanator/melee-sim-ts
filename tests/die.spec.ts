import { roll, rollDice, rollFourDice, rollThreeDice } from "../src/melee/die";
import "jest-extended"  // should work with global.d.ts, but it doesn't

describe('Die', () => {
    it("should roll between 1 and 6", () => {
        const rolls = new Set<number>();
        for (let index = 0; index < 200; index++) {
            const r = roll();
            expect(r).toBeWithin(1, 7);
            rolls.add(r);
        }
        expect(rolls.size).toBe(6);
    });
    it("should rollDice(1) between 1 and 6", () => {
        for (let index = 0; index < 20; index++) {
            expect(rollDice(1)).toBeWithin(1, 7);
        }
    });
    it("should rollDice(2) between 2 and 12", () => {
        for (let index = 0; index < 20; index++) {
            expect(rollDice(2)).toBeWithin(2, 13);
        }
    });
    it("should rollThreeDice() between 3 and 18", () => {
        const rolls = new Set<number>();
        for (let index = 0; index < 1000; index++) {
            const r = rollThreeDice();
            expect(r).toBeWithin(3, 19);
            rolls.add(r);
        }
        //expect(rolls.size).toBe(16); // 3,4,...,18
        for (let index = 3; index < 19; index++) {
            expect(rolls.has(index)).toBe(true);
        }
    });
    it("should rollFourDice() between 4 and 24", () => {
        const rolls = new Set<number>();
        for (let index = 0; index < 5000; index++) {
            const r = rollFourDice();
            expect(r).toBeWithin(4, 25);
            rolls.add(r);
        }
        //expect(rolls.size).toBe(22); // 4,5,...,24
        for (let index = 4; index < 25; index++) {
            expect(rolls.has(index)).toBe(true);
        }
    });
})
