<script lang="ts">
import {
    MeshStandardMaterial,
    BoxBufferGeometry,
    Mesh
} from "svelthree"
import { radians } from "../util"
import type { Wall } from "../alf"

export let props:Wall
export let scene


let wallMesh = new BoxBufferGeometry(1, 1, 1);
let wallMat = new MeshStandardMaterial()
</script>

<Mesh
    {scene}
    geometry={wallMesh}
    material={wallMat.clone()}
    mat={{ color: props.fill }}
    pos={[
        props.x + props.w / 2,
        props.y + props.h / 2,
        props.z + props.d / 2
    ]}
    scale={[
        props.w,
        props.h,
        props.d
    ]}
    rot = {[0, radians(props.midYaw), 0]}
/>