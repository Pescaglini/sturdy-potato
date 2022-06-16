import { Circle, Container, Graphics, Rectangle, Sprite } from "pixi.js";
import { Interpolation, Tween } from "tweedle.js";
import { IHitbox } from "../utils/IHitbox";

export class FarmeableObject extends Container implements IHitbox{ 
    protected current_health : number;

    protected dead : boolean;
    protected destroyable : boolean;

    protected spriteContainer : Sprite;
    private hitBox : Graphics;
    private hitCircle_grap : Graphics;
    private hitCircle: Circle;

    OBJECT_TYPE: String = "FARMEABLE_OBJECT";

    constructor(max_health : number){
        super();

        this.dead = false;
        this.destroyable = false;

        this.current_health = max_health;

        this.hitBox = new Graphics();
        this.hitBox.beginFill(0xFF00FF,0.0);
        this.hitBox.drawRect(-25,-25,50,50);
        this.hitBox.position.set(0,0);

        this.hitCircle_grap = new Graphics();
        this.hitCircle_grap.beginFill(0x0000FF,0.0);
        this.hitCircle_grap.drawCircle(0,0,30);
        this.hitCircle = new Circle(0,0,30);

        this.spriteContainer = new Sprite();
        
        this.addChild(this.spriteContainer);
        this.addChild(this.hitBox);
        this.addChild(this.hitCircle_grap);
    }

    public update() : void{
        
    }

    public getHitbox(): Rectangle {
        return this.hitBox.getBounds()
    }
    public getHitCircle_Rad(): number {
        return this.hitCircle.radius;
    }
    public getHitCircle_Rec(): Rectangle {
        return this.hitCircle_grap.getBounds();
    }
    public impactObjectAdder(obj : any) : void{
        this.addChildAt(obj,0);
    }
    public takeDamage(damage : number) : void{
        this.current_health -= damage;
        this.spriteContainer.tint = 0x808080;
        new Tween(this.spriteContainer).to({tint:[0xffffff]},1000).interpolation(Interpolation.Color.RGB).start();
        if(this.current_health <= 0){
            this.dead = true;
        } 
    }
    public isHitteable(): boolean {
        if(!this.dead){
            return true;
        }
        return false;
    }
    public isDead() : boolean{
        return this.dead;
    }

    public isDestroyable() : boolean{
        return this.destroyable;
    }
}