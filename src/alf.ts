type AvaraObject = {
    script: string;
    idx: number;
}

export type Rect = AvaraObject & {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
    cx: number;
    cy: number;
    stroke: number;
    radius: number;
    color: string;
    wallHeight: number;
    wa: number;
}

export type Arc = AvaraObject & {
    start: number;
    extent: number;
    rx: number;
    ry: number;
    cx: number;
    cy: number;
    stroke: number;
    color1: string;
    color2: string;
}

export function getArc(ctx, elem: Element, idx: number): Arc {
    let r:Rect = getRect(ctx, elem, idx);
    return {
        start: parseInt(elem.getAttribute("start")) - 90,
        extent: parseInt(elem.getAttribute("extent")),
        rx: r.width / 2,
        ry: r.height / 2,
        cx: r.cx,
        cy: r.cy,
        stroke: r.stroke,
        idx: idx,
        script: elem.innerHTML,
        color1: r.color,
        color2: ctx.frameColor,
    }
}


export function getRect(ctx, elem:Element, idx:number): Rect {
    var x = parseInt(elem.getAttribute("x")),
        y = parseInt(elem.getAttribute("y")),
        w = parseInt(elem.getAttribute("w")),
        h = parseInt(elem.getAttribute("h")),
        s = parseInt(elem.getAttribute("s") ?? '0'),
        r = parseInt(elem.getAttribute("r") ?? '0');
    return {
        top: y,
        left: x,
        bottom: y + h,
        right: x + w,
        width: w,
        height: h,
        cx: x + (w / 2),
        cy: y + (h / 2),
        stroke: s,
        radius: r,
        idx: idx,
        script: elem.innerHTML,
        color: ctx.fillColor,
        wallHeight: ( r > 0 ? ((r / 8) + 1) : ctx.wallHeight) / 2,
        wa: ctx.wa,
    };
}

export function handleColor(ctx, elem: Element): void {
    if (elem.hasAttribute("frame"))
    ctx.frameColor = elem.getAttribute("frame");
    if (elem.hasAttribute("fill"))
    ctx.fillColor = elem.getAttribute("fill");
}