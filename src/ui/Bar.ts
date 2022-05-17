import { Container, NineSlicePlane, Texture } from "pixi.js";



export class Bar extends Container{
    private value : number;
    private max_value : number;
    private bar : NineSlicePlane;
    private outBar : NineSlicePlane;
    private bar_mult : number;
    constructor(value : number, max_value : number, bar_mult : number, texture : Texture){
        super();
        this.value = value;
        this.max_value = max_value;
        this.bar_mult = bar_mult;
        this.bar = new NineSlicePlane(
            texture,
            14,14,14,14
        );
        this.outBar = new NineSlicePlane(
            Texture.from("outBar"),
            14,14,14,14
        );
        this.bar.width = value * this.bar_mult + 1;
        this.outBar.width = value * this.bar_mult + 1;
        this.addChild(this.bar);
        this.addChild(this.outBar);
    }
    
    public update(value : number) : void{
        this.value = value;
        if(value > this.max_value){
             this.value = this.max_value;
        }
        if(value <= 0){
            this.value = 1;
        }
        this.bar.width = this.value * this.bar_mult + 1;
    }

    public setValue(value : number) : void{
        this.value = value;
    }

}