import { Container, Point, Sprite, Texture } from "pixi.js";




export class Projectile extends Container {
    private projectile_sprite : Sprite;
    private speed : number;
    private rot : number;
    private flying_time : number;
    public must_destroy : Boolean;

    constructor(ammo_texture : Texture, position : Point, mouse_position : Point){
        super();
        this.projectile_sprite = new Sprite(ammo_texture);
        this.projectile_sprite.anchor.set(0.5);
        this.projectile_sprite.position.set(position.x,position.y);
        this.speed = 1300;
        this.flying_time = 0;
        this.must_destroy = false;
        this.rot = this.calculateRotationTo(mouse_position);
        this.rotateTowards(mouse_position);
        this.addChild(this.projectile_sprite);
    }

    public update(deltaSeconds: number, _deltaFrame : number) : void{
        this.flying_time += deltaSeconds;
        if(this.flying_time < 1){
            this.movimiento(deltaSeconds);
        }else if(this.flying_time > 3){
            this.must_destroy = true;
        }
    }


    private movimiento(deltaTime : number) : void{
        this.projectile_sprite.x = this.projectile_sprite.x + this.speed  * Math.cos(this.rot - 3.14/2) * deltaTime;
	    this.projectile_sprite.y = this.projectile_sprite.y + this.speed  * Math.sin(this.rot - 3.14/2) * deltaTime; 
    }
    private rotateTowards(objectPoint: Point) : void {
        const rot = this.calculateRotationTo(objectPoint);
        this.projectile_sprite.rotation = rot;
    }
    private calculateRotationTo(objectPoint : Point) : number{
        const globalsprite = this.toGlobal(this.projectile_sprite.position);
        const distance_x = objectPoint.x - globalsprite.x;
        const distance_y = objectPoint.y - globalsprite.y;
        const rot = (Math.atan2(distance_y, distance_x)) + 3.14/2;
        return rot;
    }




}