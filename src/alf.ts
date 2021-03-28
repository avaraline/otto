import { 
    avarluate_expression, 
    avarluate_script, 
    is_defined, 
    get_variable
} from './avarluation'
import { Tag, SaxEventType, SAXParser, Position } from 'sax-wasm';
import { decode } from "he"
import { skyColor, horizonColor, groundColor } from './store'

let parser
let parser_loaded = false

async function loadAndPrepareWasm() {
    if (parser_loaded) return parser;
    const saxWasmResponse = await fetch('sax-wasm.wasm');
    const saxWasmbuffer = await saxWasmResponse.arrayBuffer();
    parser = new SAXParser(
        SaxEventType.Text | SaxEventType.Attribute | SaxEventType.CloseTag, 
        { highWaterMark: 64 * 1024 } // 64k chunks
    );

    // Instantiate and prepare the wasm for parsing
    const ready = await parser.prepareWasm(
        new Uint8Array(saxWasmbuffer)
    );
    if (ready) {
        parser_loaded = true;
        return parser;
    }
}

type Color = {
    fill: string
    frame: string
}

type Placed = {
    x: number
    y: number
    z: number
}

type Rect = {
    w: number
    h: number
    d: number
}

export type Arc = {
    cx: number
    cz: number
    lastArcAngle: number
    extent: number
    angle: number
    r: number
}

type Actor = Placed & Color

export type Wall = (Actor & Rect) & {
    midYaw: number
}

export type Goody = Arc & Color & {
    y: number
    shape: number
    missiles: number
    grenades: number
    boosters: number
    start: number
    out: number
    speed: number
}

export type Ramp = Actor & Rect & Arc & {
    deltaY: number
}

export type AvaraObject = Actor & {
    tag: Tag
    tag_name: string
    tag_start: Position
    tag_end: Position
    idx: number
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
            return wh
        }
        else return 3
    },
    lastRect: null,
    handleObject: function (ctx, ins) {
        console.log(ins);
    }
}

function getGoody(elem:Tag): Goody {
    return {
        ...getArc(elem),
        ...getColors(elem),
        start: attrExpr(elem, "start"),
        out: attrExpr(elem, "out"),
        grenades: attrExpr(elem, "grenades"),
        boosters: attrExpr(elem, "boosters"),
        missiles: attrExpr(elem, "missiles"),
        y: attrExpr(elem, "y"),
        shape: attrExpr(elem, "shape"),
        speed: attrExpr(elem, "speed")
    }
}

function getRamp(elem: Tag): Ramp {
    return {
        ...getColors(elem),
        ...getPlace(elem),
        w: attrExpr(elem, "w"),
        h: attrExpr(elem, "h"),
        d: attrExpr(elem, "d"),
        ...getArc(elem),
        deltaY: attrExpr(elem, "deltaY"),
    }
}

function getWall(elem: Tag): Wall {
    return {
        ...getColorPlaceDims(elem),
        midYaw: attrExpr(elem, "midYaw")
    }
}

function getArc(elem: Tag): Arc {
    let st = safeAttr(elem, "angle")
    let ex = safeAttr(elem, "extent")
    let laa = (720 - (parseInt(st) + (parseInt(ex) / 2))) % 360
    return {
        angle: parseFloat(st),
        extent: parseFloat(ex),
        lastArcAngle: laa,
        r: parseFloat(safeAttr(elem, "r")),
        cx: parseFloat(safeAttr(elem, "cx")),
        cz: parseFloat(safeAttr(elem, "cz"))
    }
}

function getColorPlaceDims(elem: Tag) {
    return {
        ...getColors(elem),
        ...getPlace(elem),
        ...getDims(elem)
    }
}

function getColors(elem: Tag) {
    return {
        fill: safeAttr(elem, "fill", "#FF00FF"),
        frame: safeAttr(elem, "frame", "#000000"),
    }
}

function getPlace(elem: Tag) {
    let y = attrExpr(elem, "y", -1000)
    if (y == -1000) y = ctx.wa()
    return {
        x: attrExpr(elem, "x"),
        y: y,
        z: attrExpr(elem, "z"),
    }
}

function getDims(elem: Tag) {
    let h = attrExpr(elem, "h", -1000)
    if (h == -1000 || h == 0) h = ctx.wallHeight()
    return {
        w: attrExpr(elem, "w"),
        d: attrExpr(elem, "d"),
        h: h
    }
}

function safeAttr(elem:Tag, attr, thedefault:any = 0) {
    let a = elem.attributes.filter((a) => a.name.value === attr)[0]
    if (!a) return thedefault
    let val = decode(a.value.value)
    if (val) return val
    return thedefault
}

function attrExpr(elem, attr, thedefault:any = 0) {
    let val = safeAttr(elem, attr, thedefault)
    let result = avarluate_expression(val);
    if (Array.isArray(result) && result.length == 0) return 0
    if (result) return result;
    else return 0;
}

let internalkeys = ['tag', 'tag_start', 'tag_end', 'tag_name', 'idx']
const isInternalKey = (key) => internalkeys.includes(key)

export const avaraObjectToTag = (obj) => {
	let attrs = ""
    for (const k in obj)
        if(!isInternalKey(k))
            attrs += `${k}="${obj[k]}" `
	return `<${obj.tag_name} ${attrs}/>`;
}

function tagToAvaraObject(f:Function, elem:Tag, count:number): AvaraObject {
    return {
        ...f(elem),
        tag: elem,
        tag_start: elem.openStart,
        tag_end: elem.closeEnd,
        tag_name: elem.name,
        idx: count
    }
}

export async function objectsFromMap(map_string:string): Promise<any> {
    if (!map_string) return []

    return loadAndPrepareWasm().then((parser) => {
        let objects = new Array<AvaraObject> ()
        parser.eventHandler = (event, data) => {
            if (event == SaxEventType.Text) {
                // text? script?
            }
            else if (event == SaxEventType.CloseTag) {
                let count = objects.length;
                switch(data.value.toLowerCase()) {
                    case "skycolor":
                        let scol = getColors(data)
                        skyColor.set(scol.frame)
                        horizonColor.set(scol.fill)
                        break;
                    case "groundcolor":
                        let gcol = getColors(data)
                        groundColor.set(gcol.fill)
                        break;
                    case "unique":
                        avarluate_script(`unique ${data.attributes[0].value} end`)
                        break
                    case "set":
                        data.attributes.map(a => {
                            let n = a.name + "";
                            let v = a.value;
                            v = decode(v.value)
                            if (n.startsWith("light")) {
                                n = n.replace(/\.([0-9])\./, "[$1].")
                            }
                            let scr = `${n} = ${v}`
                            //console.log(scr)
                            avarluate_script(scr)
                        })
                        break
                    case "walldoor":
                    case "wall":
                        objects.push(tagToAvaraObject(getWall, data, count))
                        break
                    case "ramp":
                        objects.push(tagToAvaraObject(getRamp, data, count))
                        break
                    case "goody":
                        objects.push(tagToAvaraObject(getGoody, data, count))
                }
            }
        }
        parser.write(new TextEncoder().encode(map_string))
        parser.end()
        console.log(objects);
        return objects;
    })
}