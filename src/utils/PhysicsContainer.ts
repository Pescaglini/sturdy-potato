import { Container, Point } from "pixi.js";
import { Keyboard } from "./Keyboard";

export class PhysicsContainer extends Container{

    public speed : Point = new Point();
    public aceleration : Point = new Point();
    public isPlayer : Boolean;

    constructor(){
        super();
        this.isPlayer = false;
        this.speed.x = 0;
        this.speed.y = 0;
        this.aceleration.x = 0;
        this.aceleration.y = 0;
    }

    public update(deltaSeconds: number){

        this.position.x = this.position.x + this.speed.x * deltaSeconds + (1/2) * this.aceleration.x * Math.pow(deltaSeconds,2);
        this.position.y = this.position.y + this.speed.y * deltaSeconds + (1/2) * this.aceleration.y * Math.pow(deltaSeconds,2);

        this.speed.x = this.speed.x + this.aceleration.x * deltaSeconds;
        this.speed.y = this.speed.y + this.aceleration.y * deltaSeconds;

        if(this.isPlayer){
            this.playerController(deltaSeconds);
        }

    }

    public activatePlayerControl(act : Boolean){
        this.isPlayer = act;
    }

    private playerController(deltaSeconds : number){
        if(Keyboard.state.get("KeyA")){
            this.position.x -= 400 * deltaSeconds;
        }
        if(Keyboard.state.get("KeyD")){
            this.position.x += 400 * deltaSeconds;
        }
        if(Keyboard.state.get("KeyW")){
            this.position.y -= 400 * deltaSeconds;
        }
        if(Keyboard.state.get("KeyS")){
            this.position.y += 400 * deltaSeconds;
        }
    }
}