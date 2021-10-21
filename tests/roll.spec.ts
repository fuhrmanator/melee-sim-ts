import { Roll } from "../src/melee/roll";

describe("Roll class", () => {
    it("should have the correct number of dice", () => {
        expect(new Roll(3).numberOfDice).toBe(3);
        expect(new Roll(4).numberOfDice).toBe(4);
        expect(new Roll(4, 1).numberOfDice).toBe(4);
    });
    it("should have the correct total", () => {
        const roll = new Roll(3);
        roll.rolls = [5, 1, 3];
        expect(roll.total).toBe(9);
        roll.rolls = [5, 6];
        expect(roll.total).toBe(11);
        roll.rolls = [5];
        expect(roll.total).toBe(5);

        const rollWithModifier = new Roll(3, -2);
        rollWithModifier.rolls = [5];
        expect(rollWithModifier.total).toBe(5 - 2);
        rollWithModifier.rolls = [5, 5];
        expect(rollWithModifier.total).toBe(10 - 2);

        const rollWithPlusModifier = new Roll(3, 2);
        rollWithPlusModifier.rolls = [5];
        expect(rollWithPlusModifier.total).toBe(5 + 2);
        rollWithPlusModifier.rolls = [5, 5];
        expect(rollWithPlusModifier.total).toBe(10 + 2);
    })
})

