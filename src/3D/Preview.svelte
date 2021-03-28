<script lang="ts">
import {
    Canvas,
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    OrbitControls,
    Vector3,
} from "svelthree";
import { objects, selected } from "../store"
import Wall from "./Wall.svelte"
import Ramp from "./Ramp.svelte"
import Goody from "./Goody.svelte"
import Lights from "./Lights.svelte"
import SkyBox from "./SkyBox.svelte"
export let width = 800;
export let height = 500;

let overX = 0, overY = 100, overZ = 0
let minX = 100000, maxX = 0, minZ = 100000, maxZ = 0, maxY = 0
let initCam = true
let cameraTarget = new Vector3(0, 10, 0)
let pcam

objects.subscribe((os) => {
    os.map((w, idx) => {
        let hw = w.w / 2
        let hd = w.d / 2
        let hh = w.h / 2
        if (w.x - hw < minX) minX = w.x - hw
        if (w.z - hd < minZ) minZ = w.z - hd
        if (w.x + hw > maxX) maxX = w.x + hw
        if (w.y + hh > maxY) maxY = w.y + hh
        if (w.z + hd > maxZ) maxZ = w.z + hd
        if (w.wa && w.wa > maxY) 
            maxY = w.wa
    })
    overX = (minX + maxX) / 2
    overY = maxY / 2
    overZ = (minZ + maxZ) / 2

    if(pcam && initCam) {
        let c = pcam.getCamera()
        cameraTarget.set(overX, overY, overZ)
        console.log(c.position)
        if (c.position )
        c.position.set(overX, overY + 100, overZ + 100)
        initCam = false
    }

})

selected.subscribe((idxs) => {
    if (idxs.length < 1) return
    let x = 0, y = 0, z = 0
    idxs.map((idx) => {
        x += ($objects[idx].x ?? $objects[idx].cx) + $objects[idx].w / 2
        y += $objects[idx].y + $objects[idx].h / 2
        z += ($objects[idx].z ?? $objects[idx].cz) + $objects[idx].d / 2
    })
    cameraTarget.set(
        x / idxs.length,
        y / idxs.length,
        z / idxs.length
    )
    console.log(cameraTarget)
})
let myscene:Scene
export const getScene = () => myscene.getScene()

</script>

<Canvas let:sti w={width} h={height} interactive>
    <Scene {sti} let:scene bind:this={myscene} id="scene1" props={{ background: 0xedf2f7 }}>
        <PerspectiveCamera 
            {scene} 
            bind:this={pcam}
            id="cam1" 
            props={{near: 0.1, far: 2500 }}>
        </PerspectiveCamera>
        <SkyBox {scene} />
        <Lights {scene} />
        {#each $objects as props}
            {#if props.tag_name == "Wall" || props.tag_name == "WallDoor"}
                <Wall {scene} {props} on:clicked />
                
            {:else if props.tag_name == "Ramp"}
                <Ramp {scene} {props} on:clicked />

            {:else if props.tag_name == "Goody"}
                <Goody {scene} {props} on:clicked />
            {/if}
        {/each}
        <OrbitControls {scene} enableDamping props={{target: cameraTarget}} />
        <WebGLRenderer
                {sti}
                sceneId="scene1"
                camId="cam1"
                config={{ antialias: true, alpha: true }} />
    </Scene>
</Canvas>