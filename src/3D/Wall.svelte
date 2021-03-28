<script lang="ts">
import {
    MeshStandardMaterial,
    BoxBufferGeometry,
    Mesh
} from "svelthree"
import { getColorMat, radians, wallMesh } from "../util"
import type { AvaraObject, Wall } from "../alf"
import { selected } from "../store"
import { createEventDispatcher } from "svelte";

export let props:Wall & AvaraObject
export let scene

const dispatch = createEventDispatcher();
let onClick = (e, props) => {
    dispatch('clicked', {event: e, props: props})}



const min_thicc = 0.01

</script>

<Mesh
    interact
    {scene}
    geometry={wallMesh}
    material={getColorMat(props.fill)}
    pos={[
        props.x + (props.w < min_thicc ? min_thicc : props.w / 2),
        props.y + (props.h < min_thicc ? min_thicc : props.h / 2),
        props.z + (props.d < min_thicc ? min_thicc : props.d / 2)
    ]}
    scale={[
        props.w < min_thicc ? min_thicc : props.w,
        props.h < min_thicc ? min_thicc : props.h,
        props.d < min_thicc ? min_thicc : props.d,
    ]}
    rot = {[0, radians(props.midYaw), 0]}
    on:click={(e) => { onClick(e, props)}}
/>