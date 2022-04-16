import { Container, Texture } from "pixi.js";




export class Weapon extends Container {
    private texture_projectile : Texture;
    private ammo_count : number;
    
    constructor(texture_projectile : Texture, ammo_count : number){
        super();
        this.texture_projectile = texture_projectile;
        this.ammo_count = ammo_count;
    }

    public hasAmmo() : Boolean{
        if(this.ammo_count > 0){
            return true;
        }else{
            return false;
        }
    }

    public getAmmoTexture() : Texture{
        return this.texture_projectile;
    }

    public substract_ammo() : void{
        this.ammo_count = this.ammo_count - 1;
        console.log(this.ammo_count)
    }


}