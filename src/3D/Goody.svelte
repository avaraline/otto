<script lang="ts">
import {
    MeshStandardMaterial,
    BoxBufferGeometry,
    Mesh
} from "svelthree"
import type { BufferGeometry } from "svelthree-three"

import { createEventDispatcher, onMount } from 'svelte';
import { radians } from "../util"
import type { Goody } from "../alf"
import { loadBSP } from "../files";

export let props:Goody
export let scene


const dispatch = createEventDispatcher();
let onClick = (e, props) => {
    dispatch('clicked', {event: e, props: props})}

let geom:BufferGeometry = new BoxBufferGeometry(1, 1, 1)
let mat = new MeshStandardMaterial()

onMount(() => {
    loadBSP(props["shape"]).then((s) => {
        geom = s;
    })
})

const rotator = (obj) => {
    let rAF = 0;
    let doRotate = false;

    function onStart() {
      startRotating();
    }

    function startRotating() {
      doRotate = true;
      rAF = requestAnimationFrame(rotate);
    }

    function rotate() {
      if (doRotate) {
        obj.rotation.y += radians(props.speed) / 15;
        rAF = requestAnimationFrame(rotate);
      }
    }

    function onDestroy() {
      doRotate = false;
      cancelAnimationFrame(rAF);
    }

    return {
      onStart: onStart,
      onDestroy: onDestroy,
    };
  };
</script>

<Mesh
    interact
    {scene}
    geometry={geom}
    material={mat.clone()}
    mat={{ color: props.fill }}
    pos={[
        props.cx,
        props.y,
        props.cz
    ]}
    animation={rotator}
    aniauto
    on:click={(e) => { onClick(e, props)}}
/>