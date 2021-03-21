<script lang="ts">
import { onMount } from 'svelte';
import Stage from './Stage.svelte'
import Layer from './Layer.svelte'

import Arc from './Arc.svelte'
import Rect from './Rect.svelte'

import { objects, selected} from '../store'
import type { AvaraObject } from '../alf';

export let width = 300;
export let height = 300;

let container;
onMount(() => {
})

let thingclicked = (evt, props:AvaraObject) => {
    console.log(props)
    selected.set([props.idx])
}

</script>

<Stage width={width} height={height}>
    <Layer>
        {#each $objects as o}
            {#if o["tag_name"] == "Ramp" || o["tag_name"] == "Wall" || o["tag_name"] == "WallDoor"}
            <Rect
                props = {o}
                onClick = {thingclicked}
                />
            {/if}
        {/each}
    </Layer>
</Stage>