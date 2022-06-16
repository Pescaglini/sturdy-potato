import { Container, Loader, Point } from "pixi.js";

export class Maps extends Container{
    private current_map_array : Array<number>;
    constructor(){
        super();
        this.current_map_array = Loader.shared.resources.map1_js.data.layers[0].data;
        console.log(this.current_map_array);
    }

    public getMapArray(): Array<number>{
        return this.current_map_array;
    }
    
    public isInAvaibleSquare (pos : Point) : Boolean{
        const index_x = Math.trunc(pos.x/32);
        const index_y = Math.trunc(pos.y/32);
        const tile_value = this.current_map_array[(index_y*100)+index_x];
        //CAMBIAR ESTE IF A UN CHEQUEO CON UN MAP DE ID QUE NO SE PUEDE PISAR
        if(tile_value >= 0 && tile_value <= 15){
            return false;
        }
        return true;
    }
}