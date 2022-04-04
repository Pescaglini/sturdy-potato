import { Container, NineSlicePlane, Sprite, Texture, Text } from "pixi.js";
import { Button } from "./Button";

export class Gui_pause extends Container{

    private buttonResume : Button;
    private buttonOptions : Button;
    private buttonMainMenu : Button;

    constructor(){
        super();

        const wood_ui = new NineSlicePlane(
            Texture.from("wood_gi"),
            35,35,35,35
        );
        wood_ui.height += 40; 
        wood_ui.scale.set(1);

        const paper_ui = new NineSlicePlane(
            Texture.from("paper_ui"),
            35,35,35,35
        );
        paper_ui.scale.set(1.1);
        paper_ui.height += 40;
        paper_ui.position.set(50,60);

        
        const gris_ui = new NineSlicePlane(
            Texture.from("gris_ui"),
            35,35,35,35
        );
        gris_ui.width = 350;
        gris_ui.height = 100;
        const textScore: Text = new Text("Score: 0", {fontSize: 55,fill: "white", stroke: 0x000000, strokeThickness: 5});
        textScore.position.set(35,15);
        const pauseScore_ui_container : Container = new Container();
        pauseScore_ui_container.addChild(gris_ui);
        pauseScore_ui_container.addChild(textScore);
        pauseScore_ui_container.position.set(100,180);


        this.buttonResume = new Button(Texture.from("plank_ui"),
                                        Texture.from("plank_ui"),
                                        Texture.from("plank_ui"), 
                                        this.OnButtonClick.bind(this));
        this.buttonResume.scale.set(0.5);
        this.buttonResume.position.set(275,680);
        const textResume: Text = new Text("Resume", {fontSize: 100,fill: "white", stroke: 0x000000, strokeThickness: 5});
        textResume.anchor.set(1);
        textResume.position.set(this.buttonResume.width/2,this.buttonResume.height/2);
        this.buttonResume.addChild(textResume);

        
        this.buttonOptions = new Button(Texture.from("plank_ui"),
                                        Texture.from("plank_ui"),
                                        Texture.from("plank_ui"), 
                                        this.OnButtonClick.bind(this));
        this.buttonOptions.scale.set(0.5);
        this.buttonOptions.position.set(275,530);
        const textOptions: Text = new Text("Options", {fontSize: 100,fill: "white", stroke: 0x000000, strokeThickness: 5});
        textOptions.anchor.set(1);
        textOptions.position.set(this.buttonOptions.width/2,this.buttonOptions.height/2);
        this.buttonOptions.addChild(textOptions);


        this.buttonMainMenu = new Button(Texture.from("plank_ui"),
                                        Texture.from("plank_ui"),
                                        Texture.from("plank_ui"), 
                                        this.OnButtonClick.bind(this));
        this.buttonMainMenu.scale.set(0.5);
        this.buttonMainMenu.position.set(275,380);
        const textMainMenu: Text = new Text("Main Menu", {fontSize: 100,fill: "white", stroke: 0x000000, strokeThickness: 5});
        textMainMenu.anchor.set(1);
        textMainMenu.position.set(this.buttonMainMenu.width/2 + 80,this.buttonMainMenu.height/2);
        this.buttonMainMenu.addChild(textMainMenu);

        
        const torch_ui: Sprite = Sprite.from("torch_ui");
        torch_ui.scale.set(0.5);
        torch_ui.position.set(450,0);


        const title_pause: Text = new Text("Pause", {fontSize: 80,fill: "white", stroke: 0x000000, strokeThickness: 5});
        title_pause.position.set(160,80);

        
        this.addChild(wood_ui);
        this.addChild(paper_ui);
        this.addChild(torch_ui);
        this.addChild(pauseScore_ui_container);
        this.addChild(title_pause);
        this.addChild(this.buttonResume);
        this.addChild(this.buttonOptions);
        this.addChild(this.buttonMainMenu);
        
    }
    private OnButtonClick() : void{
               
    }
}