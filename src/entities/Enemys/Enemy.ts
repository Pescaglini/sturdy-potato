import { Container, Graphics, Point, Sprite, Texture } from "pixi.js";


export class Enemy extends Container {
    private enemy_sprite : Sprite;
    private patrol_points :  Array<Point>;
    private currentPatrolPoint : Point;
    private currentPatrolIndex : number;
    private onPatrol : Boolean;
    private isPlayerDetected : Boolean;
    private speed : number;
    private detectionRadius : number;
    private debuggin : Boolean;

    constructor(texture_name : Texture, detectionRadius : number){
        super();
        this.onPatrol = false;
        this.debuggin = true;
        this.isPlayerDetected = false;
        this.detectionRadius = detectionRadius;
        this.enemy_sprite = Sprite.from(texture_name);
        this.enemy_sprite.anchor.set(0.5);
        this.speed = 100;
        this.patrol_points = new Array<Point>();
        this.currentPatrolIndex = -1;
        this.currentPatrolPoint = new Point(-1,-1);
        this.addChild(this.enemy_sprite);

        if(this.debuggin){
            const detectionCircle = new Graphics();
            detectionCircle.beginFill(0x000000,0.1);
            detectionCircle.drawCircle(this.enemy_sprite.position.x,this.enemy_sprite.position.y,detectionRadius);
            detectionCircle.endFill();
            this.addChild(detectionCircle);
            this.enemy_sprite.addChild(detectionCircle);
        }
    }

    public update(_deltaSeconds: number, _deltaFrame : number, playerPos : Point) {
        this.detections(playerPos);
        this.movimiento(playerPos, _deltaSeconds);
    }

    public createPatrolRoute(center : Point, radius : number, _extra = 0) : void{
        const p1 = new Point(center.x - (radius),center.y + (radius));
        const p2 = new Point(center.x - (radius),center.y - (radius));
        const p3 = new Point(center.x + (radius),center.y - (radius));
        const p4 = new Point(center.x + (radius),center.y + (radius));
        this.patrol_points.push(p1);
        this.patrol_points.push(p2);
        this.patrol_points.push(p3);
        this.patrol_points.push(p4);
        this.assingNextPatrolPoint();
        this.onPatrol = true;
    }
    
    private detections(playerPos : Point){
        const distanceToPlayer = this.distanceTo(playerPos);
        if(distanceToPlayer <= this.detectionRadius){
            this.isPlayerDetected = true;
        }
        if(distanceToPlayer > (this.detectionRadius + 100)){
            this.isPlayerDetected = false;
            this.onPatrol = true;
        }
        if(this.onPatrol){
            const disntanceToPatrolPoint = this.distanceTo(this.currentPatrolPoint);
            if(disntanceToPatrolPoint < 5){
                this.assingNextPatrolPoint();
            }
        }

    }

    private movimiento(playerPos : Point, deltaTime : number) : void{
        if(this.isPlayerDetected){
            this.rotateTowards(playerPos);
            this.moveTowards(playerPos, deltaTime);
        }else if(this.onPatrol){
            this.rotateTowards(this.currentPatrolPoint);
            this.moveTowards(this.currentPatrolPoint, deltaTime);
        }
    }

    private assingNextPatrolPoint() : void {
        this.currentPatrolIndex++;
        if(this.currentPatrolIndex >= this.patrol_points.length){
            this.currentPatrolIndex = 0;
        }
        this.currentPatrolPoint = this.patrol_points[this.currentPatrolIndex];
    }

    private moveTowards(objectPoint: Point, _deltaTime : number) : void {
        const rot = this.calculateRotationTo(objectPoint);
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
        const distanceToPlayer = Math.sqrt((Math.pow(distance_x,2) + Math.pow(distance_y,2)))/2;
        return distanceToPlayer;
    }
}
