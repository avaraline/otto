<script lang="ts">
import { Mesh, Uniform, Vector3 } from "svelthree";
import { BackSide, BoxBufferGeometry, Color, CubeRefractionMapping, ShaderMaterial } from "svelthree-three";
import { objects, skyColor, horizonColor, groundColor } from "../store";

export let scene
const box = new BoxBufferGeometry(1500, 1500, 1500);


let vertshader = `

out vec3 tex_coord;
void main() {
    tex_coord = position;
    mat4 v = viewMatrix;
    v[3][0] = 0.0;
    v[3][1] = 0.0;
    v[3][2] = 0.0;
    gl_Position =  projectionMatrix * v * vec4(position, 1.0);
}

`
let fragshader = `

in vec3 tex_coord;

uniform vec3 groundColor;
uniform vec3 horizonColor;
uniform vec3 skyColor;
uniform float lowAlt;
uniform float highAlt;

void main()
{
    float phi = normalize(tex_coord).y;

    gl_FragColor = vec4(mix( 
                mix( // TODO: lowAlt messes up the gradient
                    mix(skyColor * (phi / highAlt) + horizonColor * (1.0 - (phi / highAlt)),
                        horizonColor, float(phi < lowAlt)
                    ), skyColor, float(phi > highAlt)
                ), groundColor, float(phi <= 0.0)
            ), 1.0);
}

`
let mat 

let updateMat = () => {
    mat = new ShaderMaterial({
        uniforms: {
            groundColor: new Uniform(new Color($groundColor)),
            horizonColor: new Uniform(new Color($horizonColor)),
            skyColor: new Uniform(new Color($skyColor)),
            lowAlt: { value: 0 },
            highAlt: { value: 0.2 }
        },
        vertexShader: vertshader,
        fragmentShader: fragshader,
        side: BackSide,
    })
}

let pos = new Vector3(0, 0, 0)
groundColor.subscribe(updateMat)
horizonColor.subscribe(updateMat)
skyColor.subscribe(updateMat)

</script>
<Mesh {scene} pos={[0, 0, 0]} material={mat} geometry={box} />
