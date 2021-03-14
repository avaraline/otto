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
        theme,
        mode: {
            name: 'xml',
            highlightFormatting: true,
        }
    }

    let mark = null
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
            let pos = {"line": d + 1, "ch": 0}
            mark = editor.setGutterMarker(d + 1, "CodeMirror-linenumbers", marker)
            editor.scrollIntoView(pos)
        })
    }
</script>

<CodeMirror 
    config={config} 
    accessEditor={accessEditor}>
</CodeMirror>