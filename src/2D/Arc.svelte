<script lang="ts">
import Konva from 'konva'
import { getContext, onDestroy } from 'svelte'

export let x = 0
export let y = 0
export let radius = 10
export let fill = "#FF0000"
export let stroke = "#000000"
export let angle = 90
export let idx = 0

export let onTransform = function(
    x: number,
    y: number,
    radius: number,
    angle: number
) { return undefined }

export let onClick = function(
    e:MouseEvent,
    tagidx: number,
    selected: boolean,
) { return undefined }

export let script = ""
export let selected = false

const { getLayer } = getContext("konva_layer")
const layer = getLayer()

const arc = new Konva.Arc({
    x: x,
    y: y,
    innerRadius: 0,
    outerRadius: radius,
    draggable: true,
    stroke: stroke,
    fill: fill,
    strokeWidth: 1,
    strokeScaleEnabled: false,
    angle: angle,
})

const tr = new Konva.Transformer({
    nodes: [arc],
    ignoreStroke: true,
    padding: 1,
})

const scriptPreview = new Konva.Text({
    text: script,
    x: arc.x() + 40,
    y: arc.y(),
    fontSize: 14,
    fill: "#ded",
    fontFamily: "mono",
    align: 'left',
    width: 300,
    padding: 20
})

const scriptPreviewRect = new Konva.Rect({
    x: arc.x() + 40,
    y: arc.y(),
    strokeWidth: 0,
    fill: '#333',
    opacity: 0.8,
    width: 300,
    height: scriptPreview.height(),
});

const wasTransformed = () => {
    onTransform(arc.x(), arc.y(), arc.outerRadius(), arc.angle())
}

layer.add(arc)
layer.add(tr)
layer.add(scriptPreview)
layer.add(scriptPreviewRect)

tr.hide()
scriptPreview.hide()
scriptPreviewRect.hide()

arc.on('transform', wasTransformed)
arc.on('click', (e) => {
    selected = !selected;
    
    if (selected) {
        scriptPreview.show()
        scriptPreviewRect.show()
        tr.show()
    }
    else {
        scriptPreview.hide()
        scriptPreviewRect.hide()
        tr.hide()
    }

    onClick(e.evt, idx, selected)
})
layer.draw()
onDestroy(() => arc.destroy())
</script>