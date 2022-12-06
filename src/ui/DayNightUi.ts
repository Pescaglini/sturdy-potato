import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Tween } from "tweedle.js";
import { eventTypesEnum } from "../dictionary/Dictionary";

export class DayNightUi extends Container{
    private dayTime: number;
    private nightTime: number;
    private currentTime: number;
    private day : boolean;
    private text : Text;
    private sun: Sprite;
    private rot: number;
    private rotRadius: number;
    constructor(rotRadius: number){
        super();
        this.day = false;
        this.dayTime = 0.1;
        this.nightTime = 0.1;
        this.currentTime = this.nightTime * 60;
        this.rot = Math.PI;
        this.rotRadius = rotRadius;

        const shape = new Graphics();
        shape.beginFill(0x00fff0,1);
        shape.drawCircle(0,0,rotRadius);
        shape.endFill();
        this.addChild(shape);

        this.sun = Sprite.from("sun");
        this.sun.anchor.set(0.5,0.5);
        this.addChild(this.sun);

        this.text = new Text(60,{fontSize: 20,fill: "white", stroke: 0x000000, strokeThickness: 3});
        this.text.anchor.set(0.5,0.5)
        this.addChild(this.text);

    }
    public update(dt: number): void{
        this.currentTime -= dt;
        if(this.currentTime <= 0){
            this.currentTime = this.day ? this.dayTime * 60 : this.nightTime * 60;
            this.day = !this.day;
            if(this.day){
                this.emit(eventTypesEnum.DayStarts);
            }else{
                this.emit(eventTypesEnum.NightStarts);
            }
            new Tween(this.rot).to({this : {rot:Math.PI * 2} }, this.currentTime * 1000).start().onComplete(()=>{
                this.rot = Math.PI;
            })
           
        }
        console.log(this.rot);
        this.text.text = this.currentTime.toFixed(2) + " " + this.day;
        this.sun.x =  this.rotRadius  * Math.cos(this.rot);
	    this.sun.y =  this.rotRadius  * Math.sin(this.rot);
    }
}