import { BLEND_MODES, Container, Graphics, IDestroyOptions, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Character/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Button } from "../ui/Button";
import { Enemy } from "../entities/Enemys/Enemy";
import { Projectile } from "../entities/Weapons/Projectile";
import { InteractiveSpace } from "../utils/InteractiveSpace";
import { Weapon } from "../entities/Weapons/Weapon";
import { checkCollision_CC, checkCollision_RR, IHitbox } from "../utils/IHitbox";
import { EnemySpawn } from "../entities/Enemys/EnemySpawn";
import { Goblin } from "../entities/Enemys/Goblin";
import { HUD } from "../ui/HUD";
import { Maps } from "../escenary/Maps";
import { Tree } from "../escenary/Tree";
import { Shadows } from "../shadowsAndLigths/Shadows";
import { HEIGHT, WIDTH } from "..";
import { ObscureFilter } from "../filters/ObscureFilter";
import { TorchFilter } from "../filters/TorchFilter";
import { eventTypesEnum, worldLayersEnum } from "../dictionary/Dictionary";


//TO-DO No tengo como sacar el enemigo del player collision objects, arreglar o repensar

export class GameScene extends Container implements IUpdateable{
	
    private player : Player;
    private activeWeapon : Weapon;
    private pauseButton : Button;
    private pauseState : boolean;
    private gui_pause : Gui_pause;
    private mousePointer : Sprite;
    private mousePos : any;
    private background : Sprite;
    public obscureFilter : ObscureFilter;
    private torchLight : TorchFilter;
    private hud : HUD;

    private interactive_background : InteractiveSpace;
    private character_projectiles :  Array<Projectile>;
    private enemy_hitbox_array :  Array<IHitbox>;
    private enemys_array :  Array<Enemy>;
    private trees_array :  Array<Tree>;
    private recShadows_array  :  Array<IHitbox> = [];

    private enemySpawn : EnemySpawn;

    private world : Container;
    private worldLayers : (Container)[]
    private worldMap : Maps;

    private shadows: Shadows;
    

    constructor(){
        super();
        
        // World and Layers
        this.world = new Container();
        this.worldLayers = [];
        for (let index = 0; index < 6; index++) {
            this.worldLayers.push(new Container());
            this.world.addChild(this.worldLayers[index]);
        }
        
        // Init
        this.mousePointer = new Sprite(Texture.from("cursor_aim"));

        this.character_projectiles = new Array<Projectile>();

        this.enemy_hitbox_array = new Array<IHitbox>();

        this.enemys_array = new Array<Enemy>();

        this.trees_array = new Array<Tree>();

        this.player = new Player();

        this.activeWeapon = this.player.getActiveWeapon();

        this.hud = new HUD(this.player,this.activeWeapon);

        this.worldMap = new Maps();
        
        this.interactive_background = new InteractiveSpace(this.activateWeapon.bind(this));

        //Lights and Shadows
        this.obscureFilter = new ObscureFilter(this.world);
        this.torchLight = new TorchFilter();
        this.shadows = new Shadows(this.recShadows_array);
        this.shadowsAndLightsConfig();

        //Spawn
        this.enemySpawn = new EnemySpawn(Texture.from("spawnHole"),600,this.worldLayers[worldLayersEnum.Enemies]);
        this.enemySpawn.position.set(300,1500);
        this.enemySpawn.addEnemyToSpawn(new Goblin(this.enemySpawn.position,this.enemySpawn),4);
        this.enemySpawn.addListener(eventTypesEnum.EnemyCreation,(enemy: Goblin) => {
            this.recShadows_array.push(enemy);
        });

        //Escenary
        this.createEscenary();
        
        this.pauseState = false;
        
        this.pauseButton = new Button(Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"), 
                                        this.openPauseMenu.bind(this));
        this.pauseButton.position.set(1870,50);
        this.pauseButton.scale.set(0.3);
        
        this.background = Sprite.from("myBackground_1");
        this.background.scale.set(1);

        this.gui_pause = new Gui_pause();
        this.gui_pause.position.set(600,150);
        this.gui_pause.on(Gui_pause.CLOSE_EVENT,()=>this.removeChild(this.gui_pause))

        


        //Adders
        this.addChild(this.obscureFilter);
        this.addChild(this.world);
        
        
        this.worldLayers[worldLayersEnum.UnderPlayer].addChild(this.background);
        this.worldLayers[worldLayersEnum.UnderPlayer].addChild(this.enemySpawn);
        this.worldLayers[worldLayersEnum.AsPlayer].addChild(this.player);
        
        this.player.addChild(this.torchLight);
        this.addChild(this.interactive_background);
        this.addChild(this.hud);
        this.addChild(this.pauseButton);
        this.addChild(this.mousePointer);
        
        
       
    }

    private shadowsAndLightsConfig(): void{
        this.player.addChild(this.shadows);

        const maskRectangle = new Graphics()
        maskRectangle.beginFill(0x222222,1);
        maskRectangle.drawRect(-WIDTH/2,-HEIGHT/2,WIDTH,HEIGHT);
        maskRectangle.blendMode = BLEND_MODES.ADD;
        maskRectangle.mask = this.shadows.polygonsContainer;
        this.player.addChild(maskRectangle);
        const maskRectangle2 = new Graphics()
        maskRectangle2.beginFill(0x000000,0.6);
        maskRectangle2.drawRect(-WIDTH/2,-HEIGHT/2,WIDTH,HEIGHT);
        this.player.addChild(maskRectangle2);

        this.torchLight.orangeContainer.mask = this.shadows.polygonsContainer;
        //this.torchLight.yellowContainer.mask = this.shadows.polygons;
        //this.worldLayers[worldLayersEnum.Enemies].mask = this.shadows.polygons;

    }
    
