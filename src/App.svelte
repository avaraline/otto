<script lang="ts">
	export let name: string;
	import { onMount } from "svelte"
	import MapEditor from "./2D/MapEditor.svelte"
	import XMLEditor from "./XMLEditor.svelte"
	import Preview from "./3D/Preview.svelte"

	import { rects, arcs, alfsource } from "./store"
	import { loadText } from "./files";
	import { handleColor, getRect, getArc } from "./alf"
	import { handleScript } from "./avarluation";

	let ctx = {
		fillColor: "#ffffff",
		frameColor: "#000000",
		wa: 0,
		wallHeight: 3,
		lastRect: null,
		lastArcAngle: 0,
		handleObject: function (ctx, ins) {
			console.log(ins);
		}
	}

	let preview2D, preview3D, scale_2d
	let width_2d, height_2d
	let width_3d, height_3d

	onMount(async () => {

		loadText("grimoire.alf").then(s => {
			alfsource.set(s)
			let doc = new DOMParser().parseFromString(s, "text/html")
			let themap = doc.querySelector("map")
			let map_width = parseInt(themap.getAttribute("width"))
			width_2d = preview2D.offsetWidth
			height_2d = preview2D.offsetHeight
			width_3d = preview3D.offsetWidth
			height_3d = preview3D.offsetHeight
			scale_2d = Math.min(preview2D.offsetWidth / map_width, 1.0);
			let rs = []
			let as = []
			let _ = [...themap.children].forEach((elem, idx) => {
				handleColor(ctx, elem)
				switch (elem.tagName.toLowerCase()) {
					case "rect":
						let r = getRect(ctx, elem, idx)
						ctx.lastRect = r
						rs.push(r)
						break
					case "arc":
						as.push(getArc(ctx, elem, idx))
						break;
				}
				handleScript(ctx, elem.textContent)
			})
			console.log(rs);
			rects.set(rs)
		})
	})
	
</script>

<main>
	<div id="source">
		<XMLEditor/>
	</div>
	<div bind:this={preview2D}>
		<MapEditor width={height_2d} height={width_2d} scale={scale_2d}/>
	</div>
	<div bind:this={preview3D}>
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