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

</script>

<Canvas let:sti w={500} h={500} interactive>
    <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>
        <PerspectiveCamera 
            {scene} 
            id="cam1" 
            props={{ position: [0, 0, 3], lookAt: [0, 0, 0]}} />
        <DirectionalLight {scene} props={{position:[3, 3, 3]}} />
        <AmbientLight {scene} props={{ position: [3, 3, 3] }} />
         
    </Scene>
</Canvas>