    private createEscenary() : void{
        const treeNumber = 5; //esto deberia sacarlo de un jason correspondiente al mapa o cuando se cree el spawn de Farmeables
        const zone : Rectangle = new Rectangle(50,50,2000,2000);
        for (let index = 0; index < treeNumber; index++) {
            const randPoint : Point = new Point(Math.random()*zone.width,Math.random()*zone.height);
            const tree = new Tree(Texture.from("treeLeaves"),0.75)
            tree.position.set(randPoint.x,randPoint.y);
            this.recShadows_array.push(tree);
            this.trees_array.push(tree);
            this.worldLayers[worldLayersEnum.AbovePlayer].addChild(tree);
        }
        
    }

    public override destroy(options?: boolean | IDestroyOptions): void {
        super.destroy(options);
    }

    public update(deltaTime: number, deltaFrame: number): void {
        if(this.pauseState){
            this.setMouseSpritePosition();
            return;
        }
        const dt = deltaTime / 1000;
        this.player.update(deltaFrame, dt, this.mousePos);
        this.projectileUpdates(dt,deltaFrame);
        this.enemySpawn.update(dt,deltaFrame,this.enemys_array,this.enemy_hitbox_array,this.worldLayers[worldLayersEnum.AsPlayer]);
        this.enemyUpdates(dt,deltaFrame);
        this.playerCollisionUpdate();
        this.escenaryUpdate();
        this.setMouseSpritePosition();
        this.worldMovement();
        this.hud.update();
        this.shadows.update();
    }

    private playerCollisionUpdate() : void{
        //Colisiones con enemigos
        for (let object of this.enemy_hitbox_array) {
            const overlap = checkCollision_RR(this.player,object);
            if(overlap != null && object.isHitteable()){
                this.player.CollisionDetected(overlap,1);
            }
        }
        //Colisiones con Trees
        for (let object of this.trees_array) {
            if(object.isUnderTree(this.player)){
                const overlap = checkCollision_RR(this.player,object);
                if(overlap != null){
                    this.player.CollisionDetected(overlap,1);
                }
            }
            
        }
        //Colisiones con mundo tile-management
        if(!this.worldMap.isInAvaibleSquare(this.player.position)){
            //this.worldMap.getReturnDirection(this.player.position);
            this.player.returnToLastPosition();
        }
    }

    private escenaryUpdate() : void{
        for (let tree of this.trees_array) {
            tree.update();
        }
    }

    private worldMovement() : void{
        /*let rot = 0;
        if(Keyboard.state.get("ShiftLeft")){
            console.log("Shift");
            if(Keyboard.state.get("KeyQ")){
                rot = 0.01;
            }
            if(Keyboard.state.get("KeyE")){
                rot = -0.01;
            }
        }*/
        const worldSum = this.player.returnMovement();
        this.world.position.x += worldSum.x;
        this.world.position.y += worldSum.y;
    }

    private enemyUpdates(deltaSeconds: number, deltaFrame: number) : void{
        for (let index = 0; index < this.enemys_array.length; index++) {
            const enemigo = this.enemys_array[index];
            enemigo.update(deltaSeconds, deltaFrame,this.player.position);
            if(enemigo.isEnemyDestroyable()){    
                this.enemys_array.splice(index,1);
                this.enemy_hitbox_array.splice(index,1);
                enemigo.destroy(); 
            }
            if(!enemigo.isEnemyDead()){        
                switch (enemigo.getEnemyType()) {
                    case "GOBLIN":
                        if(enemigo.isEnemyAttacking()){
                            this.player.takeDamage(enemigo.damageOutput());
                        }       
                        break;
                    default:
                        break;
                }
            }else{
                enemigo.changeDeadAnimation();
            }
        }
    }

    private projectileUpdates(dt: number, deltaFrame: number) : void{
        for (let index = 0; index < this.character_projectiles.length; index++) {
            const projectile = this.character_projectiles[index];
            projectile.update(dt,deltaFrame);
            //TENGO QUE IMPLEMENTAR UN QUADTREE O ME VA A REVENTAR CUANDO TENGA MUCHOS ENEMIGOS :) O(n^n)
            if(!projectile.isCollisionHappened()){
                for (let object of this.enemy_hitbox_array){
                    if(object.isHitteable()){
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
            }
            if(this.character_projectiles[index].must_destroy){
                const aux_projectile = this.character_projectiles[index];
                this.character_projectiles.splice(index,1);
                aux_projectile.destroy({children : true});
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

    private activateWeapon() : void{
        if(!this.player.getDead()){
            if(this.activeWeapon.hasAmmo()){
                this.activeWeapon.substract_ammo(1);
                const texture_ammo : Texture = this.activeWeapon.getAmmoTexture();
                const aux_projectile = new Projectile(texture_ammo,this.player.position,this.world.toLocal(this.mousePos));
                this.character_projectiles.push(aux_projectile);
                this.worldLayers[worldLayersEnum.UnderPlayer].addChild(aux_projectile);
                
            }
        }
    }
}