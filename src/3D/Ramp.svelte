<script lang="ts">
import {
    MeshStandardMaterial,
    BoxBufferGeometry,
    Mesh
} from "svelthree"

import { afterUpdate, createEventDispatcher } from "svelte"
import type { AvaraObject, Ramp } from "../alf";
import { selected } from "../store"
import { getColorMat, wallMesh } from "../util";

export let props:(AvaraObject & Ramp) 
export let scene

const dispatch = createEventDispatcher();
let onClick = (e, props) => {
    dispatch('clicked', {event: e, props: props})}

const solveOrientation = (x:number, y:number, h:number): {w:number, angle:number} => {
    var minGuess = -(0x3C00 / 65536),
        maxGuess = (0x3C00 / 65536);
    var solved = {
        w: 0,
        angle: 0
    };
    for (var i = 0; i < 20; i++) {
        var guess = (minGuess + maxGuess) / 2;
        var sinGuess = Math.sin(guess * 2 * Math.PI),
            cosGuess = Math.cos(guess * 2 * Math.PI);
        solved.w = (x - (h * sinGuess)) / cosGuess;
        var result = (solved.w * sinGuess) + (h * cosGuess);
        if (result > y) {
            maxGuess = guess;
        }
        else {
            minGuess = guess;
        }
    }
    solved.angle = (minGuess + maxGuess) / 2;
    return solved;
}

let sx = 1, sy = 1, sz = 1;
let rx = 0, rz = 0;

let updateRamp = () => {
    let heading = props.lastArcAngle / 360
    sx = props.w
    sy = props.h
    sz = props.d

    rx = 0
    rz = 0

    var headingSign = heading < 0.875 && heading > 0.375 ? -1 : 1;
    if ((heading >= 0.125 && heading < 0.375) || (heading >= 0.625 && heading < 0.875)) {

        var solved = solveOrientation(sx, props.deltaY, sy);
        sx = (solved.w + (solved.w / 512));
        rz = -(solved.angle * 2 * Math.PI * headingSign);
    }
    else {

        var solved = solveOrientation(sz, props.deltaY, sy);
        sz = (solved.w + (solved.w / 512));
        rx = solved.angle * 2 * Math.PI * headingSign;
    }

    if (sy == 0) sy = 0.01
    /*
    console.log(props)
    console.log("Ramp solution:", {
        scale: [sx, sy, sz],
        rot: [rx, 0, rz],
        heading: heading,
        pos: [
            props.x + props.w / 2,
            props.y + props.h / 2 + (props.deltaY / 2),
            props.z + props.d / 2
        ]
    })
    */
}

updateRamp()
afterUpdate(updateRamp)
</script>
    
<Mesh
    interact
    {scene}
    geometry={wallMesh}
    material={getColorMat(props.fill)}
    pos={[
        props.x ,
        props.y + props.h / 2 + (props.deltaY / 2),
        props.z 
    ]}
    scale={[sx, sy, sz]}
    rot={[rx, 0, rz]}
    on:click={(e) => { onClick(e, props) }}
/>