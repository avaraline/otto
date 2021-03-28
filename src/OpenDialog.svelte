<script lang="ts">
import { Collapse, Button } from 'svelma'
import { onMount } from 'svelte'
import { loadText } from './files'
export let onChoose = undefined
export let onFile = undefined
let files;


let sets = [
	"4-isles",
"aa-abnormal",
"aa-deux-abnormal",
"aa-deux-normal",
"aa-normal",
"aa-tre",
"a-bridge-too-far",
"berserkir-fury",
"blockparty",
"butternut-squash",
"c1-archaeology",
"c1-architecture",
"c1-misc-net",
"c1-moving-parts",
"cancer",
"classic-mix-up",
"clockwork-blue-b4",
"cnemies-squares",
"crescent",
"dildensburg",
"disk-o-tech-light",
"dodgeball",
"emotion",
"fishrack-syndrome",
"fosfori",
"gzr-balledness",
"gzr-geriatric-ward",
"gzr-grecian-formula",
"gzr-liver-spots",
"gzr-over-the-hill",
"gzr-rip",
"holy-hand-grenades",
"hunting-grounds",
"iya",
"klaus-levels",
"macabre",
"medievos",
"net-99",
"net-levels",
"new-moon",
"not-aa",
"oddities-v4",
"pastabravo",
"scarlet-pimpernel-beta-0919",
"single-player",
"someset",
"strawberry",
"symbiosis",
"the-codex",
"the-lexicon",
"t-plus-5-part-a",
"t-plus-5-part-b",
"t-plus-5-part-c",
"we-be-ground-pounders",
"wide-open",
"wild-west-collection",
"wrestling",
"wut",]

let leveldb = []

onMount(() => {
    sets.map(async (set) => {
		await loadText("./levels/" + set + "/set.json").then((val) => {

			let res = { "name": set, "levels": [] }
			res["levels"] = JSON.parse(val)["LEDI"].map((l) => { 
				return {
					"path": "./levels/" + set + "/alf/" + l["Alf"],
					"name": l["Name"]
				}
			})
			leveldb.push(res)
		})
        leveldb = leveldb.sort((a, b) => { 
            return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
        });
	})
});
</script>

<div class="dialog columns">
    <div class="column">
        <h6>Load local file</h6> 
        <input type="file" bind:files />
        <Button type="is-light" on:click={() => { onFile(files) }}>Load File</Button>
    </div>
    <div class="column">
        <h6>Load level existing level</h6>
        {#each leveldb as s}
            {#if s["levels"] && s["levels"].length > 0}
            <Collapse open={false}>
                <p slot="trigger"><strong>{s["name"]}</strong></p>
                <div class="content">
                    {#each s["levels"] as l}
                        <Button type="text" on:click={() => { onChoose(l["path"]) }}>{l["name"]}</Button>
                    {/each}
                </div>
            </Collapse>
            {/if}
        {/each}
    </div>
</div>

<style>
	.dialog { background-color: #fff; padding:20px; }
    .dialog .column { max-height:500px; overflow-y:scroll; overflow-x:hidden;}
</style>