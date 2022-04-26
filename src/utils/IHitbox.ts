import { Rectangle } from "pixi.js";

export interface IHitbox {
    getHitbox() : Rectangle;
}
export function checkCollision(objA : IHitbox, objB : IHitbox) : Rectangle | null{
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