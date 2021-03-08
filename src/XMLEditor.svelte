<script lang="ts">
    import CodeMirror from '@svelte-parts/editor/codemirror'
    import 'codemirror/mode/xml/xml'
    import 'codemirror/lib/codemirror.css'
    import { alfsource } from './store'

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

    const accessEditor = editor => {
        editor.setSize('100%', '100%')
        editor.on('change', e => {
            if (onChange) { onChange(e.getValue()) }
        })
        alfsource.subscribe(d => {
            editor.setValue(d)
        })
    }
</script>

<CodeMirror 
    config={config} 
    accessEditor={accessEditor}>
</CodeMirror>