import { writable } from 'svelte/store'
import type { AvaraObject } from './alf'

export const objects = writable(new Array<any>())
export const alfsource = writable("")
export const avara_variables = writable({})
export const selected = writable([])