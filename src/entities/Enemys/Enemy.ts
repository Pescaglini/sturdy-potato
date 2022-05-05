import { Circle, Container, Graphics, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { IHitbox } from "../../utils/IHitbox";


export class Enemy extends Container implements IHitbox {
    private enemy_sprite : Sprite;
    private hitBox : Graphics;
    private hitCircle_grap: Graphics;
    private hitCircle: Circle;
    private patrol_points :  Array<Point>;
    private currentPatrolPoint : Point;
    private currentPatrolIndex : number;
    private onPatrol : Boolean;
    private isPlayerDetected : Boolean;
    private isMovementAllowed : Boolean;
    private isWaiting : Boolean;
    private isAttackingAllowed : Boolean;
    private isAttacking : Boolean;
    private isDead : Boolean;
    private debuggin : Boolean;
    private speed : number;
    protected max_health : number;
    protected current_health : number;
    private detectionRadius : number;
    private patrol_timer : number;
    protected attackRadius : number;
    private attack_timer : number;
    protected timeNeededToAttack : number;
    

    private patrolRouteDebug : Graphics;

    OBJECT_TYPE = "ENEMY";
    protected ENEMY_TYPE = "GOBLIN";

    constructor(texture_name : Texture, detectionRadius : number, startPosition : Point){
        super();
        this.onPatrol = false;
        this.debuggin = false;
        this.isPlayerDetected = false;
        this.isWaiting = false;
        this.isMovementAllowed = true;
        this.isAttackingAllowed = false;
        this.isAttacking = false;
        this.isDead = false;
        this.detectionRadius = detectionRadius;
        this.max_health = 100;
        this.current_health = this.max_health;

        this.patrol_timer = 0;
        this.attack_timer = 0;
        this.attackRadius = 0;
        this.timeNeededToAttack = 3;

        this.enemy_sprite = Sprite.from(texture_name);
        this.enemy_sprite.anchor.set(0.5);
        this.enemy_sprite.scale.set(2);
        this.enemy_sprite.name = "enemy_sprite";

        this.hitBox = new Graphics();
        this.hitBox.beginFill(0xFFFF00,0.0);
        this.hitBox.drawRect(0,0,50,50);
        this.hitBox.position.set(-25,-20);

        this.hitCircle_grap = new Graphics();
        this.hitCircle_grap.beginFill(0x0000FF,0.0);
        this.hitCircle_grap.drawCircle(30,35,25);
        this.hitCircle_grap.position.set(-30,-30);
        this.hitCircle = new Circle(0,0,30);

        this.speed = 250;
        this.patrol_points = new Array<Point>();
        this.currentPatrolIndex = -1;
        this.position.set(startPosition.x,startPosition.y);
        this.currentPatrolPoint = startPosition;
        
        this.addChild(this.enemy_sprite);
        this.addChild(this.hitBox);
        this.addChild(this.hitCircle_grap);

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
        if(this.isDead){return;}
        const globalPlayerPos = this.parent.toGlobal(playerPos);
        this.refreshPatrolPoint();
        this.timeControl(deltaSeconds);
        this.detections(globalPlayerPos);
        this.movimiento(globalPlayerPos, deltaSeconds);
    }

    public getHitbox() : Rectangle{
        return this.hitBox.getBounds()
    }

    public getHitCircle_Rad(): number {
        return this.hitCircle.radius;
    }

    public getHitCircle_Rec(): Rectangle {
        return this.hitCircle_grap.getBounds();
    }

    public getEnemySprite() : Sprite{
        return this.enemy_sprite;
    }

    public getEnemyType() : String{
        return this.ENEMY_TYPE;
    }

    public impactObjectAdder(obj : any) : void{
        this.addChildAt(obj,0);
    }

    public isEnemyDead() : Boolean{
        return this.isDead;
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

    public takeDamage(damage : number) : void{
        this.current_health -= damage;
        if(this.current_health <= 0){
            this.isDead = true;
        } 
    }

    public isEnemyAttacking() : Boolean{
        const attack = this.isAttacking;
        if(this.isAttacking){
            this.isAttackingAllowed = false;
        }
        return attack;
    }

    protected shufflePatrolRoute(){
        let currentIndex = this.patrol_points.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.patrol_points[currentIndex], this.patrol_points[randomIndex]] = [
            this.patrol_points[randomIndex], this.patrol_points[currentIndex]];
        }
    }
    
    protected timeControl(deltaSeconds : number){
        this.patrol_timer += deltaSeconds;
        if(this.patrol_timer < 2){
            this.isWaiting = true;
        }else{
            this.isWaiting = false;
        }
        if(this.isAttackingAllowed){
            this.attack_timer += deltaSeconds;
            if(this.attack_timer >= this.timeNeededToAttack){
                this.isAttacking = true;
            }
        }else{
            this.attack_timer = 0;
            this.isAttacking = false;
        }
        
    }

    protected detections(playerPos : Point,){
        const distanceToPlayer = this.distanceTo(playerPos);
        this.isMovementAllowed = true;
        this.isAttackingAllowed = false;

        if(distanceToPlayer <= this.detectionRadius){
            this.isPlayerDetected = true
            if(distanceToPlayer < this.attackRadius){
                this.isMovementAllowed = false;
                this.isAttackingAllowed = true;
            }
            this.onPatrol = false;
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

    protected movimiento(playerPos : Point, deltaTime : number) : void{
        if(this.isPlayerDetected){
            this.rotateTowards(playerPos);
            if(this.isMovementAllowed){
                this.moveTowards(playerPos, deltaTime);
            }
        }else if(this.onPatrol && this.patrol_timer > 2){
            this.rotateTowards(this.currentPatrolPoint);
            this.moveTowards(this.currentPatrolPoint, deltaTime);
        }
    }

    protected assingNextPatrolPoint() : void {
        this.currentPatrolIndex++;
        if(this.currentPatrolIndex >= this.patrol_points.length){
            this.currentPatrolIndex = 0;
        }
        this.currentPatrolPoint = this.patrol_points[this.currentPatrolIndex];
    }

    protected refreshPatrolPoint() : void {
        this.currentPatrolPoint = this.parent.toGlobal(this.patrol_points[this.currentPatrolIndex]);
    }

    protected moveTowards(objectPoint: Point, deltaTime : number) : void {
        const rot = this.calculateRotationTo(objectPoint);
        this.x = this.x + this.speed  * Math.cos(rot - 3.14/2) * deltaTime;
	    this.y = this.y + this.speed  * Math.sin(rot - 3.14/2) * deltaTime;    
    }

    protected rotateTowards(objectPoint: Point) : void {
        const rot = this.calculateRotationTo(objectPoint);
        this.enemy_sprite.rotation = rot;
    }

    protected calculateRotationTo(objectPoint : Point) : number{
        const globalEnemyPos = this.toGlobal(this.enemy_sprite.position);
        const distance_x = objectPoint.x - globalEnemyPos.x;
        const distance_y = objectPoint.y - globalEnemyPos.y;
        const rot = (Math.atan2(distance_y, distance_x)) + 3.14/2;
        return rot;
    }

    protected distanceTo(objectPoint : Point) : number{
        const globalEnemyPos = this.toGlobal(this.enemy_sprite.position);
        const distance_x = objectPoint.x - globalEnemyPos.x;
        const distance_y = objectPoint.y - globalEnemyPos.y;
        const distanceToPlayer = Math.sqrt((Math.pow(distance_x,2) + Math.pow(distance_y,2)))/2;
        return distanceToPlayer;
    }
}
