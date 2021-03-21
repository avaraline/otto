<script lang="ts">
import CodeMirror from '@svelte-parts/editor/codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import { alfsource, objects, selected } from './store'
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
let selectmark = null
let selectdec = document.createElement("span")
selectdec.setAttribute("style", "background: #e0e; display:block; height:10px; width: 10px; border-radius:5px;")

let dbtime = 0;



const accessEditor = editor => {
    editor.setSize('100%', '100%')
    editor.on('change', (editor, change) => {
        if (updating) return;
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
    })

    editor.on('cursorActivity', (editor) => {
        
    })
    alfsource.subscribe(d => {
        if (!updating)
        editor.setValue(d)
    })
    selected.subscribe(ps => {

        editor.clearGutter("CodeMirror-linenumbers");
        if(hilite) hilite.clear()
        ps.map((idx) => {
            let p = $objects[idx]
            let start = p["tag_start"]
            let end = p["tag_end"]
            let pos = {"line": start.line, "ch": start.ch}
            editor.setGutterMarker(start.line, "CodeMirror-linenumbers", selectdec)
            
            hilite = editor.markText(start, end, {
                css: "background-color:#535"
            })
            editor.scrollIntoView(pos)
        })
    })
}
</script>

<CodeMirror 
    config={config} 
    accessEditor={accessEditor}>
</CodeMirror>