import { attr } from 'svelte/internal'
import { 
    avarluate_expression, 
    avarluate_script, 
    is_defined, 
    set_variable, 
    get_variable, 
    avarluate
} from './avarluation'
import { xpath } from "./xpath"
import { Tag, SaxEventType, SAXParser, Position } from 'sax-wasm';
import { decode } from "he"

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

type Arc = {
    extent: number
    angle: number
}

type Actor = Placed & Color

export type Wall = (Actor & Rect) & {
    midYaw: number
}

export type Ramp = Actor & Rect & Arc & {
    deltaY: number
    lastArcAngle: number
}

export type AvaraObject = Actor & {
    tag: Tag
    tag_string: string
    tag_start: Position
    tag_end: Position
    
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

function getArc(elem: Tag) {
    let st = safeAttr(elem, "angle")
    let ex = safeAttr(elem, "extent")
    let laa = (720 - (parseInt(st) + (parseInt(ex) / 2))) % 360
    return {
        angle: st,
        extent: ex,
        lastArcAngle: laa
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
    let y = attrExpr(elem, "y")
    if (!y) y = ctx.wa()
    return {
        x: attrExpr(elem, "x"),
        y: y,
        z: attrExpr(elem, "z"),
    }
}

function getDims(elem: Tag) {
    let h = attrExpr(elem, "h")
    if (!h || h == 0) h = ctx.wallHeight()
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

function attrExpr(elem, attr) {
    let val = safeAttr(elem, attr, "")
    let result = avarluate_expression(val);
    if (result) return result;
    else return 0;
}

function tagToAvaraObject(f:Function, elem:Tag): AvaraObject {
    return {
        ...f(elem),
        tag: elem,
        tag_string: elem.value,
        tag_start: elem.openStart,
        tag_end: elem.closeEnd,
        tag_name: elem.name
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
                switch(data.value.toLowerCase()) {
                    case "set":
                        data.attributes.map(a => {
                            let n = a.name;
                            let v = a.value;
                            v = decode(v.value)
                            avarluate_script(`${n} = ${v}`)
                        })

                        break
                    case "walldoor":
                    case "wall":
                        objects.push(tagToAvaraObject(getWall, data))
                        break
                    case "ramp":
                        objects.push(tagToAvaraObject(getRamp, data))
                        break
                }
            }
        }
        parser.write(new TextEncoder().encode(map_string))
        parser.end()
        console.log(objects);
        return objects;
    })
}