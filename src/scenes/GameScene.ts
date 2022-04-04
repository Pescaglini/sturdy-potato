import { Container, Sprite, Text, Texture } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Keyboard } from "../utils/Keyboard";
import { Button } from "../ui/Button";


export class GameScene extends Container implements IUpdateable{
	
    private player : Player;
    private pauseButton : Button;
    private pauseState : boolean;
    private gui_pause : Gui_pause;
    private mousePos : any;

    constructor(){
        super();

        this.player = new Player(); 
        this.player.scale.set(1);
        this.player.position.set(300,300);

        this.pauseState = true;
        
        this.pauseButton = new Button(Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"),
                                        Texture.from("configuration_ui"), 
                                        this.pauseGame.bind(this));
        this.pauseButton.position.set(1870,50);
        this.pauseButton.scale.set(0.3);
        
        const background: Sprite = Sprite.from("myBackground_1");
        const title: Text = new Text("Inserte texto aqui",{fontSize: 20, stroke: 0xFCFF00});
        
        this.gui_pause = new Gui_pause();
        this.gui_pause.position.set(600,150)


        background.scale.set(1.8);

        title.text = "Top Down Survival por Oleadas Generico de Fantasia";
        title.position.set(0,0)
        
        this.addChild(background);
        this.addChild(this.player);
        this.addChild(title);
        this.addChild(this.pauseButton);
    }
    
    public update(_deltaTime: number, _deltaFrame: number): void {
        //Todo esto creo que no tiene porque ser responsabilidad de la escena pero desp se cambia.

        this.player.rotateTowardMouse(this.mousePos);

        if(this.pauseState){
            if(Keyboard.state.get("KeyA")){
                this.player.position.x -= 4; 
            }
            if(Keyboard.state.get("KeyD")){
                this.player.position.x += 4; 
            }
            if(Keyboard.state.get("KeyW")){
                this.player.position.y -= 4; 
            }
            if(Keyboard.state.get("KeyS")){
                this.player.position.y += 4; 
            }
        }
    }
    
    private pauseGame() : void{
        if(this.pauseState){
            this.addChild(this.gui_pause);
        }else{
            this.removeChild(this.gui_pause);
        }
        this.pauseState = !this.pauseState;
    }

    public mousePosition(global: any) {
		this.mousePos = global;
	}
   
}