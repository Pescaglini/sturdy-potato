import { Container, Graphics, IPointData, Point, Polygon } from "pixi.js";
import { HEIGHT, WIDTH } from "..";
import { IHitbox } from "../utils/IHitbox";

export class Shadows extends Container{
    private line: Graphics;
    private recGraphs: Graphics;
    private grafWindow: Graphics;
    public polygons: Graphics;
    private rectangles: Array<IHitbox>;
    private trianglePoints: Array<IPointData>;
    private minT1: number;
    private debug: boolean;

    constructor(recArray : Array<IHitbox>){
        super();
        this.line = new Graphics();
        this.recGraphs = new Graphics();
        this.grafWindow = new Graphics();
        this.polygons = new Graphics();
        this.rectangles = recArray;
        this.trianglePoints = new Array<IPointData>();
        this.debug = false;

        this.grafWindow.lineStyle(6, 0x0000ff,0);
        this.grafWindow.drawRect(0,0,WIDTH,HEIGHT);
        this.grafWindow.position.set(-WIDTH/2,-HEIGHT/2)
        this.grafWindow.endFill();

        this.addChild(this.polygons);
        //this.addChild(this.grafWindow);
        //this.addChild(this.recGraphs);
        //this.addChild(this.line);
        this.minT1 = Infinity;
    }

    

    private checkRectangle(x: number, y: number, width: number, height: number,): void{
        const offset = 2;
        this.checkAgainstSquares(new Point(x,y));
        this.checkAgainstSquares(new Point(x+offset,y+offset));
        this.checkAgainstSquares(new Point(x-offset,y-offset));
        this.checkAgainstSquares(new Point(x+width,y));
        this.checkAgainstSquares(new Point(x+width+offset,y+offset));
        this.checkAgainstSquares(new Point(x+width-offset,y-offset));
        this.checkAgainstSquares(new Point(x,y+height));
        this.checkAgainstSquares(new Point(x-offset,y+height-offset));
        this.checkAgainstSquares(new Point(x+offset,y+height+offset));
        this.checkAgainstSquares(new Point(x+width,y+height));
        this.checkAgainstSquares(new Point(x+width+offset,y+height+offset));
        this.checkAgainstSquares(new Point(x+width-offset,y+height-offset));
        if(this.debug){
            this.line.beginFill();
            this.line.lineStyle(3, 0xff0000);
            this.line.moveTo(0,0);
            this.line.lineTo(x,y);
            this.line.moveTo(0,0);
            this.line.lineTo(x, y + height);
            this.line.moveTo(0,0);
            this.line.lineTo(x + width, y);
            this.line.moveTo(0,0);
            this.line.lineTo(x + width, y + height);
            this.line.endFill();
        }
        
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
            this.checkAgainstBorder(point);
        }
        this.drawLineDebug(point);
    }

    private checkAgainstBorder(point : Point): void{
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
        if(this.debug){
            this.line.beginFill();
            this.line.moveTo(0,0);
            this.line.lineStyle(3, 0x00aadff);
            this.line.drawCircle(point.x * this.minT1,point.y * this.minT1, 10);
            this.line.endFill();    
        }
        this.trianglePoints.push({x: point.x * this.minT1, y: point.y * this.minT1})
    }

    public update(): void{

        // Drawing
        this.line.clear();
        this.recGraphs.clear();
        this.trianglePoints.splice(0);
        for (let index = 0; index < this.rectangles.length; index++) {
            const globalRec = this.rectangles[index].getHitbox();
            const rec = this.toLocal(globalRec);

            if(rec.x < WIDTH/2  && rec.x > -WIDTH/2  && rec.y < HEIGHT/2  && rec.y > -HEIGHT/2  ){
                this.checkRectangle(rec.x,rec.y,globalRec.width,globalRec.height);
            }

            //Checkear si el quad esta dentro de minimamente en pantalla [Implementar]

            if(this.debug){
                this.recGraphs.beginFill(3, 0x00ffaa);
                this.recGraphs.drawRect(rec.x,rec.y,globalRec.width,globalRec.height);
                this.recGraphs.endFill();   
            }

            
        }
        // Checking Window border Box agains every other box
        this.checkRectangle(this.grafWindow.x,this.grafWindow.y,this.grafWindow.width,this.grafWindow.height);


        // Sort polygon point clockwise using angle
        
        this.trianglePoints.sort((a,b) => ((Math.atan2(a.y, a.x)) + 3.14/2) - ((Math.atan2(b.y, b.x)) + 3.14/2));

        //Drawing Polygons
        this.polygons.clear();
        for (let index = 0; index < this.trianglePoints.length - 1; index++) {
            const p1 = this.trianglePoints[index];
            const p2 = this.trianglePoints[index + 1];
            const poly: Polygon = new Polygon([
                {x: 0, y: 0},
                {x: p1.x, y: p1.y},
                {x: p2.x, y: p2.y}
            ])
            this.polygons.beginFill(0x000000,1);
            this.polygons.drawPolygon(poly);
            this.polygons.endFill();
        }
        const p1 = this.trianglePoints[this.trianglePoints.length-1];
        const p2 = this.trianglePoints[0];
        const poly: Polygon = new Polygon([
            {x: 0, y: 0},
            {x: p1.x, y: p1.y},
            {x: p2.x, y: p2.y}
        ])
        this.polygons.beginFill(0x000000,1);
        this.polygons.drawPolygon(poly);
        this.polygons.endFill();
    }

}