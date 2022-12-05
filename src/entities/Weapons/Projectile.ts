import { Circle, Container, Graphics, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { IHitbox } from "../../utils/IHitbox";


export class Projectile extends Container implements IHitbox {
    private projectile_sprite : Sprite;
    private speed : number;
    private rot : number;
    private damage : number;
    private flying_time : number;
    public must_destroy : Boolean;
    private hitBox : Graphics;
    private hitCircle: Circle;
    private hitCircle_grap: Graphics;
    private alpha_hitbox : number;
    private isAlreadycollieded;

    OBJECT_TYPE = "PROJECTILE";

    constructor(ammo_texture : Texture, position : Point, mouse_position : Point){
        super();

        this.alpha_hitbox = 0;

        this.isAlreadycollieded = false;
        
        this.hitBox = new Graphics();
        this.hitBox.beginFill(0xFF00FF,this.alpha_hitbox);
        this.hitBox.drawRect(25,0,10,60);
        this.hitBox.position.set(-30,-30);

        this.hitCircle_grap = new Graphics();
        this.hitCircle_grap.beginFill(0x0000FF,this.alpha_hitbox);
        this.hitCircle_grap.drawCircle(30,-5,5);
        this.hitCircle_grap.position.set(-30,-30);
        this.hitCircle = new Circle(30,-5,5);

        this.projectile_sprite = new Sprite(ammo_texture);
        this.projectile_sprite.anchor.set(0.5);
        this.position.set(position.x,position.y);
        this.damage = 30;
        this.speed = 1700;
        this.flying_time = 0;
        this.must_destroy = false;
        this.rot = this.calculateRotationTo(mouse_position);
        this.rotation = this.rot;

        this.addChild(this.projectile_sprite);
        this.addChild(this.hitBox);
        this.addChild(this.hitCircle_grap);
    }
    
    public isHitteable(): Boolean {
        return false;
    }
    
    public getShadowRect(offset: number = 0): Rectangle {
        const rec = this.hitBox.getBounds();
        const newRec = new Rectangle(rec.x + offset, rec.y + offset, rec.width - offset, rec.height - offset);
        return newRec
    }
    
    public getHitbox() : Rectangle{
        return this.hitBox.getBounds()
    }

    public getHitCircle_Rad(): number {
        return this.hitCircle.radius;
    }

    public getHitCircle_Rec(): Rectangle {
        return this.hitCircle_grap.getBounds();
    }

    public takeDamage(_damage : number) : void{
        //Un proyectil no puede tomar danio; 
    }

    public getDamage() : number{
        return this.damage;
    }

    public impactObjectAdder(obj : any) : void{
        this.addChildAt(obj,0);
    }

    public update(deltaSeconds: number, _deltaFrame : number) : void{
        this.flying_time += deltaSeconds;
        if(this.flying_time < 0.5){
            this.movimiento(deltaSeconds);
        }else if(this.flying_time > 3){
            this.must_destroy = true;
        }
    }

    private movimiento(deltaTime : number) : void{
        this.x = this.x + this.speed  * Math.cos(this.rot - 3.14/2) * deltaTime;
	    this.y = this.y + this.speed  * Math.sin(this.rot - 3.14/2) * deltaTime; 
    }

    private calculateRotationTo(objectPoint : Point) : number{
        const distance_x = objectPoint.x - this.position.x;
        const distance_y = objectPoint.y - this.position.y;
        const rot = (Math.atan2(distance_y, distance_x)) + 3.14/2;
        return rot;
    }

    public CollisionDetected() : void{
        this.isAlreadycollieded = true;
        this.speed = 0;
    }

    public isCollisionHappened() : Boolean{
        return this.isAlreadycollieded;
    }



}