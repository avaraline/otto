<script lang="ts">
    import { onMount } from 'svelte';
    import Stage from './Stage.svelte'
    import Layer from './Layer.svelte'
    
    import Arc from './Arc.svelte'
    import Rect from './Rect.svelte'

    import { walls } from '../store'

    let mywalls = [];

    walls.subscribe((t)=> {mywalls = t})

    export let width = 300;
    export let height = 300;
    export let scale = {x: 3.0, y: 3.0};

    let container;
    onMount(() => {
    })
</script>

<Stage width={width} height={height} scale={scale}>
    <Layer>
        {#each mywalls as w}
            <Rect
                x={w.x}
                y={w.z}
                w={w.w}
                h={w.d}
                fill={w.fill}
                frame={w.frame}
                midYaw={w.midYaw}
                idx={w.idx}
                />
        {/each}
    </Layer>
</Stage>