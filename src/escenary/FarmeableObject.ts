import { Container, Sprite, Texture } from "pixi.js";

export class FarmeableObject extends Container{
    private resourceSprite : Sprite;
    constructor(texture_name : Texture, scale_value = 1, alpha_value = 1){
        super();
        this.resourceSprite = Sprite.from(texture_name);
        this.resourceSprite.position.set(500,300);
        this.resourceSprite.alpha = alpha_value;
        this.resourceSprite.anchor.set(0.5);
        this.resourceSprite.scale.set(scale_value);
        this.addChild(this.resourceSprite);
    }
}