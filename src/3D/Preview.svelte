<script lang="ts">
import { createEventDispatcher } from "svelte"
import {
    Canvas,
    Scene,
    PerspectiveCamera,
    Mesh,
    DirectionalLight,
    MeshStandardMaterial,
    BoxBufferGeometry,
    WebGLRenderer,
    AmbientLight,
    OrbitControls,
    Vector3,
Material,
} from "svelthree";
import { objects } from "../store"
import Wall from "./Wall.svelte"
import Ramp from "./Ramp.svelte"
import Goody from "./Goody.svelte"
export let width = 800;
export let height = 500;

let overX = 0, overY = 100, overZ = 0
let minX = 0, maxX = 0, minZ = 0, maxZ = 0, maxY = 5



//loadBSP(400).then((shape) => {wallMesh = shape})
objects.subscribe((os) => {
    os.map((w, idx) => {
        if (w.x < minX) minX = w.x
        if (w.z < minZ) minZ = w.z
        if (w.x > maxX) maxX = w.x
        if (w.z > maxZ) maxZ = w.z
        if (w.wa && w.wa > maxY) 
            maxY = w.wa
    })
    overX = (minX + maxX) / 2
    overY = maxY
    overZ = (minZ + maxZ) / 2
})
let myscene:Scene
export const getScene = () => myscene.getScene()

export const handleClick = (e) => {
    console.log(e)
};

</script>

<Canvas let:sti w={width} h={height} interactive>
    <Scene {sti} let:scene bind:this={myscene} id="scene1" props={{ background: 0xedf2f7 }}>
        <PerspectiveCamera 
            {scene} 
            id="cam1" 
            props={{ position: [overX, overZ, overY + 30], lookAt: [overX, overY, overZ], near: 0.1, far: 2000 }} />
        <DirectionalLight {scene} props={{position:[10, 10, 10]}} />
        <AmbientLight {scene} props={{ position: [3, 3, 3] }} intensity={0.3}/>
        {#each $objects as props}
            {#if props.tag_name == "Wall" || props.tag_name == "WallDoor"}
                <Wall {scene} {props} on:click={handleClick}/>
                
            {:else if props.tag_name == "Ramp"}
                <Ramp {scene} {props} on:click={handleClick}/>

            {:else if props.tag_name == "Goody"}
                <Goody {scene} {props} on:click={handleClick}/>
            {/if}
        {/each}
        
        <OrbitControls {scene} enableDamping props={{target: new Vector3(overX, overY, overZ)}} />
        <WebGLRenderer
                {sti}
                sceneId="scene1"
                camId="cam1"
                config={{ antialias: true, alpha: true }} />
    </Scene>
</Canvas>