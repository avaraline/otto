export const deg2rad = (d:number): number =>
{ return (Math.PI / 180.0) * d; }

export const equalish = (a:number, b:number): boolean =>
{ return Math.abs(a - b) < 10; }

export const radians = (deg:number): number => deg * (Math.PI / 180)

import { BoxBufferGeometry } from "svelthree";
import { DoubleSide, MeshLambertMaterial } from "svelthree-three"
let materials = {}

export const getColorMat = (color:string) => {
    if (!materials[color]) {
        materials[color] = new MeshLambertMaterial({
            color: color,
            side: DoubleSide
        })
    }
    return materials[color]
}

export const wallMesh = new BoxBufferGeometry(1, 1, 1);