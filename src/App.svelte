<script lang="ts">
import { onMount } from "svelte"
import MapEditor from "./2D/MapEditor.svelte"
import XMLEditor from "./XMLEditor.svelte"
import Preview from "./3D/Preview.svelte"
import 'bulma/css/bulma.css'
import { Snackbar, Modal, Button, Collapse } from "svelma"

import { objects, alfsource } from "./store"
import { loadText } from "./files";
import { objectsFromMap } from "./alf"
import { avaraluator_init_default } from "./avarluation";
import OpenDialog from "./OpenDialog.svelte"


import { svelthreeStores } from "svelthree"
import { sceneToSTL } from "./stl-export"
import { saveAs } from "file-saver"


let preview2D, preview3D, scale_2d
let width_2d, height_2d
let width_3d, height_3d

let openDialog = false
let files
const open = () => { 
	openDialog = true; 
}
const loadfile = (f) => {
	let r = new FileReader();
	r.addEventListener("load", (e) => {
		avaraluator_init_default()
		alfsource.set(e.target.result)
	})
	r.readAsBinaryString(f[0])
	openDialog = false;
}
const loadfromdb = (path) => {
	openDialog = false;
	loadText(path).then((t) => {
		alfsource.set(t);
	})
}

const stl = () => {
	let b = new Blob([sceneToSTL(mypreview.getScene())], {type: 'text/plain'})
	saveAs(b, "level.stl")
}

const save = () => {
	let b = new Blob([$alfsource], {type: 'text/plain'})
	saveAs(b, "level.alf")
}

const notify = (text:string, type:string):void => {
	Snackbar.create({
		message:text,
		type:type
	})
}

const problem = (e) : void => notify(e.detail.error, "is-danger")

let mypreview:Preview

let selected = [];

onMount(async () => {
	avaraluator_init_default()
	loadText("./bwadi.alf").then(async s => {
		width_2d = preview2D.offsetWidth
		height_2d = preview2D.offsetHeight
		width_3d = preview3D.offsetWidth
		height_3d = preview3D.offsetHeight
		scale_2d = 3.0//Math.min(preview2D.offsetWidth / map_width, 1.0);


		alfsource.set(s)
		alfsource.subscribe(async (s) => {
			avaraluator_init_default()
			objectsFromMap(s).then((o) => {
				objects.set(o.filter(t => t))
			}).catch((r) => console.log(r))
			console.log(objects)
		})	
	})	
})

const handle3DClick = (e, props) => {
	console.log(props);
}

</script>

<main>
	<header>
		<img src="./otto.png" alt="Otto" width="30"/>
		<button class="button block" type="is-light" style="height:30px;" on:click={open}>Open</button>
		<button class="button block" type="is-light" style="height:30px;" on:click={save}>Save</button>
		<button class="button block" type="is-light" style="height:30px;" on:click={stl}>STL</button>
	</header>
	<div id="source">
		<XMLEditor on:xmlparsefailure={problem}/>
	</div>
	<div id="preview2D" bind:this={preview2D}>
		<MapEditor height={height_2d} width={width_2d}/>
	</div>
	<div id="preview3D" bind:this={preview3D}>
		<Preview bind:this={mypreview} width={width_3d} height={height_3d} handleClick={handle3DClick}/>
	</div>
	<Modal bind:active={openDialog}>
		<OpenDialog onChoose={loadfromdb} onFile={loadfile}></OpenDialog>
	</Modal>
</main>

<style>
	header button {
		height:30px;
		font-size:12px;
	}
	header {
		display:block;
		height:40px;
		padding:5px;
	}
	#source {
		position: absolute;
		top: 40px;
		left: 0;
		bottom: 0;
		width: 40%;
		font-family: monospace;
		border: none;
	}
	#preview2D {
		position: absolute;
		top: 40px;
		left: calc(40% + 10px);
		height: 50%;
		right: 0;
		overflow: auto;
	}
	#preview3D {
		position: absolute;
		top: calc(50% + 50px);
		left: calc(40% + 0px);
		bottom: 0;
		right: 0;
		overflow: auto;
	}
</style>