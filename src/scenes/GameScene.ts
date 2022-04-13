import { Container, Point, Sprite, Text, Texture } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Character/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Button } from "../ui/Button";
import { PhysicsContainer } from "../utils/PhysicsContainer";
import { Enemy } from "../entities/Enemys/Enemy";


export class GameScene extends Container implements IUpdateable{
	
    private player : Player;
    private pauseButton : Button;
    private pauseState : boolean;
    private gui_pause : Gui_pause;
    private mousePointer : Sprite;
    private mousePos : any;
    
    private physicsCharacter: PhysicsContainer;
    private goblin : Enemy;

    constructor(){
        super();

        this.mousePointer = new Sprite(Texture.from("cursor_aim"));

        this.player = new Player(); 
        this.player.scale.set(1);

        this.pauseState = false;
        
        this.pauseButton = new Button(Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"), 
                                        this.openPauseMenu.bind(this));
        this.pauseButton.position.set(1870,50);
        this.pauseButton.scale.set(0.3);
        
        const background: Sprite = Sprite.from("myBackground_1");
        background.scale.set(1.8);

        const title: Text = new Text("Inserte texto aqui",{fontSize: 20, stroke: 0xFCFF00});
        
        this.gui_pause = new Gui_pause();
        this.gui_pause.position.set(600,150);
        this.gui_pause.on(Gui_pause.CLOSE_EVENT,()=>this.removeChild(this.gui_pause))


        
        title.text = "Idea: Top Down Survival por Oleadas Generico de Fantasia \nControles\nWASD movimiento\nRotacion a Mouse";
        title.position.set(0,0);

        this.physicsCharacter = new PhysicsContainer(); 
        this.physicsCharacter.addChild(this.player);
        this.physicsCharacter.activatePlayerControl(true);
        this.physicsCharacter.position.set(50,50);
        
        this.createEnemy("GOBLIN");
        this.goblin = new Enemy(Texture.from("goblin"),200, new Point(800,800));
        this.goblin.position.set(800,800);
        this.goblin.createPatrolRoute(this.goblin.position,100,2);

        this.addChild(background);
    
        this.addChild(this.physicsCharacter);
        this.addChild(this.goblin);

        this.addChild(title);
        this.addChild(this.pauseButton);

        this.addChild(this.mousePointer)
    }
    
    public update(deltaTime: number, deltaFrame: number): void {
        //Todo esto creo que no tiene porque ser responsabilidad de la escena pero desp se cambia.
        if(this.pauseState){
            return;
        }
        this.player.update(deltaFrame, this.mousePos);
        const dt = deltaTime / 1000;
        this.physicsCharacter.update(dt);

        this.goblin.update(dt, deltaFrame, this.physicsCharacter.position);
        
        this.mouseSpritePosition();
    }
    
    public openPauseMenu() : void{
        this.addChild(this.gui_pause);
        this.addChild(this.mousePointer);
    }

    public mousePosition(global: any) : void {
		this.mousePos = global;
	}

    private mouseSpritePosition() : void{
        this.mousePointer.position.x = this.mousePos.x - (this.mousePointer.width/2);
        this.mousePointer.position.y = this.mousePos.y - (this.mousePointer.height/2);
    }

    private createEnemy(enemy_name : String) : void{
        if(enemy_name == "GOBLIN"){
            
        }
    }
   
}