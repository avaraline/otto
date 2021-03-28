<script lang="ts">
import Konva from 'konva';
import type { ArrowConfig } from 'konva/types/shapes/Arrow';
import type { RectConfig } from 'konva/types/shapes/Rect';
import { onMount, getContext, onDestroy, afterUpdate } from 'svelte';
import { createEventDispatcher } from 'svelte'
import type { AvaraObject, Ramp } from '../alf';

export let props:Ramp & AvaraObject

const dispatch = createEventDispatcher();
export let onTransform = (e, props) => {
    dispatch('transformed', {event: e, props: props})}
export let onClick = (e, props) => {
    dispatch('clicked', {event: e, props: props})}
export let onMove = (e, props) => {
    dispatch('moved', {event: e, props: props})}

import { selected } from "../store"
import invert from "invert-color"
import type { Box } from 'konva/types/shapes/Transformer';

const { getLayer } = getContext("konva_layer")
const layer = getLayer()

let rectprops = ():RectConfig => { return {
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
    strokeScaleEnabled: false
}}

let arrowprops = ():ArrowConfig => { 
    // draw an arrow pointing towards the incline of the ramp
    // meaning travelling this direction on the ramp will raise
    // you by deltaY
    let heading = props.lastArcAngle / 360
    let p1, p2
    var headingSign = heading < 0.875 && heading > 0.375 ? -1 : 1;
    if ((heading >= 0.125 && heading < 0.375) || (heading >= 0.625 && heading < 0.875)) {
        // x +/-
        p1 = [props.x + 10, props.z + (props.d / 2)]
        p2 = [(props.x + props.w) - 10, props.z + (props.d / 2)]
    }
    else {
        // y +/-
        p1 = [props.x + (props.w / 2), props.z + 10]
        p2 = [props.x + (props.w / 2), (props.z + props.d) - 10]
        
    }
    // reverse direction
    if(headingSign < 0) {
        let temp = p1
        p1 = p2
        p2 = temp
    }
    
    return {
        points: [
            ...p1,
            ...p2
        ],
        stroke: invert(props.fill, true),
        strokeWidth: .5,
        pointerLength: 1,
        pointerWidth: 1
    }
}

let rect = new Konva.Rect(rectprops())

let tr = new Konva.Transformer({
    nodes: [rect],
    ignoreStroke: true,
    padding: 1,
    rotateEnabled: false
});

let arrow = new Konva.Arrow(arrowprops())

rect.on('click', (ev) => { 
    onClick(ev.evt, props) 
});

rect.on('dragmove dragend', (ev) => {
    let newprops = props
    newprops.x = rect.x() - rect.offsetX()
    newprops.z = rect.y() - rect.offsetY()
    onMove(ev.evt, newprops)
});

tr.on('transform transformend', (e) => {
    let newprops = props
    newprops.x = rect.x() - rect.offsetX()
    newprops.z = rect.y() - rect.offsetY()
    newprops.w = rect.width() * rect.scaleX()
    newprops.d = rect.height() * rect.scaleY()
    onTransform(e, newprops)
})

tr.boundBoxFunc((oldBox: Box, newBox: Box):Box => {
    if (newBox.width < .5 || newBox.height < .5) {
        return oldBox
    } else return newBox
})

let g = new Konva.Group({
    scale: {x: 3.0, y:3.0}
})

onMount(() => {
    g.add(rect)
    g.add(arrow)
    layer.add(g)
    layer.add(tr)
    tr.hide()
    layer.draw()
})

afterUpdate(() => {
    rect.setAttrs(rectprops())
    if (props.tag_name == 'Ramp')
    arrow.setAttrs(arrowprops())
    if ($selected.includes(props.idx)) { 
        tr.show()
        tr.forceUpdate()
    }
    else tr.hide()
})

onDestroy(() => {
    rect.destroy()
    tr.destroy()
    arrow.destroy()
})
</script>