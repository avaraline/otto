import { writable } from 'svelte/store'

export const objects = writable(new Array<any>())
export const alfsource = writable("")
export const selected = writable([])
export const editing = writable(false)
export const xmlupdate = writable({
    start:{ 
        line: 0,
        character: 0
    },
    end: {
        line:0,
        character: 0
    },
    tag: ""
})

export const skyColor = writable("#f0f")
export const horizonColor = writable("#00f")
export const groundColor = writable("#FF0")