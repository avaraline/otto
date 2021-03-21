import { writable } from 'svelte/store'

export const objects = writable(new Array<any>())
export const alfsource = writable("")
export const avara_variables = writable({})
export const selected = writable([])