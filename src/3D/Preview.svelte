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
        Vector3,
        MathUtils
    } from "svelthree";
    import { loadBSP } from  "../files"
    import { rects, arcs } from "../store"

    let wallMesh = new BoxBufferGeometry(1, 1, 1);
    let wallMat = new MeshStandardMaterial()

    export let width = 500;
    export let height = 500;


    //loadBSP(400).then((shape) => {wallMesh = shape})
    

</script>

<Canvas let:sti w={width} h={height}>
    <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
        <PerspectiveCamera 
            {scene} 
            id="cam1" 
            props={{ position: [0, 10, 0], lookAt: [0, 0, 0], near: 0.1, far: 2000 }} />
        <DirectionalLight {scene} props={{position:[3, 3, 3]}} />
        <AmbientLight {scene} props={{ position: [3, 3, 3] }} />
        {#each $rects as r}
            <Mesh
                {scene}
                geometry={wallMesh}
                material={wallMat}
                mat={{color: r.color}}
                pos={[
                    (r.right + r.left) * (5 / 144),
                    r.wallHeight + r.wa,
                    (r.bottom + r.top) * (5 / 144),
                ]}
                scale={[
                    (r.width / 72) * 2.5, 
                    r.wallHeight,
                    (r.height / 72) * 2.5
                ]}
            />
        {/each}
    </Scene>
</Canvas>