import { Container, IDestroyOptions, Point, Sprite, Text, Texture } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Character/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Button } from "../ui/Button";
import { Enemy } from "../entities/Enemys/Enemy";
import { Projectile } from "../entities/Weapons/Projectile";
import { InteractiveSpace } from "../utils/InteractiveSpace";
import { FarmeableObject } from "../escenary/FarmeableObject";
import { Weapon } from "../entities/Weapons/Weapon";
import { checkCollision_CC, checkCollision_RR, IHitbox } from "../utils/IHitbox";
import { Goblin } from "../entities/Enemys/Goblin";


export class GameScene extends Container implements IUpdateable{
	
    private player : Player;
    private activeWeapon : Weapon;
    private pauseButton : Button;
    private pauseState : boolean;
    private gui_pause : Gui_pause;
    private mousePointer : Sprite;
    private mousePos : any;
    private background : Sprite;
    private title : Text;

    private interactive_background : InteractiveSpace;
    private character_projectiles :  Array<Projectile>;
    private player_collision_objects :  Array<IHitbox>;
    private enemys_array :  Array<Enemy>;
    
    private goblin : Enemy;
    private tree : FarmeableObject;

    private world : Container;
    

    constructor(){
        super();

        this.world = new Container();

        this.mousePointer = new Sprite(Texture.from("cursor_aim"));

        this.character_projectiles = new Array<Projectile>();

        this.player_collision_objects = new Array<IHitbox>();

        this.enemys_array = new Array<Enemy>();

        this.player = new Player();

        this.activeWeapon = this.player.getActiveWeapon();

        this.interactive_background = new InteractiveSpace(this.activateWeapon.bind(this));

        this.tree = new FarmeableObject(Texture.from("tree_1"),2,0.75);

        this.pauseState = false;
        
        this.pauseButton = new Button(Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"), 
                                        this.openPauseMenu.bind(this));
        this.pauseButton.position.set(1870,50);
        this.pauseButton.scale.set(0.3);
        
        this.background = Sprite.from("myBackground_1");
        this.background.scale.set(1.8);

        this.title = new Text("Inserte texto aqui",{fontSize: 20, stroke: 0xFCFF00});
        this.title.text = "Idea: Top Down Survival por Oleadas Generico de Fantasia \nControles\nWASD movimiento\nRotacion a Mouse\nDisparo con raton Izq";
        this.title.position.set(0,0);
        
        this.gui_pause = new Gui_pause();
        this.gui_pause.position.set(600,150);
        this.gui_pause.on(Gui_pause.CLOSE_EVENT,()=>this.removeChild(this.gui_pause))

        
        this.createEnemy("GOBLIN");
        this.goblin = new Goblin(Texture.from("goblin"),200, new Point(200,900));
        this.goblin.createPatrolRoute(100,4);
        this.enemys_array.push(this.goblin);
        this.player_collision_objects.push(this.goblin);

        //Adders
        this.addChild(this.background);
        this.addChild(this.player);
        this.addChild(this.goblin);
        this.addChild(this.tree);
        this.addChild(this.interactive_background);
        this.addChild(this.title);
        this.addChild(this.pauseButton);
        this.addChild(this.mousePointer);
        this.addChild(this.world);
        this.worldAdder();
    }
    
    public override destroy(options?: boolean | IDestroyOptions): void {
        super.destroy(options);
    }

    public update(deltaTime: number, deltaFrame: number): void {
        if(this.pauseState){
            return;
        }
        const dt = deltaTime / 1000;
        this.player.update(deltaFrame, dt, this.mousePos);
        this.goblin.update(dt, deltaFrame, this.player.position);
        this.projectileUpdates(dt,deltaFrame);
        this.enemyUpdates();
        this.playerCollisionUpdate();
        this.setMouseSpritePosition();
        this.worldMovement();
    }

    private playerCollisionUpdate() : void{
        for (let object of this.player_collision_objects) {
            const overlap = checkCollision_RR(this.player,object);
            if(overlap != null){
                //this.player.CollisionDetected(overlap,1);
            }
        }
    }


    private worldMovement() : void{
        const worldSum = this.player.returnMovement();
        this.world.position.x += worldSum.x;
        this.world.position.y += worldSum.y;
    }

    private enemyUpdates() : void{
        for (let index = 0; index < this.enemys_array.length; index++) {
            const enemigo = this.enemys_array[index];
            switch (enemigo.getEnemyType()) {
                case "GOBLIN":
                    if(enemigo.isEnemyDead()){        
                        this.enemys_array.splice(index,1);
                        enemigo.destroy();    
                    }else if(enemigo.isEnemyAttacking()){
                        console.log("Goblin: wasaaa,te pego");
                    }       
                    break;
                default:
                    break;
            }
            
        }
    }

    private projectileUpdates(dt: number, deltaFrame: number) : void{
        for (let index = 0; index < this.character_projectiles.length; index++) {
            const projectile = this.character_projectiles[index];
            projectile.update(dt,deltaFrame);
            //TENGO QUE IMPLEMENTAR UN QUADTREE O ME VA A REVENTAR CUANDO TENGA MUCHOS ENEMIGOS :) O(n^n)
            if(!projectile.isCollisionHappened()){
                for (let object of this.player_collision_objects){
                    const overlap = checkCollision_CC(projectile,object);
                    if(overlap != null){
                        projectile.CollisionDetected();
                        object.takeDamage(projectile.getDamage())
                        //Mover todo esto al enemigo
                        const rand_x = Math.floor(Math.random() * (-20 - 20 + 1) + 20);
                        const rand_y = Math.floor(Math.random() * (-20 - 20 + 1) + 20);
                        projectile.position.set(rand_x,rand_y);
                        object.impactObjectAdder(projectile);
                    }
                }
            }
            if(this.character_projectiles[index].must_destroy){
                const aux_projectile = this.character_projectiles[index];
                this.character_projectiles.splice(index,1);
                aux_projectile.destroy();
            }
        }
    }
    
    public openPauseMenu() : void{
        this.addChild(this.gui_pause);
        this.addChild(this.mousePointer);
    }

    public mousePosition(global: any) : void {
		this.mousePos = global;
	}

    private setMouseSpritePosition() : void{
        this.mousePointer.position.x = this.mousePos.x - (this.mousePointer.width/2);
        this.mousePointer.position.y = this.mousePos.y - (this.mousePointer.height/2);
        this.addChild(this.mousePointer);
    }

    private createEnemy(enemy_name : String) : void{
        if(enemy_name == "GOBLIN"){
            
        }
    }

    private activateWeapon() : void{
        if(this.activeWeapon.hasAmmo()){
            this.activeWeapon.substract_ammo(0); //CAMBIAR
            const texture_ammo : Texture = this.activeWeapon.getAmmoTexture();
            const aux_projectile = new Projectile(texture_ammo,this.player.getGlobalPosition(),this.mousePos);
            this.character_projectiles.push(aux_projectile);
            this.addChildAt(aux_projectile,1);
            //this.world.addChild(aux_projectile);
            
        }
    }

    private worldAdder() : void{
        this.world.addChild(this.goblin);
        this.world.addChild(this.player);
        this.world.addChild(this.tree);
    }


   
}