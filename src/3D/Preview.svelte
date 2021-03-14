<script lang="ts">
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
        Vector3
    } from "svelthree";
import Camera from "svelthree/src/components/Camera.svelte";
import type { AvaraObject } from "../alf";
    import { loadBSP } from  "../files"
    import { objects, ramps } from "../store"

    let wallMesh = new BoxBufferGeometry(1, 1, 1);
    let wallMat = new MeshStandardMaterial()

    export let width = 800;
    export let height = 500;

    let overX = 0, overY = 100, overZ = 0
    let minX = 0, maxX = 0, minZ = 0, maxZ = 0, maxY = 5

    //loadBSP(400).then((shape) => {wallMesh = shape})
    objects.subscribe((os) => {
        os.map((w: AvaraObject, idx) => {
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
    
    let radians = (deg) => deg * (Math.PI / 180)

</script>

<Canvas let:sti w={width} h={height}>
    <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
        <PerspectiveCamera 
            {scene} 
            id="cam1" 
            props={{ position: [overX, overZ, overY + 30], lookAt: [overX, overY, overZ], near: 0.1, far: 2000 }} />
        <DirectionalLight {scene} props={{position:[10, 10, 10]}} />
        <AmbientLight {scene} props={{ position: [3, 3, 3] }} intensity={0.3}/>
        {#each $objects as o}
            <Mesh
                {scene}
                geometry={wallMesh}
                material={wallMat.clone()}
                mat={{ color: o.fill }}
                pos={[
                    o.x + o.w / 2,
                    o.y + o.h / 2,
                    o.z + o.d / 2
                ]}
                scale={[
                    o.w,
                    o.h,
                    o.d
                ]}
                rot = {[0, radians(o.midYaw), 0]}
            />
        {/each}
        
        <OrbitControls {scene} enableDamping props={{target: new Vector3(overX, overY, overZ)}} />
        <WebGLRenderer
                {sti}
                sceneId="scene1"
                camId="cam1"
                config={{ antialias: true, alpha: true }} />
    </Scene>
</Canvas>