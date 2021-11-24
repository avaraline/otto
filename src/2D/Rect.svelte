<script lang="ts">
import Konva from 'konva';
import type { RectConfig } from 'konva/types/shapes/Rect';
import type { Box } from 'konva/types/shapes/Transformer';
import { onMount, getContext, onDestroy, afterUpdate } from 'svelte';
import { createEventDispatcher } from 'svelte'
import type { AvaraObject, Wall, Ramp } from '../alf';
import { selected } from "../store"

export let props:Wall & Ramp & AvaraObject

const dispatch = createEventDispatcher();
export let onTransform = (e, props) => {
    dispatch('transformed', {event: e, props: props})}
export let onClick = (e, props) => {
    dispatch('clicked', {event: e, props: props})}
export let onMove = (e, props) => {
    dispatch('moved', {event: e, props: props})}

const { getLayer } = getContext("konva_layer")
const layer = getLayer()

let rectprops = ():RectConfig => { return {
    x: props.x ,
    y: props.z,
    width: props.w,
    height: props.d,
    offsetX: props.w / 2,
    offsetY: props.d / 2,
    draggable: true,
    fill: props.fill,
    stroke: props.frame,
    strokeWidth: 1,
    strokeScaleEnabled: false,
    scale: {x: 1, y: 1},
    rotation: -props.midYaw
}}

let rect = new Konva.Rect(rectprops())

let tr = new Konva.Transformer({
    nodes: [rect],
    ignoreStroke: true,
    padding: 1,
});

rect.on('click', (ev) => { 
    onClick(ev.evt, props) 
});

rect.on('dragmove dragend', (ev) => {
    let newprops = props
    newprops.x = rect.x()
    newprops.z = rect.y()
    onMove(ev.evt, newprops)
});

tr.on('transform transformend', (e) => {
    let newprops = props
    newprops.x = rect.x()
    newprops.z = rect.y()
    newprops.w = rect.width() * rect.scaleX()
    newprops.d = rect.height() * rect.scaleY()
    newprops.midYaw = -rect.rotation()
    //rect.setAttrs(newprops)
    console.log("transformed")
    console.log(newprops)
    onTransform(e, newprops)
})

tr.boundBoxFunc((oldBox: Box, newBox: Box):Box => {
    if (newBox.width < .5 || newBox.height < .5) {
        return oldBox
    } else return newBox
})

onMount(() => {
    layer.add(rect)
    layer.add(tr)
    tr.hide()
    layer.draw()
})

afterUpdate(() => {
    rect.setAttrs(rectprops())
    if ($selected.includes(props.idx)) { 
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