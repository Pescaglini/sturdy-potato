import { Container, Point, Sprite, Text, Texture } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Character/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Button } from "../ui/Button";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Enemy } from "../entities/Enemys/Enemy";
import { Projectile } from "../entities/Weapons/Projectile";
import { InteractiveSpace } from "../utils/InteractiveSpace";
import { FarmeableObject } from "../escenary/FarmeableObject";
import { HEIGHT, WIDTH } from "..";
import { Weapon } from "../entities/Weapons/Weapon";


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
    
    private physicsCharacter: PhysicsContainer;
    private goblin : Enemy;
    private tree : FarmeableObject;

    private world : Container;
    

    constructor(){
        super();

        this.world = new Container();

        this.mousePointer = new Sprite(Texture.from("cursor_aim"));

        this.player = new Player(); 
        this.player.scale.set(1);

        this.activeWeapon = this.player.getActiveWeapon();

        this.interactive_background = new InteractiveSpace(this.activateWeapon.bind(this));

        this.character_projectiles = new Array<Projectile>();

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


        this.physicsCharacter = new PhysicsContainer(); 
        this.physicsCharacter.addChild(this.player);
        this.physicsCharacter.activatePlayerControl(true);
        this.physicsCharacter.position.set(WIDTH/2,HEIGHT/2);
        
        this.createEnemy("GOBLIN");
        this.goblin = new Enemy(Texture.from("goblin"),200, new Point(200,900));
        this.goblin.createPatrolRoute(100,4);

        //Adders
        this.addChild(this.background);
        this.addChild(this.physicsCharacter);
        this.addChild(this.goblin);
        this.addChild(this.tree);
        this.addChild(this.interactive_background);
        this.addChild(this.title);
        this.addChild(this.pauseButton);
        this.addChild(this.mousePointer);
        this.addChild(this.world);
        this.worldAdder();
    }
    
    public update(deltaTime: number, deltaFrame: number): void {
        if(this.pauseState){
            return;
        }
        const dt = deltaTime / 1000;
        this.player.update(deltaFrame, this.mousePos);
        this.physicsCharacter.update(dt);
        this.goblin.update(dt, deltaFrame, this.physicsCharacter.position);
        this.projectileUpdates(dt,deltaFrame);
        this.setMouseSpritePosition();
        this.worldMovement(dt)
    }

    private worldMovement(dt : number) : void{
        const worldSum = this.physicsCharacter.playerMovement(dt);
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
        this.world.addChild(this.physicsCharacter);
        //this.world.addChild(this.player);
        this.world.addChild(this.tree);
        //thiworld.s.addChild(title);
    }


   
}