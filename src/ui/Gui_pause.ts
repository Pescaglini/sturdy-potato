import { Container, NineSlicePlane, Sprite, Texture, Text } from "pixi.js";
import { Button } from "./Button";

export class Gui_pause extends Container{

    private buttonResume : Button;

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
        gris_ui.position.set(100,210);
        gris_ui.scale.set(0.5);
        gris_ui.width = 700;


        this.buttonResume = new Button(Texture.from("plank_ui"),
                                        Texture.from("plank_ui"),
                                        Texture.from("plank_ui"), 
                                        this.OnButtonClick.bind(this));
        this.buttonResume.scale.set(0.5);
        this.buttonResume.position.set(275,550);
        const textResume: Text = new Text("Resume", {fontSize: 100,fill: "white", stroke: 0x000000, strokeThickness: 5});
        textResume.anchor.set(1);
        textResume.position.set(this.buttonResume.width/2,this.buttonResume.height/2);
        this.buttonResume.addChild(textResume);
        

        const torch_ui: Sprite = Sprite.from("torch_ui");
        torch_ui.scale.set(0.5);
        torch_ui.position.set(450,0);

        const title_pause: Text = new Text("Pause", {fontSize: 80,fill: "white", stroke: 0x000000, strokeThickness: 5});
        title_pause.position.set(160,100);

        document.addEventListener("keydown", this.onKeyDown.bind(this));
        

        this.addChild(wood_ui);
        this.addChild(paper_ui);
        this.addChild(torch_ui);
        this.addChild(gris_ui);
        this.addChild(title_pause);
        this.addChild(this.buttonResume);
        
    }
    private OnButtonClick() : void{
        console.log("new button clicked");
    }
    private onKeyDown(e: KeyboardEvent) : void{
        console.log("key pressed",e);
    }
}