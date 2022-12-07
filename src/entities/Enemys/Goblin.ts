import { Point, Sprite } from "pixi.js";
import { Enemy } from "./Enemy";
import { EnemySpawn } from "./EnemySpawn";

export class Goblin extends Enemy{
    constructor(startPosition : Point, spawn : EnemySpawn){
        super(startPosition,spawn);
        this.ENEMY_TYPE = "GOBLIN";
        this.enemy_sprite = Sprite.from("goblin");
        this.enemy_shadow_sprite = Sprite.from("goblin");


        this.enemy_sprite.anchor.set(0.5);
        this.enemy_sprite.scale.set(2);
        this.enemy_dead_sprite = Sprite.from("goblinDead");
        this.enemy_dead_sprite.anchor.set(0.5);
        this.enemy_dead_sprite.scale.set(2.5);
        this.enemy_damage_text.position.set(-10, -50);

        this.enemy_shadow_sprite.tint = 0x000000;
        this.enemy_shadow_sprite.anchor.set(0.5,0.5);
        this.enemy_shadow_sprite.scale.set(2,2);
        this.enemy_shadow_sprite.alpha = 0.5;

        this.max_health = 100;
        this.current_health = this.max_health;
        this.detectionRadius = 200;
        this.attackRadius = 50;
        this.timeNeededToAttack = 1;
        this.waiting_time = 5;
        this.damage = 20;
        this.speed_patrol = 200;
        this.speed_chase = 400;
        this.speed = this.speed_patrol;

        this.addChild(this.enemy_shadow_sprite, this.enemy_sprite, this.enemy_damage_text);
    }

    public override changeDeadAnimation() : void{
        this.removeChild(this.enemy_sprite);
        this.removeChild(this.enemy_shadow_sprite);
        this.addChild(this.enemy_dead_sprite);
    }

    

}
