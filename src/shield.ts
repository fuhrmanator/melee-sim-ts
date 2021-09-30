export class Shield {
    name: string;
    hitsStopped: number;
    dxAdj: number;
    constructor(name: string, hitsStopped: number, dxAdj: number){
        this.name = name;
        this.hitsStopped = hitsStopped;
        this.dxAdj = dxAdj;
    }
    static NO_SHIELD = new Shield("No shield", 0, 0);
    static SMALL_SHIELD = new Shield("Small shield", 1, 0);
    static LARGE_SHIELD = new Shield("Large shield", 2, 1);
}
