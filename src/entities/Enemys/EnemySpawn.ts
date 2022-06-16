import { Container, Sprite, Texture } from "pixi.js";
import { IHitbox } from "../../utils/IHitbox";
import { Enemy } from "./Enemy";
import { Goblin } from "./Goblin";



export class EnemySpawn extends Container {
    private spriteSpawn : Sprite;
    private howManyEnemiesMap : Map<Enemy, [number,number]>;    //Enemy,currentAmountEnemieType,maxEnemieType
    private timerSpawn : number;
    private patrolRadius : number;

    constructor(texture_name : Texture, patrolRadius : number){
        super();
        this.spriteSpawn = Sprite.from(texture_name);
        this.timerSpawn = 0;
        this.howManyEnemiesMap = new Map<Enemy, [number,number]>();
        this.patrolRadius = patrolRadius;
        this.addChild(this.spriteSpawn);
    }

    public update(deltaSeconds: number, _deltaFrame : number, enemyArray : Array<Enemy>, colisionArray : Array<IHitbox>, world : Container) {
        this.timerSpawn += deltaSeconds;
        if(this.timerSpawn >= 0.01){//ojo estaba en 7
            this.spawnAdder(enemyArray,colisionArray,world);
            this.timerSpawn = 0;
        }
        this.debugMap();
        
    }
    private spawnAdder(enemyArray : Array<Enemy>, colisionArray : Array<IHitbox>, _world : Container) : void{
        for (let entry of this.howManyEnemiesMap.entries()) {
            if(entry[1][0] < entry[1][1]){
                switch (entry[0].getEnemyType()) {
                    case "GOBLIN":
                        const enemy = new Goblin(this.position,this);
                        enemy.createPatrolRoute(this.patrolRadius,8);
                        enemyArray.push(enemy);
                        colisionArray.push(enemy);
                        this.parent.addChild(enemy);
                        //world.addChild(enemy);
                        this.howManyEnemiesMap.set(entry[0],[entry[1][0] + 1,entry[1][1]]);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    public addEnemyToSpawn(enemy : Enemy, max_amount : number) : void{
        this.howManyEnemiesMap.set(enemy,[0,max_amount]);
    }
    public clearSpawn() : void{
        this.howManyEnemiesMap.clear();
    }
    public substractCurrentEnemy(enemy : Enemy) : void{
        for (let entry of this.howManyEnemiesMap.entries()) {
            if(entry[0].getEnemyType() == enemy.getEnemyType()){
                this.howManyEnemiesMap.set(entry[0],[entry[1][0] - 1,entry[1][1]]);
            }
        }
    }
    public debugMap() : void{
        //console.log(this.howManyEnemiesMap.size);
    }
}