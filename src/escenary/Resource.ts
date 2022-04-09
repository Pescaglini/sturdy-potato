import { Container, Sprite, Texture } from "pixi.js";

export class Resource extends Container{
    private resourceSprite : Sprite;
    constructor(texture_name : Texture){
        super();
        this.resourceSprite = Sprite.from(texture_name);
        this.addChild(this.resourceSprite);
    }
}