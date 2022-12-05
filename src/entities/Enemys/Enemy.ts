import { Circle, Container, Graphics, Point, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { Interpolation, Tween } from "tweedle.js";
import { IHitbox } from "../../utils/IHitbox";
import { EnemySpawn } from "./EnemySpawn";


export class Enemy extends Container implements IHitbox {
    protected enemy_sprite : Sprite;
    protected enemy_shadow_sprite : Sprite;
    protected enemy_dead_sprite : Sprite;
    protected enemy_damage_text : Text;

    private hitBox : Graphics;
    private hitCircle_grap: Graphics;
    private hitCircle: Circle;

    private patrol_points :  Array<Point>;
    private currentPatrolPoint : Point;
    private currentPatrolIndex : number;
    private onPatrol : boolean;
    private playerDetected : boolean;
    private movementAllowed : boolean;
    private waiting : boolean;
    private takingDamage : boolean;
    private attackingAllowed : boolean;
    private attacking : boolean;
    private dead : boolean;
    private destroyable : boolean;
    private debuggin : boolean;

    protected speed : number;
    protected speed_patrol : number;
    protected speed_chase : number;
    protected damage : number;
    protected max_health : number;
    protected current_health : number;
    protected detectionRadius : number;
    private patrol_timer : number;
    protected waiting_time : number;
    protected attackRadius : number;
    private attack_timer : number;
    private dead_timer : number;
    private taking_damage_timer : number;
    protected timeNeededToAttack : number;
    private attention_timer : number;
    protected spawn : EnemySpawn;
    

    private patrolRouteDebug : Graphics;

    OBJECT_TYPE = "ENEMY";
    protected ENEMY_TYPE = "";

    constructor(startPosition : Point, spawn : EnemySpawn){
        super();
        this.onPatrol = false;
        this.debuggin = false;
        this.playerDetected = false;
        this.waiting = false;
        this.movementAllowed = true;
        this.attackingAllowed = false;
        this.attacking = false;
        this.dead = false;
        this.destroyable = false;
        this.takingDamage = false;
       
        this.max_health = 100;
        this.current_health = this.max_health;

        this.waiting_time = 0;
        this.patrol_timer = 0;
        this.attack_timer = 0;
        this.detectionRadius = 0;
        this.attackRadius = 0;
        this.dead_timer = 0;
        this.attention_timer = 0;
        this.taking_damage_timer = 1;
        this.timeNeededToAttack = 3;
        this.damage = 0;

        this.enemy_sprite = Sprite.from(Texture.from("default_enemy_texture"));
        this.enemy_shadow_sprite = Sprite.from(Texture.from("default_enemy_texture"));
        this.enemy_dead_sprite = Sprite.from(Texture.from("default_enemy_texture"));
        this.enemy_damage_text = new Text("0", {fontSize: 15,fill: "white", stroke: 0x000000, strokeThickness: 5});
        

        this.hitBox = new Graphics();
        this.hitBox.beginFill(0xFFFF00,0.0);
        this.hitBox.drawRect(0,0,50,50);
        this.hitBox.position.set(-25,-20);

        this.hitCircle_grap = new Graphics();
        this.hitCircle_grap.beginFill(0x0000FF,0.0);
        this.hitCircle_grap.drawCircle(30,35,25);
        this.hitCircle_grap.position.set(-30,-30);
        this.hitCircle = new Circle(0,0,30);

        this.speed_patrol = 200;
        this.speed_chase = 300;
        this.speed = this.speed_patrol;
        this.patrol_points = new Array<Point>();
        this.currentPatrolIndex = -1;
        this.position.set(startPosition.x,startPosition.y);
        this.currentPatrolPoint = startPosition;

        this.spawn = spawn;

        this.addChild(this.hitBox);
        this.addChild(this.hitCircle_grap);
        

        this.patrolRouteDebug = new Graphics();
        if(this.debuggin){
            const detectionCircle = new Graphics();
            detectionCircle.beginFill(0x000000,0.1);
            detectionCircle.drawCircle(this.enemy_sprite.position.x,this.enemy_sprite.position.y,this.detectionRadius);
            detectionCircle.endFill();
            this.addChild(detectionCircle);
            this.enemy_sprite.addChild(detectionCircle);
        }
    }

    public update(deltaSeconds: number, _deltaFrame : number, playerPos : Point) {
        if(this.dead){
            this.enemy_damage_text.alpha = 0;
            new Tween(this.enemy_dead_sprite).to({alpha : 0},3000).interpolation(Interpolation.Color.RGB).start();
            this.dead_timer += deltaSeconds;
            if(this.dead_timer >= 5){
                this.spawn.substractCurrentEnemy(this);
                this.destroyable = true;
            }
            return;
        }
        const globalPlayerPos = this.parent.toGlobal(playerPos);
        this.refreshPatrolPoint();
        this.timeControl(deltaSeconds);
        this.detections(globalPlayerPos);
        this.movimiento(globalPlayerPos, deltaSeconds);
        this.takingDamageControl();
    }
    
    public getShadowRect(offset: number = 0): Rectangle {
        const rec = this.hitBox.getBounds();
        const newRec = new Rectangle(rec.x + offset, rec.y + offset, rec.width - offset, rec.height - offset);
        return newRec
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

    public isHitteable(): boolean {
        if(!this.dead){
            return true;
        }
        return false;
    }

    public isEnemyDead() : boolean{
        return this.dead;
    }

    public isEnemyDestroyable() : boolean{
        return this.destroyable;
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
        this.attention_timer = 10;
        this.current_health -= damage;
        this.enemy_damage_text.text = String(damage);
        this.enemy_damage_text.position.set(0,-30);
        new Tween(this.enemy_damage_text).to({y : -50},500).start();
        this.taking_damage_timer = 0;
        this.enemy_sprite.tint = 0xff0000;
        new Tween(this.enemy_sprite).to({tint:[0xffffff]},1000).interpolation(Interpolation.Color.RGB).start();
        if(this.current_health <= 0){
            this.dead = true;
        } 
    }

    private takingDamageControl() : void{
        if(this.takingDamage){
            this.enemy_damage_text.alpha = 1;
        }else{
            this.enemy_damage_text.alpha = 0;
        }
    }

    public damageOutput() : number{
        return this.damage;
    }

    public changeDeadAnimation() : void{
        throw new Error("Implementa el cambio de Sprite de muerte gato");
    }

    public isEnemyAttacking() : boolean{
        const attack = this.attacking;
        if(this.attacking){
            this.attackingAllowed = false;
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
        this.attention_timer -= deltaSeconds;
        if(this.attention_timer <= 0){this.attention_timer = 0;}
        if(this.patrol_timer <  this.waiting_time){
            this.waiting = true;
        }else{
            this.waiting = false;
        }
        if(this.attackingAllowed){
            this.attack_timer += deltaSeconds;
            if(this.attack_timer >= this.timeNeededToAttack){
                this.attacking = true;
            }
        }else{
            this.attack_timer = 0;
            this.attacking = false;
        }
        if(this.taking_damage_timer < 1){
            this.takingDamage = true;
            this.taking_damage_timer += deltaSeconds;
        }else{
            this.taking_damage_timer = 1;
            this.takingDamage = false;
        }
        
    }

    protected detections(playerPos : Point,){
        const distanceToPlayer = this.distanceTo(playerPos);
        this.movementAllowed = true;
        this.attackingAllowed = false;
        
        if(distanceToPlayer <= this.detectionRadius || this.attention_timer > 0){
            this.playerDetected = true;
            if(distanceToPlayer < this.attackRadius){
                this.attackingAllowed = true;
            }
            if(distanceToPlayer < this.enemy_sprite.width/2){
                this.movementAllowed = false;
            }
            this.onPatrol = false;
        }else if(distanceToPlayer > (this.detectionRadius)){
            this.playerDetected = false;
            this.onPatrol = true;
        }
        
        if(this.onPatrol && !this.waiting){
            const disntanceToPatrolPoint = this.distanceTo(this.currentPatrolPoint);
            if(disntanceToPatrolPoint < 1){
                this.waiting = true;
                this.patrol_timer = 0;
                this.assingNextPatrolPoint();
            }
        }

    }

    protected movimiento(playerPos : Point, deltaTime : number) : void{
        if(this.playerDetected){
            this.speed = this.speed_chase;
            this.rotateTowards(playerPos);
            if(this.movementAllowed){
                this.moveTowards(playerPos, deltaTime);
            }
        }else if(this.onPatrol && this.patrol_timer > this.waiting_time){
            this.speed = this.speed_patrol;
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
        this.enemy_shadow_sprite.rotation = rot;
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

    public setSpawn(spawn : EnemySpawn){
        this.spawn = spawn;
    }
}
