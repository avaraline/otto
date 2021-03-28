<script lang="ts">
import { DirectionalLight, AmbientLight, Vector3 } from "svelthree"
import { avarluate_expression } from "../avarluation";
import { objects } from "../store";
import { radians } from "../util";
export let scene

let to_cartesian = (elevation:number, azimuth:number, intensity:number):Vector3 => {
    return new Vector3(
        Math.sin(radians(azimuth)) * intensity,
        Math.sin(radians(elevation)) * intensity,
        Math.cos(radians(azimuth)) * intensity
    )
}

let lights = []
let ambient = 0.3

const updateLights = () => {
    lights = [0,1,2,3].map((idx) => {
        let intense = avarluate_expression(`light[${idx}].i`)
        return {
            intensity: intense,
            position: to_cartesian(
                avarluate_expression(`light[${idx}].a`),
                avarluate_expression(`light[${idx}].b`),
                intense
        )}
    })
    ambient = avarluate_expression(`ambient`)
}
objects.subscribe(updateLights)
</script>
{#each lights as light}
{#if light.intensity > 0}
<DirectionalLight {scene} props={{color: 0xFFFFFF, position:light.position, intensity:light.intensity}} />
{/if}
{/each}
<AmbientLight {scene} props={{ position: [3, 3, 3], color: 0xFFFFFF }} intensity={ambient}/>