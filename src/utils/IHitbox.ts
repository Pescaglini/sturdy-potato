import { Rectangle } from "pixi.js";

export interface IHitbox {
    getHitbox() : Rectangle;
    getHitCircle_Rad() : number;
    getHitCircle_Rec() : Rectangle;
    impactObjectAdder(obj : any) : void;
    takeDamage(damage : number) : void;
    isHitteable() : Boolean;
    readonly OBJECT_TYPE : String;
}
export function checkCollision_RR(objA : IHitbox, objB : IHitbox) : Rectangle | null{
    const rA = objA.getHitbox(); 
    const rB = objB.getHitbox();
    const rightmostLeft = rA.left < rB.left ? rB.left : rA.left;
    const leftmostRight = rA.right > rB.right ? rB.right : rA.right;
    const bottommostTop = rA.top < rB.top ? rB.top : rA.top;
    const topmostBottom = rA.bottom > rB.bottom ? rB.bottom : rA.bottom;

    const makesSenseHorizontal = rightmostLeft < leftmostRight;
    const makesSenseVertical = bottommostTop < topmostBottom;

    if( makesSenseHorizontal && makesSenseVertical){
        const retVal  = new Rectangle();
        retVal.x =  rightmostLeft;
        retVal.y =  bottommostTop;
        retVal.width = leftmostRight - rightmostLeft;
        retVal.height = topmostBottom - bottommostTop;
        return retVal;
    }
    return null; 
}
export function checkCollision_CC(objA : IHitbox, objB : IHitbox) : number | null{
    const rA = objA.getHitCircle_Rec(); 
    const rB = objB.getHitCircle_Rec();
    const minColisionDistance = objA.getHitCircle_Rad() + objB.getHitCircle_Rad();
    const objectsDistance_X = Math.abs((rA.left + rA.width/2) - (rB.left + rB.width/2)); 
    const objectsDistance_Y = Math.abs((rA.top + rA.height/2) - (rB.top + rB.height/2));
    const objectsDistance = Math.sqrt(Math.pow(objectsDistance_X,2) + Math.pow(objectsDistance_Y,2));

    if(minColisionDistance >= objectsDistance){
        return (minColisionDistance - objectsDistance);
    }
    return null; 
}