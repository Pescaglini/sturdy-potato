import { Container, filters, Graphics, Polygon, Rectangle, SCALE_MODES, Sprite } from "pixi.js";
import { app, HEIGHT, WIDTH } from "..";




export class ObscureFilter extends Container{
    private conicVision: Graphics;
    private focus: Sprite;
    constructor(container : Container){
        super();
        const darkGraphics = new Graphics();
        darkGraphics.beginFill(0x000000);
        darkGraphics.alpha = 0.8
        darkGraphics.drawRect(0,0,WIDTH,HEIGHT);
        darkGraphics.endFill();
        this.addChild(darkGraphics);
        let radius = 550;
        let blurSize = 250;
        const circle = new Graphics();
        circle.beginFill(0xFF0000);
        circle.drawCircle(radius + blurSize, radius + blurSize, radius);
        circle.endFill();

        circle.filters = [new filters.BlurFilter(blurSize)];
        const bounds = new Rectangle(0,0, (radius + blurSize) * 2, (radius + blurSize) * 2);
        const texture = app.renderer.generateTexture(circle,{scaleMode:SCALE_MODES.NEAREST,resolution:1,region:bounds});
        this.focus = new Sprite(texture);
        this.focus.anchor.set(0.5);
        this.focus.position.set(WIDTH/2,HEIGHT/2)
        this.addChild(this.focus);

        this.conicVision = new Graphics();
        this.conicVision.beginFill(0xFF0000);
        const poly : Polygon = new Polygon([
            {x:WIDTH/2,y:HEIGHT/2},
            {x:WIDTH/2 - 150,y:HEIGHT/2 - 500},
            {x:WIDTH/2 + 150,y:HEIGHT/2 - 500},
            {x:WIDTH/2,y:HEIGHT/2},
            {x:0,y:0},
            {x:0,y:WIDTH},
            {x:WIDTH,y:WIDTH},
            {x:WIDTH,y:0},
            {x:0,y:0},
        ]);
        this.conicVision.pivot.set(WIDTH/2,HEIGHT/2);
        this.conicVision.drawPolygon(poly);
        this.conicVision.endFill();
        //this.addChild(this.conicVision);
        //this.mask = this.conicVision;

        container.mask = this.focus;
    }

    public update(): void{
       
    }

    



}