import { deg2rad } from './util'
import { parse } from "./avarascript"
import { loadText } from "./files"

let _eval = eval;
let unique_start = 30000
type Native = string | number | undefined | String

let unique_value = unique_start
let variables = {}
let var_idx =  0
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
 
export function avaraluator_init_default() {
    variables = {}
    var_idx = 0
    unique_value = unique_start
    loadText("default.avarascript").then((t) => {
        avarluate_script(t);
    })
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

export function get_variable(varname: string): Native {
    if (is_defined(varname)) {
        return avarluate(variables[varname]["expr"]);
    }
    else {
        console.log(varname + " - symbol was NOT resolved");
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

// the avarluator reduces the output of the parser into
// a statement containing only native types, and then uses
// eval() to get a final Native for use in rendering a map

export function avarluate(atom): Native {
    // num
    if (!isNaN(atom)) return atom
    // str
    if (typeof atom === "string" || atom instanceof String) return atom
    // name
    if (atom["name"]) return get_variable(atom["name"])
    // reference
    if (atom["reference"]) return ref(atom["reference"])
    // op
    if (atom["op"]) return atom["op"]
    // expr
    if (atom["expr"]) return avarluate(atom["expr"]);
    // function
    if (atom["func"]) {
        // 'native' function mapping is stored in builtins
        if(builtins[atom["func"]]) {
            // function call, but reduce arguments first
            return builtins[atom["func"]](...atom["args"].map(a => avarluate(a)))
        }
        // these are rarely used
        else {
            console.log("Undefined function " + atom["func"])
            return undefined
        }
    }
    // array of terms
    if (Array.isArray(atom)) {
        return _eval(atom.reduce((res, a) => {
            // this string should only contain native 
            // types, operators, and function calls
            return res + " " + avarluate(a)
        }, ""))
    }
    return undefined
}

// just an expression by itself is not actually valid avarascript.
// this is so that we can parse the new format that has expressions
// as values of attributes by themselves, ready for evaluation, as 
// opposed to properties in an object declaration.
export function avarluate_expression(expr_string: string): any {
    if (!expr_string) return 0
    return avarluate(parse(`\ntemp = ${expr_string}`)[0]["expr"])
}


// this function handles longer bits of script, detects objects,
// but also updates the internal state of variables and names
// for get_ and set_variable
export function avarluate_script(script_text: string, object_callback: (object_data) => void = undefined): void {
    console.log(script_text);
    parse(script_text).forEach((ins) => {
        switch(ins["type"]) {
            case "declaration":
                set_variable(ins["variable"], ins["expr"]);
                break;
            // these perform the same action in Avara
            case "object":
            case "adjust":
                // the callback is provided with an
                // object containing all the properties
                // as expressions that can be avarluated
                // (as needed)
                if(object_callback)
                object_callback(ins);
                break;
            case "unique":
                ins["tokens"].map((tk) => {
                    set_variable(tk, unique_value);
                    unique_value += 1;
                });
                break;
            case "enum":
                var start = ins["start"];
                ins["tokens"].map((tk) => {
                    set_variable(tk, start);
                    start += 1;
                });
                break;
            case "set_unique_start":
                unique_value = ins["start"];
                break;
        }
    });
}
