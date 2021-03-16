<script lang="ts">
import Konva from 'konva';
import { onMount, getContext, onDestroy, afterUpdate } from 'svelte';
import type { Wall } from '../alf';

export let props:Wall

export let onTransform = (x, y, newx, newy) => {}
export let onClick = (evt, props) => {}

let selected = false
export const select = () => selected = true
export const unselect = () => selected = false

const { getLayer } = getContext("konva_layer")
const layer = getLayer()

let rectprops = () => { return {
    x: props.x + (props.w / 2),
    y: props.z + (props.d / 2),
    width: props.w,
    height: props.d,
    offsetX: props.w / 2,
    offsetY: props.d / 2,
    draggable: true,
    fill: props.fill,
    stroke: props.frame,
    strokeWidth: 1,
    strokeScaleEnabled: false,
    //cornerRadius: props.radius ?? 0,
    rotation: props.midYaw ? props.midYaw + 90 : 0
}}

let rect = new Konva.Rect(rectprops())

let tr = new Konva.Transformer({
    nodes: [rect],
    ignoreStroke: true,
    padding: 1,
});

const wasTransformed = () => {
    const new_width = rect.width() * rect.scaleX()
    const new_height = rect.height() * rect.scaleY()
    onTransform(rect.x, rect.y, new_width, new_height)
}

rect.on('transform', wasTransformed)
rect.on('click', (ev) => { 
    selected = !selected
    onClick(ev.evt, props) 
});

onMount(() => {
    layer.add(rect)
    layer.add(tr)
    tr.hide()
    layer.draw()
})

afterUpdate(() => {
    rect.setAttrs(rectprops())
    if (selected) { 
        tr.show()
        tr.forceUpdate()
    }
    else tr.hide()
})

onDestroy(() => {
    rect.destroy()
    tr.destroy()
})
</script>