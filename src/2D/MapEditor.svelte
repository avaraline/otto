<script lang="ts">
    import { onMount } from 'svelte';
    import Stage from './Stage.svelte'
    import Layer from './Layer.svelte'
    
    import Arc from './Arc.svelte'
    import Rect from './Rect.svelte'

    import { objects } from '../store'

    let myobjs = [];

    objects.subscribe((t)=> {myobjs = t})

    export let width = 300;
    export let height = 300;
    export let scale = {x: 3.0, y: 3.0};

    let container;
    onMount(() => {
    })
</script>

<Stage width={width} height={height} scale={scale}>
    <Layer>
        {#each myobjs as w}
            <Rect
                props = {w}
                />
        {/each}
    </Layer>
</Stage>