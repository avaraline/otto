<script lang="ts">
import { onMount } from 'svelte';
import Stage from './Stage.svelte'
import Layer from './Layer.svelte'

import Arc from './Arc.svelte'
import Rect from './Rect.svelte'

import { objects, selected } from '../store'
import type { AvaraObject, Wall, Ramp, Goody } from '../alf';
import Ramp2D from './Ramp2D.svelte';

export let width = 300;
export let height = 300;

let container;
onMount(() => {
})
</script>

<Stage width={width} height={height}>
    <Layer>
        {#each $objects as props}
            {#if props["tag_name"] == "Wall" || props["tag_name"] == "WallDoor"}
                <Rect {props} on:clicked on:transformed on:moved />
            {:else if props["tag_name"] == "Ramp"}
                <Ramp2D {props} on:clicked on:transformed on:moved />
            {/if}
        {/each}
    </Layer>
    <Layer>
        {#each $objects as o}
            {#if o["tag_name"] == "Goody"}
                <Arc props={o}/>
            {/if}
        {/each}
    </Layer>
</Stage>