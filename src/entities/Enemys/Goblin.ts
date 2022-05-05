import { Point, Texture } from "pixi.js";
import { Enemy } from "./Enemy";

export class Goblin extends Enemy{

    constructor(texture_name : Texture, detectionRadius : number, startPosition : Point){
        super(texture_name,detectionRadius,startPosition);
        this.ENEMY_TYPE = "GOBLIN";
        this.max_health = 100;
        this.current_health = this.max_health;
        this.attackRadius = 40;
        this.timeNeededToAttack = 1.5;
    }

}
