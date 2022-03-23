import { Container, NineSlicePlane, Sprite, Texture, Text } from "pixi.js";

export class Gui_pause extends Container{
    constructor(){
        super();
        const wood_ui = new NineSlicePlane(
            Texture.from("wood_gi"),
            35,35,35,35
        );
        wood_ui.scale.set(1);

        const paper_ui = new NineSlicePlane(
            Texture.from("paper_ui"),
            35,35,35,35
        );
        paper_ui.scale.set(1.1);
        paper_ui.position.set(50,60);

        const gris_ui = new NineSlicePlane(
            Texture.from("gris_ui"),
            35,35,35,35
        );
        gris_ui.position.set(100,580)
        gris_ui.scale.set(0.5)
        gris_ui.width = 700;

        const torch_ui: Sprite = Sprite.from("torch_ui");
        torch_ui.scale.set(0.5);
        torch_ui.position.set(450,0);

        const title_pause: Text = new Text("Pausa", {fontSize: 80,fill: "white", stroke: 0x000000, strokeThickness: 5});
        title_pause.position.set(160,100);
        

        this.addChild(wood_ui);
        this.addChild(paper_ui);
        this.addChild(torch_ui);
        
        this.addChild(gris_ui);
        this.addChild(title_pause);
        
        
    }
}