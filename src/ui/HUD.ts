import { Container, Text, Texture } from "pixi.js";
import { Player } from "../entities/Character/Player";
import { Weapon } from "../entities/Weapons/Weapon";
import { Bar } from "./Bar";


export class HUD extends Container{
    private player : Player;
    private activeWeapon : Weapon;
    private healthBar : Bar;
    private textAmmo : Text;

    constructor(player : Player, activeWeapon : Weapon){
        super();
        this.player = player;
        this.healthBar = new Bar(this.player.getHealth(),this.player.getMaxHealth(),5,Texture.from("redBar"));
        this.healthBar.position.set(50,30);
        
        this.activeWeapon = activeWeapon;
        this.textAmmo = new Text("Arrows: ", {fontSize: 20,fill: "white", stroke: 0x000000, strokeThickness: 3});
        this.textAmmo.text = "Arrows: " + this.activeWeapon.getAmmoCount();
        this.textAmmo.position.set(50,60);
        
        this.addChild(this.healthBar);
        this.addChild(this.textAmmo);
       
    }
    
    public update(){
        this.healthBar.update(this.player.getHealth());
        this.changeValues();
    }

    private changeValues() : void {
        this.textAmmo.text = "Arrows: " + this.activeWeapon.getAmmoCount();
    }

}