import { AnimatedSprite, Container, Sprite, Texture } from "pixi.js";
import { Keyboard } from "../../utils/Keyboard";

export class Player extends Container {
    
    
    private character : Sprite;
    private character_running : AnimatedSprite;
    private isRunning : boolean;

    constructor(){
        super();
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

        this.isRunning = false;
        
    }

    public update(_deltaFrame: number, mousePos : any) {
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
        this.changeRunningAnimation();
        this.rotateTowardMouse(mousePos);
    }

    public rotateTowardMouse(mouse : any) : void {
        const globalCharacterPos = this.toGlobal(this.character.position);
        const dx = mouse.x - globalCharacterPos.x;
        const dy = mouse.y - globalCharacterPos.y;
        const rot = (Math.atan2(dy, dx)) + 3.14/2;
        this.character.rotation = rot;
        this.character_running.rotation = rot;
    }
    public changeRunningAnimation(){
        if(!this.isRunning){
            this.addChild(this.character);
            this.removeChild(this.character_running)
        }else{
            this.addChild(this.character_running);
            this.removeChild(this.character)
        }
    }
}