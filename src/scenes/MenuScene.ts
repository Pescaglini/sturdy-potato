import { Container } from "pixi.js";
import { IUpdateable } from "../utils/IUpdateable";



export class MenuScene extends Container implements IUpdateable{
    //IMPLEMENTAR ESTA WEA

    public constructor(){
        super();
    }


    public update(_deltaTime: number, _deltaFrame: number): void {
        throw new Error("Method not implemented.");
    }

}