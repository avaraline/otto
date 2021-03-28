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

export const skyColor = writable("#003")
export const horizonColor = writable("#00C")
export const groundColor = writable("#003")
