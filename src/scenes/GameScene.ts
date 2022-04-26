import { Container, IDestroyOptions, Point, Sprite, Text, Texture } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Character/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Button } from "../ui/Button";
import { Enemy } from "../entities/Enemys/Enemy";
import { Projectile } from "../entities/Weapons/Projectile";
import { InteractiveSpace } from "../utils/InteractiveSpace";
import { FarmeableObject } from "../escenary/FarmeableObject";
import { HEIGHT, WIDTH } from "..";
import { Weapon } from "../entities/Weapons/Weapon";
import { checkCollision, IHitbox } from "../utils/IHitbox";


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
    private collision_objects :  Array<IHitbox>;
    
    private goblin : Enemy;
    private tree : FarmeableObject;

    private world : Container;
    

    constructor(){
        super();

        this.world = new Container();

        this.mousePointer = new Sprite(Texture.from("cursor_aim"));

        this.character_projectiles = new Array<Projectile>();

        this.collision_objects = new Array<IHitbox>();

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
        this.goblin = new Enemy(Texture.from("goblin"),200, new Point(200,900));
        this.goblin.createPatrolRoute(100,4);
        this.collision_objects.push(this.goblin);

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
        this.playerCollisionUpdate();
        this.setMouseSpritePosition();
        this.worldMovement();
    }

    private playerCollisionUpdate() : void{
        for (let object of this.collision_objects) {
            const overlap = checkCollision(this.player,object);
            if(overlap != null){
                this.player.CollisionRestrictions(overlap);
            }
        }
    }

    private worldMovement() : void{
        const worldSum = this.player.returnMovement();
        this.world.position.x += worldSum.x;
        this.world.position.y += worldSum.y;
    }

    private projectileUpdates(dt: number, deltaFrame: number) : void{
        for (let index = 0; index < this.character_projectiles.length; index++) {
            this.character_projectiles[index].update(dt,deltaFrame);
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
    }

    private createEnemy(enemy_name : String) : void{
        if(enemy_name == "GOBLIN"){
            
        }
    }

    private activateWeapon() : void{
        if(this.activeWeapon.hasAmmo()){
            this.activeWeapon.substract_ammo(1);
            const texture_ammo : Texture = this.activeWeapon.getAmmoTexture();
            const aux_projectile = new Projectile(texture_ammo,new Point(WIDTH/2,HEIGHT/2),this.mousePos);
            this.character_projectiles.push(aux_projectile);
            this.addChild(aux_projectile);
        }
    }

    private worldAdder() : void{
        this.world.addChild(this.goblin);
        this.world.addChild(this.player);
        this.world.addChild(this.tree);
    }


   
}