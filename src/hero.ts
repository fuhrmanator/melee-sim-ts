import { Weapon } from "./weapon";
import { Shield } from "./shield";
import { Armor } from "./armor";
import { log } from "./logger";

export class Hero {

    private _name: string;
    private _st: number;
    private _dx: number;
    private _ma: number;
    private _weapon: Weapon;
    private _readiedWeapon: Weapon;
    private _armor: Armor;
    private _shield: Shield;
    private _knockedDown: boolean;
    private _standingUp: boolean;
    private _pickingUpWeapon: boolean;
    private _droppedWeapon: Weapon;
    private _damageTaken: number;
    private _damageTakenThisRound: number;
    private _injuryDexPenalty: boolean;
    private _recovering: boolean;
    private _defending: boolean;
    private _charging: boolean;

    constructor(name: string, st: number, dx: number, weapon: Weapon, armor: Armor, shield: Shield) {
        this._name = name;
        this._st = st;
        this._dx = dx;
        this._ma = 10; // hard-coded for humans
        this._readiedWeapon = weapon;
        this._armor = armor;
        this._shield = shield;
        this._knockedDown = false;
        this._standingUp = false;
        this._pickingUpWeapon = false;
        this._weapon = weapon;
        this._droppedWeapon = Weapon.NONE;

        this._damageTaken = 0;
        this._damageTakenThisRound = 0;
        this._injuryDexPenalty = false;
        this._recovering = false;
        this._defending = false;
        this._charging = false;
    }

    public get name(): string {
        return this._name;
    }

    public get getST(): number {
        return this._st;
    };

    public get adjST(): number {
        return Math.max(this._st - this._damageTaken, 0);
    };

    public get getMA(): number {
        return this._ma;
    };

    public get adjustedMA(): number {
        return this._ma - this._armor.maAdj;
    };

    public get getDX(): number {
        return this._dx;
    };

    public get adjustedDx(): number {
        return this._dx - this._armor.dxAdj - this._shield.dxAdj - (this._injuryDexPenalty ? 2 : 0) - (this.isStrengthLowPenalty ? 3 : 0);
    };

    public get damageTakenThisRound(): number {
        return this._damageTakenThisRound;
    };

    public get isAlive(): boolean {
        return (this._st - this._damageTaken > 0);
    };

    public get isConscious(): boolean {
        return (this._st - this._damageTaken > 1);
    };

    public get isKnockedDown(): boolean {
        return this._knockedDown;
    };

    public standUp() {
        this._standingUp = true;
    };

    /**
     * These rules maybe should go into Game (better cohesion)
     */
    public newRound() {
        this._charging = false;
        this._defending = false;
        this._damageTakenThisRound = 0;
        if (this._standingUp) {
            this._knockedDown = false;
            this._standingUp = false;
        }
        else if (this._pickingUpWeapon)  // technically "was" picking up weapon last round
        {
            this._readiedWeapon = this._droppedWeapon;
            this._droppedWeapon = Weapon.NONE;
            this._pickingUpWeapon = false;
        }

        /*
         * Dex penalty due to injury lasts one complete round
         */
        if (this._injuryDexPenalty && this._recovering) {
            this._injuryDexPenalty = false;
            this._recovering = false;
        }
        else if (this._injuryDexPenalty) {
            this._recovering = true;
        }
    };

    public takeHits(hits: number) {
        var armorPoints = this._armor.hitsStopped + this._shield.hitsStopped;
        var damageDone = hits - armorPoints;
        if (damageDone < 0) damageDone = 0;


        log(this._name + " taking " + hits + " hits.");
        log(this._armor.name + " stops " + this._armor.hitsStopped);
        log(this._shield.name + " stops " + this._shield.hitsStopped);
        log(this._name + " taking " + damageDone + " damage.");

        this.takeDamage(damageDone);
        return damageDone;
    };

    /**
     * After it's got past armor, etc.
     */
    public takeDamage(damageDone: number) {
        this._damageTaken += damageDone;
        this._damageTakenThisRound += damageDone;
        this._injuryDexPenalty = this.sufferingDexPenalty();

        if (this._injuryDexPenalty) log(this._name + " has an adjDx penalty of -2 for remainder of this round and the NEXT round.");
        log(this._name + " has now taken " + this._damageTaken + " points of damage, ST = " + this._st + (this._damageTaken >= this._st ? " and is DEAD." : (this._st - this._damageTaken === 1 ? " and is UNCONSCIOUS." : ".")));

        if (this._damageTakenThisRound >= 8) {
            this._knockedDown = true;
            log(this._name + " has been knocked down by damage.");
        }
        if (this.isStrengthLowPenalty) log(this._name + " has an additional DX adjustment of -3 due to ST <= 3.");

    };

    public sufferingDexPenalty(): boolean {
        return (this._damageTakenThisRound >= 5 || this._recovering);
    };

    public get isStrengthLowPenalty(): boolean {
        return (this._st - this._damageTaken <= 3);
    };

    public setDefending() {
        this._defending = true;
    };

    public isDefending(): boolean {
        return this._defending;
    };

    public setCharging(isCharging: boolean) {
        //        log("Hero: setCharge to " + isCharging);
        this._charging = isCharging;
    };

    public get isCharging() {
        return this._charging;
    };

    public get isProne() {
        return this._pickingUpWeapon;
    };

    public get isPickingUpWeapon() {
        return this._pickingUpWeapon;
    };

    public getWeapon() {
        return this._weapon;
    };

    public get getReadiedWeapon() {
        return this._readiedWeapon;
    };

    public dropWeapon() {
        this._droppedWeapon = this._readiedWeapon;
        this._readiedWeapon = Weapon.NONE;
    };

    public breakWeapon() {
        this._readiedWeapon = Weapon.NONE;
        this._droppedWeapon = Weapon.NONE; // shouldn't need this, but just in case
    };

    public getDroppedWeapon() {
        return this._droppedWeapon;
    };

    public pickUpWeapon() {
        this._pickingUpWeapon = true;
    };

    public get getArmor() {
        return this._armor;
    };

    public setArmor(armor: Armor) {
        return this._armor = armor;
    };

    public get armorPoints(): number {
        return this._armor.hitsStopped + this._shield.hitsStopped;
    };

    public get getShield() {
        return this._shield;
    };

    public toString() {
        return `${this._name}\n${this._armor.toString()}\n${this._readiedWeapon.toString()}`;
    };

    public get canDoDamage(): boolean {
        return this.isConscious && (this._readiedWeapon !== Weapon.NONE || this._droppedWeapon !== Weapon.NONE)
    };

}

