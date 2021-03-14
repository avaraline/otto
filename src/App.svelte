<script lang="ts">
	import { onMount } from "svelte"
	import MapEditor from "./2D/MapEditor.svelte"
	import XMLEditor from "./XMLEditor.svelte"
	import Preview from "./3D/Preview.svelte"

	import { objects, alfsource } from "./store"
	import { loadText } from "./files";
	import { objectsFromMap } from "./alf"
	import { get_variable, is_defined, set_variable } from "./avarluation";

	

	let preview2D, preview3D, scale_2d
	let width_2d, height_2d
	let width_3d, height_3d

	onMount(async () => {

		loadText("grimoire.alf").then(s => {
			width_2d = preview2D.offsetWidth
			height_2d = preview2D.offsetHeight
			width_3d = preview3D.offsetWidth
			height_3d = preview3D.offsetHeight
			scale_2d = 3.0//Math.min(preview2D.offsetWidth / map_width, 1.0);


			alfsource.set(s)
			alfsource.subscribe((s) => {
				objects.set(objectsFromMap(s).filter(o => o));
				console.log(objects)
			})
			
		})
	})

	
	
</script>

<main>
	<div id="source">
		<XMLEditor/>
	</div>
	<div id="preview2D" bind:this={preview2D}>
		<MapEditor height={height_2d} width={width_2d} scale={scale_2d}/>
	</div>
	<div id="preview3D" bind:this={preview3D}>
		<Preview width={width_3d} height={height_3d}/>
	</div>
</main>

<style>
	#source {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 40%;
		font-family: monospace;
		border: none;
		padding: 10px;
	}
	#preview2D {
		position: absolute;
		top: 0;
		left: calc(40% + 10px);
		height: 50%;
		right: 0;
		overflow: auto;
	}
	#preview3D {
		position: absolute;
		top: calc(50% + 10px);
		left: calc(40% + 10px);
		bottom: 0;
		right: 0;
		overflow: auto;
	}
</style>