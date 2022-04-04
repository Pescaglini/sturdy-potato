import { Container, Sprite } from "pixi.js";

export class Player extends Container {
    private character : Sprite;
    constructor(){
        super();
        this.character = Sprite.from("myCharacter");
        this.character.anchor.set(0.5);
        this.addChild(this.character);
    }
    public rotateTowardMouse(mouse : any) : void {
        const globalCharacterPos = this.toGlobal(this.character.position)
        const dx = mouse.x - globalCharacterPos.x;
        const dy = mouse.y - globalCharacterPos.y;
        const rot = (Math.atan2(dy, dx)) + 3.14/2;
        this.character.rotation = rot;
    }
}