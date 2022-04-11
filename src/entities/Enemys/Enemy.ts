import { Container, Point, Sprite, Texture } from "pixi.js";


export class Enemy extends Container {
    private enemy_sprite : Sprite;
    private patrol_points : any;
    private onPatrol : Boolean;
    private speed : number;
    private detectionRadius : number;
    private currentPatrolPoint : Point;
    //private currentPatrolIndex : number;

    constructor(texture_name : Texture, detectionRadius : number){
        super();
        this.onPatrol = false;
        this.detectionRadius = detectionRadius;
        this.enemy_sprite = Sprite.from(texture_name);
        this.enemy_sprite.anchor.set(0.5);
        this.speed = 50;
        this.currentPatrolPoint = new Point(-1,-1);
        //this.currentPatrolIndex = 0;
        this.addChild(this.enemy_sprite);
    }

    public update(_deltaSeconds: number, _deltaFrame : number, playerPos : Point) {
        this.movimiento(playerPos, _deltaSeconds);
    }

    public createPatrolRoute(center : Point, radius : number, extra = 0) : void{
        const p1 = new Point(center.x - (radius/2),center.y - (radius/2))
        const p2 = new Point(center.x - (radius/2),center.y + (radius/2))
        const p3 = new Point(center.x + (radius/2),center.y - (radius/2))
        const p4 = new Point(center.x + (radius/2),center.y + (radius/2))
        this.patrol_points.push(p1);
        this.patrol_points.push(p2);
        this.patrol_points.push(p3);
        this.patrol_points.push(p4);
        for (let index = 0; index < extra; index++) {
            return;
        }
    }
    
    private movimiento(playerPos : Point, deltaTime : number) : void{
        this.rotateTowards(playerPos);
        this.moveTowards(playerPos, deltaTime);
        const distanceToPlayer = this.distanceTo(playerPos);
        if(distanceToPlayer <= this.detectionRadius){
            //this.rotateTowards(playerPos);
            //this.moveTowards(playerPos, deltaTime);
        }else if(this.onPatrol){
            this.moveTowards(this.currentPatrolPoint, deltaTime);
        }
        this.assingNextPatrolPoint();
    }

    private assingNextPatrolPoint() : void {
        //this.currentPatrolIndex++;
    }

    private moveTowards(objectPoint: Point, _deltaTime : number) : void {
        const rot = this.calculateRotationTo(objectPoint);
        //const distance = this.distanceTo(objectPoint);
        this.enemy_sprite.x = this.enemy_sprite.x + this.speed  * Math.cos(rot - 3.14/2) * _deltaTime;
	    this.enemy_sprite.y = this.enemy_sprite.y + this.speed  * Math.sin(rot - 3.14/2) * _deltaTime;    
    }

    private rotateTowards(objectPoint: Point) : void {
        const rot = this.calculateRotationTo(objectPoint);
        this.enemy_sprite.rotation = rot;
    }

    private calculateRotationTo(objectPoint : Point) : number{
        const globalEnemyPos = this.toGlobal(this.enemy_sprite.position);
        const distance_x = objectPoint.x - globalEnemyPos.x;
        const distance_y = objectPoint.y - globalEnemyPos.y;
        const rot = (Math.atan2(distance_y, distance_x)) + 3.14/2;
        return rot;
    }

    private distanceTo(objectPoint : Point) : number{
        const globalEnemyPos = this.toGlobal(this.enemy_sprite.position);
        const distance_x = objectPoint.x - globalEnemyPos.x;
        const distance_y = objectPoint.y - globalEnemyPos.y;
        const distanceToPlayer = Math.sqrt(Math.pow(distance_x,2) + Math.pow(distance_y,2));
        return distanceToPlayer;
    }
}
