type AvaraObject = {
    script: string;
    idx: number;
    fill: string;
    frame: string
}
type Placed = {
    x: number;
    z: number;
}

type Rect = {
    w: number;
    d: number;
}

export type Wall = (AvaraObject & Placed & Rect) & {
    wallHeight: number;
    wa: number;
    midYaw: number;
}

export type Ramp = (AvaraObject & Placed & Rect) & {
    start: number;
    extent: number;
}

export function getRamp(ctx, elem: Element, idx: number): Ramp {
    return {
        start: parseFloat(safeGet(elem, "start")) - 90,
        extent: parseFloat(safeGet(elem, "extent")),
        ...getColors(elem),
        ...getPlace(elem),
        ...getDims(elem),
        idx: idx,
        script: "",
    }
}

export function getWall(ctx, elem: Element, idx: number): Wall {
    return {
        ...getColors(elem),
        ...getPlace(elem),
        ...getDims(elem),
        midYaw: parseFloat(safeGet(elem, "midYaw")) ?? 0,
        idx: idx,
        script: "",
        wallHeight: ctx.wallHeight,
        wa: ctx.wa
    }
}

function getColors(elem: Element) {
    return {
        fill: safeGet(elem, "fill", "#FF00FF"),
        frame: safeGet(elem, "frame", "#000000"),
    }
}

function getPlace(elem: Element) {
    return {
        x: parseFloat(safeGet(elem, "x")),
        z: parseFloat(safeGet(elem, "z")),
    }
}

function getDims(elem: Element) {
    return {
        w: parseFloat(safeGet(elem, "w")),
        d: parseFloat(safeGet(elem, "d"))
    }
}

function safeGet(elem, attr, thedefault:any = 0) {
    let val = elem.getAttribute(attr)
    if (val)
    return elem.getAttribute(attr).replace(" ", "")
    else return thedefault
}
