import { RepeatWrapping } from "three";
import THREE = require("three");

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


export let loadBSP = async function (id: number): Promise<THREE.Mesh>
{

    if (meshes[id]) return meshes[id];
    else {
        meshes[id] = await fetchBSP(id);
        return meshes[id];
    }
    
}

let disposeArray = () => { this.array = null }

let fetchBSP = async function (id: number) : Promise<THREE.Mesh>
{
    
    return fetch("bsps/" + id + ".json")
    .then(response => response.json())
    .then((data) => {
        let positions = [];
        let normals = [];
        //let colors = [];

        for (const poly of data.polys) {
            for (const tri of poly.tris) {
                for (const idx of tri) {
                    Array.prototype.push.apply(positions, data.points[idx]);
                    Array.prototype.push.apply(normals, poly.normal);
                }
            }
        }

        let geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3).onUpload(disposeArray));

        let material = new THREE.MeshLambertMaterial({
            color: "red",
            side: THREE.DoubleSide
        });

        return new THREE.Mesh(geometry, material);
    })
}