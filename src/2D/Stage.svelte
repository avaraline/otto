<script lang='ts'>
    import Konva from 'konva';
    import { onMount, setContext } from 'svelte';

    setContext("konva", {
        getStage: () => stage
    })

    let container;
    let stage;
    export let width = 300;
    export let height = 300;
    export let scale = 1.0;
    onMount(() => {
        stage = new Konva.Stage({
            container: container,
            width: width,
            height: height,
            scale: {x: scale, y: scale},
        })
    })
</script>

<div bind:this={container}>
{#if container}
    <slot></slot>
{/if}
</div>