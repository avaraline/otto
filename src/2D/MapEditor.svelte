<script lang="ts">
import { onMount } from 'svelte';
import Stage from './Stage.svelte'
import Layer from './Layer.svelte'

import Arc from './Arc.svelte'
import Rect from './Rect.svelte'

import { objects, bookmark} from '../store'
import type { AvaraObject } from '../alf';

export let width = 300;
export let height = 300;

let container;
onMount(() => {
})

let thingclicked = (evt, props:AvaraObject) => {
    console.log(props)
    bookmark.set({
        start: { 
            line: props.tag_start.line, 
            ch: props.tag_start.character 
        }, 
        end: {
            line: props.tag_end.line, 
            ch: props.tag_end.character
        }
    })
}

</script>

<Stage width={width} height={height}>
    <Layer>
        {#each $objects as o}
            <Rect
                props = {o}
                onClick = {thingclicked}
                />
        {/each}
    </Layer>
</Stage>