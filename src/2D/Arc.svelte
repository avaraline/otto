<script lang="ts">
import Konva from 'konva'
import type { ArcConfig } from 'konva/types/shapes/Arc';
import { afterUpdate, getContext, onDestroy } from 'svelte'
import type { AvaraObject, Arc } from '../alf';
import { selected } from '../store'

export let props:AvaraObject & Arc

export let onTransform = function(
    e:any,
    props:AvaraObject & Arc
) { return undefined }

export let onClick = function(
    e:MouseEvent,
    props:AvaraObject & Arc
) { return undefined }

const { getLayer } = getContext("konva_layer")
const layer = getLayer()

let arcprops = ():ArcConfig => { return {
    x: props.cx,
    y: props.cz,
    innerRadius: 0,
    outerRadius: props.r,
    draggable: true,
    stroke: props.frame,
    fill: props.fill,
    strokeWidth: 1,
    strokeScaleEnabled: false,
    angle: props.angle,
}}

const arc = new Konva.Arc(arcprops())

const tr = new Konva.Transformer({
    nodes: [arc],
    ignoreStroke: true,
    padding: 1,
})

layer.add(arc)
layer.add(tr)

tr.hide()

arc.on('transform', (e) => {
    onTransform(e, props)
})
arc.on('click', (e) => {
    selected.set([props.idx])
    onClick(e.evt, props)
})
layer.draw()

afterUpdate(() => {
    arc.setAttrs(arcprops())
    if ($selected.includes(props.idx)) {
        tr.show()
        tr.forceUpdate()
    }
    else tr.hide()
})
onDestroy(() => arc.destroy())
</script>