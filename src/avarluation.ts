import { deg2rad } from './util'
import { parse } from "./avarascript"

let _eval = eval;

let unique_value = 30000;

let defaultscript = "";
let variables = {};
let var_idx =  0;
let builtins = {
    "@start": 1234,
    "@end": 1235,
    "random": Math.random,
    "min": Math.min,
    "max": Math.max,
    "int": Math.floor,
    "round": Math.round,
    "sin": Math.sin,
    "cos": Math.cos
}

export function is_defined(name: string): boolean {
    if (variables[name]) return true;
    else return false;
}

export function set_variable(name: string, value: any): void {
    if (variables[name]) variables[name]["expr"] = value;
    else {
        variables[name] = {"idx": var_idx, "expr": value};
        var_idx += 1;
    }
}

export function get_variable(v: string): any {
    if (is_defined(v)) {
        return avarluate(variables[v]["expr"]);
    }
    else {
        console.log(v + " - symbol was NOT resolved");
        return undefined;
    }
}

function ref(msg:string): number {
    if(builtins[msg]) return builtins[msg];
    var varname = msg.slice(1);
    if(variables[varname]) return variables[varname]["idx"];
    else {
        set_variable(varname, 0);
        return variables[varname]["idx"];
    }
}

export function avarluate(atom) {
    // num
    if (!isNaN(atom)) return atom
    // str
    if (typeof atom === "string" || atom instanceof String) return atom
    // name
    if (atom["name"]) return get_variable(atom["name"])
    // reference
    if (atom["reference"]) return ref(atom["reference"])
    // op
    if (atom["op"]) {
        return atom["op"]
    }
    // expr
    if (atom["expr"]) return avarluate(atom["expr"]);
    // function
    if (atom["func"]) {
        if(builtins[atom["func"]]) {
            //console.log("calling " + atom["func"] + " with " + atom["args"]);
            return builtins[atom["func"]](...atom["args"].map(a => avarluate(a)))
        }
        else {
            console.log("Undefined function " + atom["func"])
            return undefined
        }
    }
    // array of terms
    if (Array.isArray(atom)) {
        var statement = atom.reduce((res, a) => {
            return res + " " + avarluate(a)
        }, "")
        //console.log("going to eval: " + statement)
        return _eval(statement)
    }
    return undefined
}

export function handleScript(ctx, data) {
    parse(data).forEach((ins) => {
        switch(ins["type"]) {
            case "declaration":
                set_variable(ins["variable"], ins["expr"]);
                break;
            case "object":
            case "adjust":
                ctx.handleObject(ins);
                break;
            case "unique":
                ins["tokens"].forEach((tk) => {
                    set_variable(tk, unique_value);
                    unique_value += 1;
                });
                break;
            case "enum":
                var start = ins["start"];
                ins["tokens"].forEach((tk) => {
                    set_variable(tk, start);
                    start += 1;
                });
                break;
            case "set_unique_start":
                unique_value = ins["start"];
                break;
        }
    });

    if(is_defined("wa")) {
        ctx.wa = get_variable("wa");
        //set_variable("wa", 0);
    }
    if(is_defined("wallHeight")) {
        ctx.wallHeight = get_variable("wallHeight");
        //set_variable("wallHeight", 0);
    }
}
