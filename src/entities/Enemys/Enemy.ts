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
    private patrol_timer : number;
    private isWaiting : Boolean;

    private patrolRouteDebug : Graphics;

    constructor(texture_name : Texture, detectionRadius : number, startPosition : Point){
        super();
        this.onPatrol = false;
        this.debuggin = true;
        this.isPlayerDetected = false;
        this.isWaiting = false;
        this.detectionRadius = detectionRadius;
        this.patrol_timer = 0;
        this.enemy_sprite = Sprite.from(texture_name);
        this.enemy_sprite.anchor.set(0.5);
        this.enemy_sprite.scale.set(2);
        this.speed = 150;
        this.patrol_points = new Array<Point>();
        this.currentPatrolIndex = -1;
        this.position.set(startPosition.x,startPosition.y);
        this.currentPatrolPoint = startPosition;
        this.addChild(this.enemy_sprite);

        this.patrolRouteDebug = new Graphics();
        if(this.debuggin){
            const detectionCircle = new Graphics();
            detectionCircle.beginFill(0x000000,0.1);
            detectionCircle.drawCircle(this.enemy_sprite.position.x,this.enemy_sprite.position.y,detectionRadius);
            detectionCircle.endFill();
            this.addChild(detectionCircle);
            this.enemy_sprite.addChild(detectionCircle);
        }
    }

    public update(deltaSeconds: number, _deltaFrame : number, playerPos : Point) {
        const globalPlayerPos = this.parent.toGlobal(playerPos);
        this.refreshPatrolPoint();
        this.timeControl(deltaSeconds);
        this.detections(globalPlayerPos);
        this.movimiento(globalPlayerPos, deltaSeconds);

    }

    public createPatrolRoute(radius : number, _extra = 0) : void{
        this.onPatrol = true;
        
        const p1 = this.toGlobal(new Point(- radius,  radius));
        const p2 = this.toGlobal(new Point(- radius,- radius));
        const p3 = this.toGlobal(new Point(  radius,- radius));
        const p4 = this.toGlobal(new Point(  radius,  radius));
        this.patrol_points.push(p1);
        this.patrol_points.push(p2);
        this.patrol_points.push(p3);
        this.patrol_points.push(p4);

        const point_global_DL : Point = this.patrol_points[1];
        const point_global_UR : Point = this.patrol_points[3];
        for (let index = 0; index < _extra; index++) {
            const x = Math.floor(Math.random() * (point_global_DL.x - point_global_UR.x + 1) + point_global_UR.x);
            const y = Math.floor(Math.random() * (point_global_UR.y - point_global_DL.y + 1) + point_global_DL.y);
            const randomPoint = new Point(x,y);
            this.patrol_points.push(randomPoint);
        }

        this.shufflePatrolRoute();
        this.assingNextPatrolPoint();
        
        if(this.debuggin){
            this.patrolRouteDebug.lineStyle(5,0xFF0000);
            this.patrolRouteDebug.moveTo(-radius,radius);
            this.patrolRouteDebug.lineTo(-radius,-radius);
            this.patrolRouteDebug.lineTo(radius,-radius);
            this.patrolRouteDebug.lineTo(radius,radius);
            this.patrolRouteDebug.lineTo(-radius,radius);
            for (let index = 0; index < this.patrol_points.length; index++) {
                this.patrolRouteDebug.beginFill(0x00FFFF,1);
                const point_global : Point = this.toLocal(this.patrol_points[index]);
                this.patrolRouteDebug.drawCircle(point_global.x,point_global.y,5);
                this.patrolRouteDebug.endFill();
            }
            this.addChild(this.patrolRouteDebug);
        }
    }

    private shufflePatrolRoute(){
        let currentIndex = this.patrol_points.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.patrol_points[currentIndex], this.patrol_points[randomIndex]] = [
            this.patrol_points[randomIndex], this.patrol_points[currentIndex]];
        }
    }
    
    private timeControl(deltaSeconds : number){
        this.patrol_timer += deltaSeconds;
        if(this.patrol_timer < 2){
            this.isWaiting = true;
        }else{
            this.isWaiting = false;
        }
    }

    private detections(playerPos : Point){
        const distanceToPlayer = this.distanceTo(playerPos);
        if(distanceToPlayer <= this.detectionRadius){
            this.isPlayerDetected = true;
        }
        if(distanceToPlayer > (this.detectionRadius)){
            this.isPlayerDetected = false;
            this.onPatrol = true;
        }
        if(this.onPatrol && !this.isWaiting){
            const disntanceToPatrolPoint = this.distanceTo(this.currentPatrolPoint);
            if(disntanceToPatrolPoint < 1){
                this.isWaiting = true;
                this.patrol_timer = 0;
                this.assingNextPatrolPoint();
            }
        }

    }

    private movimiento(playerPos : Point, deltaTime : number) : void{
        if(this.isPlayerDetected){
            this.rotateTowards(playerPos);
            this.moveTowards(playerPos, deltaTime);
        }else if(this.onPatrol && this.patrol_timer > 2){
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

    private refreshPatrolPoint() : void {
        this.currentPatrolPoint = this.parent.toGlobal(this.patrol_points[this.currentPatrolIndex]);
    }

    private moveTowards(objectPoint: Point, deltaTime : number) : void {
        const rot = this.calculateRotationTo(objectPoint);
        this.enemy_sprite.x = this.enemy_sprite.x + this.speed  * Math.cos(rot - 3.14/2) * deltaTime;
	    this.enemy_sprite.y = this.enemy_sprite.y + this.speed  * Math.sin(rot - 3.14/2) * deltaTime;    
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
