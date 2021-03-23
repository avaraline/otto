<script lang="ts">
import CodeMirror from '@svelte-parts/editor/codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import { alfsource, objects, selected, editing} from './store'
import { createEventDispatcher } from 'svelte';

export let theme = 'monokai'
export let onChange = undefined

const config = {
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: { nonEmpty: true },
    styleActiveSelected: true,
    theme,
    mode: {
        name: 'xml',
        highlightFormatting: true,
    }
}

const dispatch = createEventDispatcher();
let updating = false;

let hilite = null
let selectdec = document.createElement("span")
selectdec.setAttribute("style", "background: #e0e; display:block; height:10px; width: 10px; border-radius:5px;")

let dbtime = 0;

let handleChange = (editor, change) => {
    if (updating || $editing) return;
    updating = true;
    console.log(change)
    const testDom = new DOMParser().parseFromString(editor.getValue(), 'application/xml');
    let result = false;
    let errortag = testDom.getElementsByTagName('parsererror');
    if (errortag.length > 0) {
        let anerror = errortag[0].getElementsByTagName('div')[0].innerText;
        // let line = parseInt(anerror.match(/line\s([0-9]+)/)[1])
        dispatch('xmlparsefailure', {
            'error': anerror
        })
    }
    else {
        alfsource.set(editor.getValue())
    }

    if (onChange) onChange(change)
    updating = false;
}

let handleSelect = (ps, editor) => {
        editor.clearGutter("CodeMirror-linenumbers");
        if(hilite) hilite.clear()
        ps.map((idx) => {
            let p = $objects[idx]
            let start = p["tag_start"]
            let end = p["tag_end"]
            let pos = {"line": start.line, "ch": start.character}
            editor.setGutterMarker(start.line, "CodeMirror-linenumbers", selectdec)
            
            hilite =editor.markText({
                line: start.line,
                ch: start.character
            },{
                line: end.line,
                ch: end.character,
            }, {
                css: "background-color:#535"
            })
            editor.scrollIntoView(pos)
        })
    }

export let cmeditor

const accessEditor = editor => {
    cmeditor = editor
    editor.setSize('100%', '100%')
    editor.on('change', (editor, e) => { handleChange(editor, e) })
    editor.on('cursorActivity', (editor) => {
        
    })
    alfsource.subscribe(d => {
        if (!updating)
        editor.setValue(d)
        handleSelect($selected, editor);
    })
    selected.subscribe((ps) => {
        handleSelect(ps, editor);
    })
}
</script>

<CodeMirror 
    config={config} 
    accessEditor={accessEditor}>
</CodeMirror>