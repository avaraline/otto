<script lang="ts">
import {
    MeshStandardMaterial,
    BoxBufferGeometry,
    Mesh
} from "svelthree"
import { radians } from "../util"
import type { Wall } from "../alf"
import { selected } from "../store"

export let props:Wall
export let scene
export const onClick = undefined


let wallMesh = new BoxBufferGeometry(1, 1, 1);
let wallMat = new MeshStandardMaterial()

const min_thicc = 0.01
</script>

<Mesh
    interact
    {scene}
    geometry={wallMesh}
    material={wallMat.clone()}
    mat={{ color: props.fill }}
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
    on:click={() => {selected.set([props.idx])}}
/>