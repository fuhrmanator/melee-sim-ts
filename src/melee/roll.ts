import { roll } from "./die";

export class Roll {
    private _rolls: number[];
    constructor(numberOfDice: number, private _modifier?: number) {
        this._rolls = Roll.rolled(numberOfDice);
    }

    public get rolls() {
        return this._rolls;
    }

    public set rolls(rolls: number[]) {
        this._rolls = rolls;
    }

    public get modifier() {
        return this._modifier;
    }

    public get numberOfDice() {
        return this._rolls.length;
    }

    public get total() {
        return this._rolls.reduce((a, b) => a + b) + (this._modifier || 0);
    }

    public static rolled(n: number) {
        const rolls: number[] = [];
        for (let index = 0; index < n; index++) {
            rolls.push(roll())
        }
        return rolls;
    }
}
