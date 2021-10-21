import { Roll } from "../src/melee/roll";

describe("Roll class", () => {
    it("should have the correct number of dice", () => {
        expect(new Roll(3).numberOfDice).toBe(3);
        expect(new Roll(4).numberOfDice).toBe(4);
        expect(new Roll(4, 1).numberOfDice).toBe(4);
    })
})

