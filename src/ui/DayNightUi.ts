import { Container, Graphics, Sprite } from "pixi.js";
import { Tween } from "tweedle.js";
import { eventTypesEnum } from "../dictionary/Dictionary";

export class DayNightUi extends Container{
    private dayTime: number;
    private nightTime: number;
    private currentTime: number;
    private day : boolean;
    private sun: Sprite;
    private moon: Sprite;
    private sky: Sprite;
    private rot: number;
    private rotRadius: number;
    constructor(rotRadius: number){
        super();
        this.day = true;
        this.dayTime = 0.2;
        this.nightTime = 0.2;
        this.currentTime = this.dayTime * 60;
        this.rot = Math.PI;
        this.rotRadius = rotRadius;

        const sunAndMoonContainer = new Container();
        this.addChild(sunAndMoonContainer);

        this.sun = Sprite.from("sun");
        this.sun.anchor.set(0.5,0.5);
        sunAndMoonContainer.addChild(this.sun);
        this.moon = Sprite.from("moon");
        this.moon.anchor.set(0.5,0.5);
        sunAndMoonContainer.addChild(this.moon);

        const circle = new Graphics();
        circle.beginFill(0xff0000,1)
        circle.drawCircle(0,0,rotRadius - 20);
        circle.endFill();
        this.addChild(circle);

        this.sky = Sprite.from("sky");
        this.sky.anchor.set(0.5,0.5);
        this.sky.scale.set(1.5,1.5);
        this.addChild(this.sky);

        const forest = Sprite.from("forest");
        forest.anchor.set(0.5,0.5);
        this.addChild(forest);
        forest.mask = circle;

        const rectangle = new Graphics();
        rectangle.beginFill(0xff0000)
        rectangle.drawRect(-rotRadius * 2,-rotRadius * 2,rotRadius * 4,rotRadius * 2);
        rectangle.endFill();
        this.addChild(rectangle);
        sunAndMoonContainer.mask = rectangle;

        const info= new Graphics();
        info.beginFill(0xffff00)
        info.drawRect(-rotRadius * 1.2,0,rotRadius * 2.4,rotRadius * 1);
        info.endFill();
        this.addChild(info);

        new Tween(this).to({rot : Math.PI * 2 }, this.currentTime * 1000).start();

    }
    public update(dt: number): void{
        this.currentTime -= dt;
        if(this.currentTime <= 0){
            this.day = !this.day;
            this.currentTime = this.day ? this.dayTime * 60 : this.nightTime * 60;
            if(this.day){
                this.emit(eventTypesEnum.DayStarts);
            }else{
                this.emit(eventTypesEnum.NightStarts);
            }
            if(this.day){
                this.rot = Math.PI;
                new Tween(this).to({rot : Math.PI * 2 }, this.currentTime * 1000).start();
            }else{
                this.rot = Math.PI * 2;
                new Tween(this).to({rot : Math.PI * 3 }, this.currentTime * 1000).start();
            }
           
        }
        this.sun.x =  this.rotRadius  * Math.cos(this.rot);
	    this.sun.y =  this.rotRadius  * Math.sin(this.rot);
        this.moon.x =  -this.rotRadius  * Math.cos(this.rot);
	    this.moon.y =  -this.rotRadius  * Math.sin(this.rot);
        this.sky.rotation = -this.rot + Math.PI *1.5;
    }
}