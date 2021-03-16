<script lang="ts">
import Konva from 'konva';
import { getContext, setContext } from 'svelte';
const { getStage } = getContext("konva");
setContext("konva_layer", {
    getLayer: () => layer
})
const stage = getStage()
let layer = new Konva.Layer()
stage.add(layer)
</script>

<slot></slot>