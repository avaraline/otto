<script lang="ts">
    import CodeMirror from '@svelte-parts/editor/codemirror'
    import 'codemirror/mode/xml/xml'
    import 'codemirror/lib/codemirror.css'

    export let theme = 'default'
    export let onChange = undefined
    export let initialValue = ''
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
        editor.setValue(initialValue);
    }
</script>

<CodeMirror config={config} accessEditor={accessEditor}></CodeMirror>