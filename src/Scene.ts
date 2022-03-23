import { Container, Sprite, Text } from "pixi.js";
import { Player } from "./Player";

export class Scene extends Container{
    constructor(){
        super();
        
        const player: Player = new Player(); 
        const background: Sprite = Sprite.from("myBackground_1");
        const title: Text = new Text("Inserte texto aqui",{fontSize: 20, stroke: 0xFCFF00});

        player.scale.set(1);
        player.position.set(300,300);

        title.text = "Top Down Survival por Oleadas Generico de Fantasia";
        title.position.set(0,0)
        
        this.addChild(background);
        this.addChild(player);
        this.addChild(title);
    }
}