import { 
    avarluate_expression, 
    avarluate_script, 
    is_defined, 
    set_variable, 
    get_variable 
} from './avarluation'

type Color = {
    fill: string
    frame: string
}

type Placed = {
    x: number
    z: number
}

type Rect = {
    w: number
    d: number
}

type Arc = {
    start: number
    extent: number
}

type Actor = Placed & Color

export type Wall = (Actor & Rect) & {
    midYaw: number
}

export type Ramp = Actor & Rect & Arc

export type AvaraObject = Actor & {
    tag: Element
    tag_string: string
    xpath: string
    
}

let ctx = {
    fillColor: "#ffffff",
    frameColor: "#000000",
    wa: () => {
        if (is_defined('wa')) {
            let wa = get_variable('wa')
            return wa
        }
        else return 0
    },
    wallHeight: () =>  {
        if (is_defined('wallHeight')) {
            let wh =  get_variable('wallHeight')
            set_variable('wallHeight', 3);
            return wh
        }
        else return 3
    },
    lastRect: null,
    lastArcAngle: 0,
    handleObject: function (ctx, ins) {
        console.log(ins);
    }
}

function getRamp(elem: Element): Ramp {
    return {
        ...getColorPlaceDims(elem),
        start: safeAttr(elem, "start"),
        extent: safeAttr(elem, "extent"),
    }
}

function getWall(elem: Element): Wall {
    return {
        ...getColorPlaceDims(elem),
        midYaw: attrExpr(elem, "midYaw")
    }
}

function getColorPlaceDims(elem: Element) {
    return {
        ...getColors(elem),
        ...getPlace(elem),
        ...getDims(elem)
    }
}

function getColors(elem: Element) {
    return {
        fill: safeAttr(elem, "fill", "#FF00FF"),
        frame: safeAttr(elem, "frame", "#000000"),
    }
}

function getPlace(elem: Element) {
    let y = attrExpr(elem, "y")
    if (!y) y = ctx.wa()
    return {
        x: attrExpr(elem, "x"),
        y: y,
        z: attrExpr(elem, "z"),
    }
}

function getDims(elem: Element) {
    let h = attrExpr(elem, "h")
    if (!h || h == 0) h = ctx.wallHeight()
    return {
        w: attrExpr(elem, "w"),
        d: attrExpr(elem, "d"),
        h: h
    }
}

function safeAttr(elem, attr, thedefault:any = 0) {
    let val = elem.getAttribute(attr)
    if (val)
    return elem.getAttribute(attr).replace(" ", "")
    else return thedefault
}

function attrExpr(elem, attr) {
    let val = safeAttr(elem, attr, "")
    let result = avarluate_expression(val);
    if (result) return result;
    else return 0;
}

export function objectsFromMap(map_string:string): any {
    if (!map_string) return []
    let doc = new DOMParser().parseFromString(map_string, "text/xml")
    let themap = doc.querySelector("map")
    let objects = new Array<AvaraObject> ()
    let _ = [...themap.children].forEach((elem, idx) => {
        switch (elem.tagName.toLowerCase()) {
            case "set":
                if (elem.hasAttributes())
                    [...elem.attributes].map(attr => 
                        avarluate_script(`${attr.name} = ${attr.value}`))
                break
            case "walldoor":
            case "wall":
                let w = getWall(elem)
                ctx.lastRect = w
                objects.push({
                    ...w
                })
                break
            case "ramp":
                let r = getRamp(elem)
                break
        }
    })
    return objects
}