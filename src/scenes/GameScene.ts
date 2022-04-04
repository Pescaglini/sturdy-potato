import { Container, Sprite, Text } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Player";
import { IUpdateable } from "../utils/IUpdateable";
import { Keyboard } from "../utils/Keyboard";


export class GameScene extends Container implements IUpdateable{
    private player : Player;

    constructor(){
        super();
        
        this.player = new Player(); 
        const background: Sprite = Sprite.from("myBackground_1");
        const title: Text = new Text("Inserte texto aqui",{fontSize: 20, stroke: 0xFCFF00});
        const gui_pause: Gui_pause = new Gui_pause();

        this.player.scale.set(1);
        this.player.position.set(300,300);

        background.scale.set(1.8);

        title.text = "Top Down Survival por Oleadas Generico de Fantasia";
        title.position.set(0,0)

        gui_pause.position.set(600,150)
        
        this.addChild(background);
        this.addChild(this.player);
        this.addChild(title);
        this.addChild(gui_pause);

    }
    
    public update(_deltaTime: number, _deltaFrame: number): void {
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