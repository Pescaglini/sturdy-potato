import { Container, filters, Graphics, Rectangle, SCALE_MODES, Sprite } from "pixi.js";
import { app, HEIGHT, WIDTH } from "..";




export class ObscureFilter extends Container{
    public focus: Sprite;
    constructor(){
        super();
        const darkGraphics = new Graphics();
        darkGraphics.beginFill(0xffffff,0.2);
        darkGraphics.drawRect(0,0,WIDTH,HEIGHT);
        darkGraphics.endFill();
        this.addChild(darkGraphics);
        let radius = 550;
        let blurSize = 250;
        const circle = new Graphics();
        circle.beginFill(0xff0000,1);
        circle.drawCircle(radius + blurSize, radius + blurSize, radius);
        circle.endFill();

        circle.filters = [new filters.BlurFilter(blurSize)];
        const bounds = new Rectangle(0,0, (radius + blurSize) * 2, (radius + blurSize) * 2);
        const texture = app.renderer.generateTexture(circle,{scaleMode:SCALE_MODES.NEAREST,resolution:1,region:bounds});
        this.focus = new Sprite(texture);
        this.focus.anchor.set(0.5);
        this.focus.position.set(WIDTH/2,HEIGHT/2)
        this.mask = this.focus;
        this.addChild(this.focus);
    }

}