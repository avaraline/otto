<script lang='ts'>
import Konva from 'konva';
import { afterUpdate, onMount, setContext } from 'svelte';

setContext("konva", {
    getStage: () => stage
})

let container;
let stage;
export let width = 300;
export let height = 300;
let scale = {x: 3.0, y: 3.0};
onMount(() => {
    stage = new Konva.Stage({
        container: container,
        width: width,
        height: height,
        scale: scale,
    })
})
afterUpdate(() => {
    stage.setAttr("width", width);
    stage.setAttr("height", height);
    stage.scale(scale);
})
</script>

<div bind:this={container}>
{#if container}
    <slot></slot>
{/if}
</div>