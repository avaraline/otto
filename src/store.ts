import { writable } from 'svelte/store'
import type { AvaraObject } from './alf'

export const objects = writable(new Array<any>())
export const alfsource = writable("")
export const bookmark = writable({
    start: {
        line: 0,
        ch: 0
    },
    end: {
        line: 0,
        ch: 0
    }
})

export const avara_variables = writable({})