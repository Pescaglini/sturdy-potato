import { Circle, Graphics, Sprite, Texture } from "pixi.js";
import { Interpolation, Tween } from "tweedle.js";
import { Player } from "../entities/Character/Player";
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
            new Tween(this.leaves).to({alpha : 0.5},300).interpolation(Interpolation.Color.RGB).start();
        }else{
            new Tween(this.leaves).to({alpha : 1},200).interpolation(Interpolation.Color.RGB).start();
        }
    }

    private randomRotation() : void{
        this.spriteContainer.rotation = Math.random() * Math.PI * 2;
    }

    public isUnderTree(player : Player) : boolean{
        const minColisionDistance = player.getHitCircle_Rad() + this.leavesCircle.radius;
        const objectsDistance_X = Math.abs(player.position.x - this.position.x); 
        const objectsDistance_Y = Math.abs(player.position.y - this.position.y); 
        const objectsDistance = Math.sqrt(Math.pow(objectsDistance_X,2) + Math.pow(objectsDistance_Y,2));
        if(minColisionDistance >= objectsDistance){
            this.underTree = true;
        }else{
            this.underTree = false;
        }
        return this.underTree;
    }

}