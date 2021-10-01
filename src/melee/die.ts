import { log } from "../logger";

export function roll() {
    const roll = Math.floor(Math.random() * 6 + 1);
    log(`Die roll: ${roll}`);
    return roll;
}

export function rollDice(numDice: number) {
    let result = 0;
    for (let i = 0; i < numDice; i++) {
        result += roll();
    }
    return result;
}

export function rollThreeDice() {
    return rollDice(3);
}

export function rollFourDice() {
    return rollDice(4);
}