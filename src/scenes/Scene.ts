import { Container, Sprite, Text } from "pixi.js";
import { Gui_pause } from "../ui/Gui_pause";
import { Player } from "../entities/Player";

export class Scene extends Container{
    constructor(){
        super();
        
        const player: Player = new Player(); 
        const background: Sprite = Sprite.from("myBackground_1");
        const title: Text = new Text("Inserte texto aqui",{fontSize: 20, stroke: 0xFCFF00});
        const gui_pause: Gui_pause = new Gui_pause();

        player.scale.set(1);
        player.position.set(300,300);

        background.scale.set(1.8);

        title.text = "Top Down Survival por Oleadas Generico de Fantasia";
        title.position.set(0,0)

        gui_pause.position.set(600,150)
        
        this.addChild(background);
        this.addChild(player);
        this.addChild(title);
        this.addChild(gui_pause);
    }
}