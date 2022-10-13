import { Container, Graphics, Point } from "pixi.js";
import { HEIGHT, WIDTH } from "..";
import { IHitbox } from "../utils/IHitbox";

export class Shadows extends Container{
    private line: Graphics = new Graphics();
    private recGraphs: Graphics = new Graphics();
    private grafWindow: Graphics = new Graphics();
    private rectangles: Array<IHitbox>;
    private minT1: number;

    constructor(recArray : Array<IHitbox>){
        super();
        this.rectangles = recArray;

        this.grafWindow.lineStyle(6, 0x0000ff);
        this.grafWindow.drawRect(0,0,WIDTH,HEIGHT);
        this.grafWindow.position.set(-WIDTH/2,-HEIGHT/2)
        this.grafWindow.endFill();

        this.addChild(this.grafWindow);
        this.addChild(this.recGraphs);
        this.addChild(this.line);
        this.minT1 = Infinity;
    }

    private checkAgainstSquares(point : Point): void{
        this.minT1 = WIDTH*2;
        for (let index = 0; index < this.rectangles.length; index++) {
            const globalRec = this.rectangles[index].getHitbox();
            const rec = this.toLocal(globalRec);
            this.checkAgainstLine(point.x,point.y,rec.x,rec.y,0,globalRec.height);
            this.checkAgainstLine(point.x,point.y,rec.x,rec.y + globalRec.height,globalRec.width,0);
            this.checkAgainstLine(point.x,point.y,rec.x+globalRec.width,rec.y+ globalRec.width,0,-globalRec.height);
            this.checkAgainstLine(point.x,point.y,rec.x+globalRec.width,rec.y,-globalRec.width,0);
        }
        this.checkAgainstBorder(point);
        this.drawLineDebug(point);
    }

    private checkAgainstBorder(point : Point): void{
        //const rec = this.toLocal(this.grafWindow);
        //point = this.toLocal(point)
        console.log(this.grafWindow.x,point.x)
        this.checkAgainstLine(point.x,point.y,this.grafWindow.x,this.grafWindow.y,0,this.grafWindow.height);
        this.checkAgainstLine(point.x,point.y,this.grafWindow.x,this.grafWindow.y + this.grafWindow.height,this.grafWindow.width,0);
        this.checkAgainstLine(point.x,point.y,this.grafWindow.x+this.grafWindow.width,this.grafWindow.y+ this.grafWindow.width,0,-this.grafWindow.height);
        this.checkAgainstLine(point.x,point.y,this.grafWindow.x+this.grafWindow.width,this.grafWindow.y,-this.grafWindow.width,0);
    }

    private checkAgainstLine(r_dx : number, r_dy : number, s_px : number, s_py : number,s_dx : number, s_dy : number ): void{
        const T2 = (r_dx*(s_py-0) + r_dy*(0-s_px))/(s_dx*r_dy - s_dy*r_dx)
        const T1 = (s_px+s_dx*T2-0)/r_dx
        if(T1 > 0 && T2 <= 1 && T2 >= 0 && T1 <= this.minT1){
            this.minT1 = T1;
        }
    }

    private drawLineDebug(point: Point): void{
        this.line.beginFill();
        this.line.moveTo(0,0);
        this.line.lineStyle(3, 0x00aadff);
        this.line.drawCircle(point.x * this.minT1,point.y * this.minT1, 10);
        this.line.endFill();
    }

    public update(): void{

        // Drawing
        this.line.clear();
        this.recGraphs.clear();
        for (let index = 0; index < this.rectangles.length; index++) {
            const globalRec = this.rectangles[index].getHitbox();
            const rec = this.toLocal(globalRec);

            this.recGraphs.beginFill(3, 0x00ffaa);
            this.recGraphs.drawRect(rec.x,rec.y,globalRec.width,globalRec.height);
            this.recGraphs.endFill();   

            this.checkAgainstSquares(new Point(rec.x,rec.y));
            this.checkAgainstSquares(new Point(rec.x+globalRec.width,rec.y));
            this.checkAgainstSquares(new Point(rec.x,rec.y+globalRec.height));
            this.checkAgainstSquares(new Point(rec.x+globalRec.width,rec.y+globalRec.height));

            this.line.beginFill();
            this.line.lineStyle(3, 0xff0000);
            this.line.moveTo(0,0);
            this.line.lineTo(rec.x,rec.y);
            this.line.moveTo(0,0);
            this.line.lineTo(rec.x, rec.y + globalRec.height);
            this.line.moveTo(0,0);
            this.line.lineTo(rec.x + globalRec.width, rec.y);
            this.line.moveTo(0,0);
            this.line.lineTo(rec.x + globalRec.width, rec.y + globalRec.height);
            this.line.endFill();
        }
    }

}