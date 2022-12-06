import { Point } from "pixi.js";

export function calculateRotationTo(me: Point, objectPoint : Point) : number{
    const distance_x = objectPoint.x - me.x;
    const distance_y = objectPoint.y - me.y;
    const rot = (Math.atan2(distance_y, distance_x)) + 3.14/2;
    return rot;
}
   