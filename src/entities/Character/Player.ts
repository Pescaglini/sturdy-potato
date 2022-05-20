import { AnimatedSprite, Circle, Container, Graphics, IDestroyOptions, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { HEIGHT, WIDTH } from "../..";
import { IHitbox } from "../../utils/IHitbox";
import { Keyboard } from "../../utils/Keyboard";
import { Weapon } from "../Weapons/Weapon";

export class Player extends Container implements IHitbox {
    
    
    private character : Sprite;
    private character_running : AnimatedSprite;
    private character_lowHealth : Sprite;
    private character_dead : Sprite;
    private sprites_array : Array<Container>;
    private isRunning : Boolean;
    private isDead : Boolean;
    private activeWeapon : Weapon;
    private hitBox : Graphics;
    private hitCircle_grap : Graphics;
    private hitCircle : Circle;
    private max_health;
    private current_health;
    private movement : Point;
    private speed : number;
    private alpha_hitbox : number;
    private last_position : Point;

    OBJECT_TYPE = "PLAYER";

    constructor(){
        super();

        this.isDead = false;

        this.position.set(WIDTH/2,HEIGHT/2);
        this.last_position = new Point(this.position.x,this.position.y);
        this.sprites_array = new Array<Container>();
        this.character = Sprite.from("archer_stand");
        this.sprites_array.push(this.character);
        this.character.scale.set(1.5);
        this.character.anchor.set(0.5);
        this.character_running = new AnimatedSprite([
            Texture.from("archer_running_1"),
            Texture.from("archer_running_2"),
            Texture.from("archer_running_3"),
            Texture.from("archer_running_4")   
            ], true
        );
        this.sprites_array.push(this.character_running);
        this.character_running.anchor.set(0.5);
        this.character_running.scale.set(1.5);
        this.character_running.play();
        this.character_running.animationSpeed = 0.2;
        this.character_lowHealth = Sprite.from("archer_crippled");
        this.sprites_array.push(this.character_lowHealth);
        this.character_lowHealth.anchor.set(0.5);
        this.character_lowHealth.scale.set(1.5);
        this.character_dead = Sprite.from("archer_dead");
        this.sprites_array.push(this.character_dead);
        this.character_dead.anchor.set(0.5);
        this.character_dead.scale.set(1.5);

        this.alpha_hitbox = 0;

        this.hitBox = new Graphics();
        this.hitBox.beginFill(0xFF00FF,this.alpha_hitbox);
        this.hitBox.drawRect(0,0,60,60);
        this.hitBox.position.set(-30,-30);

        this.hitCircle_grap = new Graphics();
        this.hitCircle_grap.beginFill(0x0000FF,this.alpha_hitbox);
        this.hitCircle_grap.drawCircle(30,30,30);
        this.hitCircle_grap.position.set(-30,-30);
        this.hitCircle = new Circle(0,0,30);

        this.max_health = 100;
        this.current_health = this.max_health;
        this.movement = new Point(0,0);
        this.speed = 300;

        this.activeWeapon = new Weapon(Texture.from("arrow_1"), 30);

        this.isRunning = false;

        this.addChild(this.hitBox);
        this.addChild(this.hitCircle_grap);
        this.addChild(this.character);
    }

    public override destroy(options?: boolean | IDestroyOptions): void {
        super.destroy(options);
    }

    public update(_deltaFrame: number, deltaSeconds : number, mousePos : any) {
        if(this.isDead){
            this.changeAnimations();
            return;
        }
        this.setStateAnimations();
        this.changeAnimations();
        this.rotateTowardMouse(mousePos);
        this.playerMovement(deltaSeconds);
    } 

    private setStateAnimations() : void{
        this.isRunning = false;
        if(Keyboard.state.get("KeyA")){
            this.isRunning = true;
        }
        if(Keyboard.state.get("KeyD")){
            this.isRunning = true;
        }
        if(Keyboard.state.get("KeyW")){
            this.isRunning = true;
        }
        if(Keyboard.state.get("KeyS")){
            this.isRunning = true;
        }
    }

    private playerMovement(deltaSeconds : number) : void{
        this.last_position.set(this.position.x,this.position.y);
        //Accumulo el movimiento del personaje para saber cuanto tiene que moverse el mundo.
        const direction_point = new Point(0,0);
        if(Keyboard.state.get("KeyA")){
            direction_point.x = -1;
        }
        if(Keyboard.state.get("KeyD")){
            direction_point.x = 1;
        }
        if(Keyboard.state.get("KeyW")){
            direction_point.y = -1;
        }
        if(Keyboard.state.get("KeyS")){
            direction_point.y = 1;
        }
        if(direction_point.x != 0 || direction_point.y != 0){
            const rot = (Math.atan2(direction_point.y,direction_point.x)) + 3.14/2;
            this.position.x += this.speed  * Math.cos(rot - 3.14/2) * deltaSeconds;
            this.position.y += this.speed  * Math.sin(rot - 3.14/2) * deltaSeconds;
            this.movement.x -= this.speed  * Math.cos(rot - 3.14/2) * deltaSeconds;
            this.movement.y -= this.speed  * Math.sin(rot - 3.14/2) * deltaSeconds;
        }
        
    }

    public returnToLastPosition() : void{
        const difx = this.position.x - this.last_position.x;
        const dify = this.position.y - this.last_position.y;
        this.position.set(this.last_position.x,this.last_position.y);
        this.movement.x += difx;  
        this.movement.y += dify;
    }

    public returnMovement() : Point{
        const aux_Point = new Point(this.movement.x,this.movement.y);
        this.movement.set(0,0);
        return aux_Point;
    }

    //CollisionType : [1 = objeto inamovible, 2 = objeto movible, 3 = objeto ]
    public CollisionDetected(overlap: Rectangle, CollisionType : number) {
        switch (CollisionType) {
            case 1:
                if(overlap.width < overlap.height){
                    if(this.movement.x < 0){
                        this.x -= overlap.width;
                        this.movement.x += overlap.width;
                    }else{
                        this.x += overlap.width;
                        this.movement.x -= overlap.width;
                    }
                }else{
                    if(this.movement.y < 0){
                        this.y -= overlap.height;
                        this.movement.y += overlap.height;
                    }else{
                        this.y += overlap.height;
                        this.movement.y -= overlap.height;
                    } 
                }
                break;
            default:
                break;
        }     
        
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

    public takeDamage(damage : number) : void{
        this.current_health -= damage;
        if(this.current_health <= 0){
            this.isDead = true;
        } 
    }

    public impactObjectAdder(obj : any) : void{
        this.addChild(obj);
    }

    public isHitteable(): Boolean {
        if(!this.isDead){
            return true;
        }
        return false;
    }

    public getActiveWeapon() : Weapon{
        return this.activeWeapon;
    }

    private rotateTowardMouse(mouse : any) : void {
        const globalCharacterPos = this.toGlobal(this.character.position);
        const dx = mouse.x - globalCharacterPos.x;
        const dy = mouse.y - globalCharacterPos.y;
        const rot = (Math.atan2(dy, dx)) + 3.14/2;
        this.character.rotation = rot;
        this.character_running.rotation = rot;
        this.character_lowHealth.rotation = rot; 
    }

    private changeAnimations(){
        for (let object of this.sprites_array){
            this.removeChild(object);
        }
        if(!this.isDead){
            if(this.current_health <= this.max_health * 0.25){
                this.addChild(this.character_lowHealth);
            }else if(!this.isRunning){
                this.addChild(this.character);
            }else{
                this.addChild(this.character_running);
            }
        }else{
            this.addChild(this.character_dead);
        }
        
        
    }

    public getHealth() : number{
        return this.current_health;
    }

    public getMaxHealth(): number {
        return this.max_health;
    }

    public getDead() : Boolean{
        return this.isDead;
    }
}