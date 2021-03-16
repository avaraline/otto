<script lang="ts">
import CodeMirror from '@svelte-parts/editor/codemirror'
import 'codemirror/mode/xml/xml'
import 'codemirror/lib/codemirror.css'
import { alfsource, bookmark } from './store'

export let theme = 'default'
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

let mark = null
let hilite = null
let marker = document.createElement("span")
marker.setAttribute("style", "background: red; display:block; height:10px; width: 10px; border-radius:5px;");

const accessEditor = editor => {
    editor.setSize('100%', '100%')
    editor.on('change', (editor, change) => {
        console.log(change)
        alfsource.set(editor.getValue());
        if (onChange) { onChange(change) }
    })
    alfsource.subscribe(d => {
        editor.setValue(d)
    })
    bookmark.subscribe(d => {
        editor.clearGutter("CodeMirror-linenumbers");
        let pos = {"line": d.start.line, "ch": d.start.ch}
        mark = editor.setGutterMarker(d.start.line, "CodeMirror-linenumbers", marker)
        editor.scrollIntoView(pos)
        if(hilite) hilite.clear()
        hilite = editor.markText(d.start, d.end, {
            css: "background-color:yellow"
        })
    })
}
</script>

<CodeMirror 
    config={config} 
    accessEditor={accessEditor}>
</CodeMirror>

<style>
.CodeMirror-activeline-background {
    background: #e8f2ff;
}
</style>