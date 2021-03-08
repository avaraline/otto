<script lang="ts">
    import { onMount } from 'svelte';
    import Stage from './Stage.svelte'
    import Layer from './Layer.svelte'
    
    import Arc from './Arc.svelte'
    import Rect from './Rect.svelte'

    import { rects } from '../store'

    let myrects = [];

    rects.subscribe((t)=> {myrects = t})

    export let width = 300;
    export let height = 300;
    export let scale = 1.0;

    let container;
    onMount(() => {
    })
</script>

<Stage width={width} height={height} scale={scale}>
    <Layer>
        {#each myrects as r}
            <Rect
                x={r.left}
                y={r.top}
                w={r.width}
                h={r.height}
                fill={r.color}
                />
        {/each}
    </Layer>
</Stage>