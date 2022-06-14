import { Container, NineSlicePlane, Text, Texture } from "pixi.js";

export class Grey_ui extends Container{
    constructor(x: number, y: number, texto: string, fs: number, color: string, st: number, st_thick: number){
        super();
        const gris_ui = new NineSlicePlane(
            Texture.from("gris_ui"),
            10,10,10,10
        );
        gris_ui.position.set(x,y);
        const text : Text = new Text(texto, {fontSize: fs, fill: color, stroke: st, strokeThickness: st_thick});
        this.addChild(gris_ui);
        this.addChild(text);
    }
}