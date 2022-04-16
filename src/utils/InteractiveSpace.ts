import { Container, Sprite, Texture } from "pixi.js"

export class InteractiveSpace extends Container{
    private space : Sprite;
    private callback : Function;
    constructor(callback: Function){
        super();
        this.callback = callback;
        this.space = new Sprite(Texture.from("interactive_background"));
        this.space.interactive = true;
        this.space.on("mousedown",this.onMouseDown,this);
        this.space.on("mouseup",this.onMouseUp,this);
        this.addChild(this.space);
    }
    private onMouseUp(): void {
        console.log("mouse up");
        this.callback();
    }
    private onMouseDown(): void {
        console.log("mouse Down");
    }
    
}