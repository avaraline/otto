<script lang="ts">
    import Konva from 'konva';
    import { getContext, onDestroy } from 'svelte';

    export let x = 0
    export let y = 0
    export let w = 10
    export let h = 10
    export let fill = "#00FF00"
    export let stroke = "#000000"
    export let strokeWidth = 1
    export let idx = 0
    export let selected = false
    export let radius = 0


    export let onTransform = undefined
    export let onClick = undefined

    const { getLayer } = getContext("konva_layer")
    const layer = getLayer()
    
    const rect = new Konva.Rect({
        x: x,
        y: y,
        width: w,
        height: h,
        draggable: true,
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth,
        strokeScaleEnabled: false,
        cornerRadius: radius
    })

    const tr = new Konva.Transformer({
        nodes: [rect],
        ignoreStroke: true,
        padding: strokeWidth
    });

    const wasTransformed = () => {
        const new_width = rect.width() * rect.scaleX()
        const new_height = rect.height() * rect.scaleY()
        onTransform(rect.x, rect.y, new_width, new_height)
    }
    tr.rotateEnabled(false)

    layer.add(rect)
    layer.add(tr)
    tr.hide()
    rect.on('transform', wasTransformed)
    rect.on('click', (e) => {
        selected = !selected;
        if (selected) {
            tr.show()
        }
        else{
            tr.hide()
        }
        onClick(e.evt, idx, selected)
    })
    layer.draw()
    onDestroy(() => rect.destroy())
</script>