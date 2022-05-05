import { Point, Sprite } from "pixi.js";
import { Enemy } from "./Enemy";

export class Goblin extends Enemy{

    constructor(detectionRadius : number, startPosition : Point){
        super(detectionRadius,startPosition);
        this.ENEMY_TYPE = "GOBLIN";
        this.enemy_sprite = Sprite.from("goblin");
        this.enemy_sprite.anchor.set(0.5);
        this.enemy_sprite.scale.set(2);
        this.enemy_dead_sprite = Sprite.from("goblinDead");
        this.enemy_dead_sprite.anchor.set(0.5);
        this.enemy_dead_sprite.scale.set(2.5);
        this.max_health = 100;
        this.current_health = this.max_health;
        this.attackRadius = 40;
        this.timeNeededToAttack = 1.5;

        this.addChild(this.enemy_sprite);
    }

    public override changeDeadAnimation() : void{
        this.removeChild(this.enemy_sprite);
        this.addChild(this.enemy_dead_sprite);
    }
    

}
