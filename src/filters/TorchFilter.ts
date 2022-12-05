import { Container, filters, Graphics, Rectangle, SCALE_MODES, Sprite } from "pixi.js";
import { Tween } from "tweedle.js";
import { app } from "..";

/**
 * Simulates the light from a torch using Blur Filter
 */
export class TorchFilter extends Container {
    public orangeContainer : Container;
    public yellowContainer : Container;
    public radius: number; 
    public blurSize: number; 
    constructor(radius : number = 450, blursize : number = 250){
        super();
        this.radius = radius;
        this.blurSize = blursize;
        this.orangeContainer = new Container();
        this.yellowContainer = new Container();
        const dim = (this.radius + this.blurSize);
        this.addChild(this.orangeContainer,this.yellowContainer);
        const circleOrange = new Graphics();
        const circleYellow = new Graphics();
        circleOrange.beginFill(0xff781f,0.1);
        circleOrange.drawCircle(0,0, this.radius);
        circleOrange.endFill();

        circleOrange.beginHole();
        circleOrange.drawCircle(0,0, this.radius/4);
        circleOrange.endHole();

        circleYellow.beginFill(0xcccc33,0.3);
        circleYellow.drawCircle(0,0, this.radius/1.6);
        circleYellow.endFill();

        circleYellow.beginHole();
        circleYellow.drawCircle(0,0, this.radius/4);
        circleYellow.endHole();
        
        circleOrange.filters = [new filters.BlurFilter(this.blurSize,10,1,15)];
        circleYellow.filters = [new filters.BlurFilter(150,10,1,15)];

        circleOrange.position.set(dim,dim);
        circleYellow.position.set(dim,dim);
        const bounds = new Rectangle(0,0, dim*2, dim*2);
        const textureOrange = app.renderer.generateTexture(circleOrange,{scaleMode:SCALE_MODES.NEAREST,resolution:1,region:bounds});
        const textureYellow = app.renderer.generateTexture(circleYellow,{scaleMode:SCALE_MODES.NEAREST,resolution:1,region:bounds});

        const focusO = new Sprite(textureOrange);
        const focusY = new Sprite(textureYellow);

        focusO.anchor.set(0.5);
        focusY.anchor.set(0.5);

        this.yellowContainer.addChild(focusY);
        this.orangeContainer.addChild(focusO);

        new Tween(focusO.scale).to({ x: 1.1, y: 1.1 }, 700).repeat(Infinity).yoyo(true).start();
        new Tween(focusY.scale).to({ x: 1.1, y: 1.1 }, 750).repeat(Infinity).yoyo(true).start();
        /*new Tween(this.orangeContainer).to(0, 2000).repeat(Infinity).yoyo(true).start().onRepeat( () =>
            new Tween(this.orangeContainer).to({alpha: 0}, 300).repeat(1).yoyo(true).start()
        );
        new Tween(this.yellowContainer).to({alpha : 0}, 200).repeat(Infinity).yoyo(true).start();*/

    }
}