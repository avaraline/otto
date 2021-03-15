<script lang="ts">
    import { onMount } from 'svelte';
    import Stage from './Stage.svelte'
    import Layer from './Layer.svelte'
    
    import Arc from './Arc.svelte'
    import Rect from './Rect.svelte'

    import { objects, bookmark} from '../store'

    export let width = 300;
    export let height = 300;

    let container;
    onMount(() => {
    })

    let thingclicked = (evt, props) => {
        console.log(props)
        bookmark.set(props.xpath)
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