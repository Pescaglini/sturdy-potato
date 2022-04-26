import { AnimatedSprite, Container, Graphics, IDestroyOptions, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { HEIGHT, WIDTH } from "../..";
import { IHitbox } from "../../utils/IHitbox";
import { Keyboard } from "../../utils/Keyboard";
import { Weapon } from "../Weapons/Weapon";

export class Player extends Container implements IHitbox {
    
    
    private character : Sprite;
    private character_running : AnimatedSprite;
    private isRunning : boolean;
    private activeWeapon : Weapon;
    private hitBox : Graphics;
    private movement : Point;

    constructor(){
        super();
        this.position.set(WIDTH/2,HEIGHT/2);
        this.character = Sprite.from("archer_stand");
        this.character.anchor.set(0.5);
        this.character.scale.set(1.5);
        this.character_running = new AnimatedSprite([
            Texture.from("archer_running_1"),
            Texture.from("archer_running_2"),
            Texture.from("archer_running_3"),
            Texture.from("archer_running_4")   
        ], true
        );
        this.character_running.anchor.set(0.5);
        this.character_running.scale.set(1.5);
        this.character_running.play();
        this.character_running.animationSpeed = 0.2;

        this.hitBox = new Graphics();
        this.hitBox.beginFill(0xFF00FF,0.3);
        this.hitBox.drawRect(0,0,60,60);
        this.hitBox.position.set(-30,-30);

        this.movement = new Point(0,0);

        this.activeWeapon = new Weapon(Texture.from("arrow_1"), 30);

        this.isRunning = false;

        this.addChild(this.hitBox);
        this.addChild(this.character);
    }

    public override destroy(options?: boolean | IDestroyOptions): void {
        super.destroy(options);
    }

    public update(_deltaFrame: number, deltaSeconds : number, mousePos : any) {
        this.setStateAnimations();
        this.changeRunningAnimation();
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
        //Accumulo el movimiento del personaje para saber cuanto tiene que moverse el mundo.
        if(Keyboard.state.get("KeyA")){
            this.position.x -= 400 * deltaSeconds;
            this.movement.x += 400 * deltaSeconds;
         }
         if(Keyboard.state.get("KeyD")){
             this.position.x += 400 * deltaSeconds;
             this.movement.x += -400 * deltaSeconds
         }
         if(Keyboard.state.get("KeyW")){
             this.position.y -= 400 * deltaSeconds;
             this.movement.y += 400 * deltaSeconds;
         }
         if(Keyboard.state.get("KeyS")){
             this.position.y += 400 * deltaSeconds;
             this.movement.y += -400 * deltaSeconds;
         }
    }

    public returnMovement() : Point{
        const aux_Point = new Point(this.movement.x,this.movement.y);
        this.movement.set(0,0);
        return aux_Point;
    }

    public CollisionRestrictions(overlap: Rectangle) {
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
    }

    public getHitbox() : Rectangle{
        return this.hitBox.getBounds()
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
    }

    private changeRunningAnimation(){
        if(!this.isRunning){
            this.addChild(this.character);
            this.removeChild(this.character_running);
        }else{
            this.addChild(this.character_running);
            this.removeChild(this.character);
        }
    }

    
}