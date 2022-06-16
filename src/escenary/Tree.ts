import { Circle, Graphics, Sprite, Texture } from "pixi.js";
import { FarmeableObject } from "./FarmeableObject";




export class Tree extends FarmeableObject{

    private leaves : Sprite;
    private logs : Sprite;
    private leaves_graph : Graphics;
    private leavesCircle: Circle;
    private underTree : boolean;


    constructor(texture : Texture, max_health : number){
        super(max_health);
        this.leaves_graph = new Graphics();
        this.leaves_graph.beginFill(0x00AAAA,1);
        this.leaves_graph.drawCircle(0,0,110);
        this.leavesCircle = new Circle(0,0,110);
        this.leaves = new Sprite(texture);
        this.leaves.anchor.set(0.5);
        this.leaves.scale.set(2);
        this.leaves.position.x = -10;
        this.leaves.alpha = 1;
        this.logs = new Sprite(Texture.from("treeLogs"));
        this.logs.anchor.set(0.5);
        this.logs.scale.set(2.5,2);
        this.logs.alpha = 1;
        this.underTree = false;
        this.spriteContainer.addChild(this.logs);
        this.spriteContainer.addChild(this.leaves);
        this.randomRotation();
    }

    public override update() : void{
        super.update();
        if(this.underTree){
            this.leaves.alpha = 0.5;
        }else{
            this.leaves.alpha = 1;
        }
    }

    private randomRotation() : void{
        this.spriteContainer.rotation = Math.random() * Math.PI * 2;
    }

    public getleavesCircle(): Circle {
        return this.leavesCircle;
    }

}