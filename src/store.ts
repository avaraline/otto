import { writable } from 'svelte/store'
import type { AvaraObject } from './alf'

export const objects = writable(new Array<AvaraObject>())
export const ramps = writable([])
export const alfsource = writable("")
export const bookmark = writable(0)