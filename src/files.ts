import { BufferGeometry, Float32BufferAttribute, Mesh } from 'svelthree'
let meshes = {}
let texts = {}

export let loadText = async function (name: string): Promise<string>
{
    if(texts[name]) return texts[name]
    else {
        texts[name] = await fetch(name).then(r1 => r1.text());
        return texts[name];
    }
}


export let loadBSP = async function (id: number): Promise<Mesh>
{

    if (meshes[id]) return meshes[id];
    else {
        meshes[id] = await fetchBSP(id);
        return meshes[id];
    }
    
}

let fetchBSP = async function (id: number) : Promise<void | BufferGeometry>
{
    return fetch("bsps/" + id + ".json")
    .then(response => response.json())
    .then((data) => {
        let positions = []
        let normals = []
        let colors = []

        for (const poly of data.polys) {
            for (const tri of poly.tris) {
                for (const idx of tri) {
                    Array.prototype.push.apply(positions, data.points[idx])
                    Array.prototype.push.apply(normals, poly.normal)
                    Array.prototype.push.apply(colors, poly.color)
                }
            }
        }

        let gbuffa = new BufferGeometry();
        gbuffa.setAttribute('position', new Float32BufferAttribute(positions, 3).onUpload(() => { this.array = null }))
        gbuffa.setAttribute('normal', new Float32BufferAttribute(normals, 3).onUpload(() => { this.array = null }))
        gbuffa.setAttribute('color', new Float32BufferAttribute(colors, 1).onUpload(() => { this.array = null }))
        return gbuffa
    })
}