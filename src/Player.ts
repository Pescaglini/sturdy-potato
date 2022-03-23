import { Container, Sprite } from "pixi.js";

export class Player extends Container {
    constructor(){
        super();
        
        const character: Sprite = Sprite.from("myCharacter");
        this.addChild(character);
    }
}