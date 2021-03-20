import {
    Vector3,
    Matrix3,
    Geometry,
} from "svelthree-three"

export let sceneToSTL = (scene):string => {
    var vector = new Vector3();
    var normalMatrixWorld = new Matrix3();
    var output = "";

    output += "solid exported\n";

    scene.traverse(function(object) {
        console.log(object)
        if (object.type == "Mesh") {
        var geometry = object.geometry;
        var matrixWorld = object.matrixWorld;
        var mesh = object;

        if (geometry.type ==  "BoxBufferGeometry") {
            console.log(geometry)
            //geometry = object.geometry.toNonIndexed()
            geometry = new Geometry().fromBufferGeometry(geometry)
            //geometry = geometry.toNonIndexed()
            console.log(geometry)
            geometry.type = "Geometry"
        }
        if ( geometry.type == "Geometry") {
            var vertices = geometry.vertices;
            var faces = geometry.faces;

            normalMatrixWorld.getNormalMatrix(matrixWorld);

            for (var i = 0, l = faces.length; i < l; i++) {
            var face = faces[i];

            vector
                .copy(face.normal)
                .applyMatrix3(normalMatrixWorld)
                .normalize();

            output +=
                "\tfacet normal " +
                vector.x +
                " " +
                vector.z +
                " " +
                vector.y +
                "\n";
            output += "\t\touter loop\n";

            var indices = [face.a, face.b, face.c];

            for (var j = 0; j < 3; j++) {
                var vertexIndex = indices[j];
                vector
                    .copy(vertices[vertexIndex])
                    .applyMatrix4(matrixWorld);
                output +=
                    "\t\t\tvertex " +
                    (vector.x)+
                    " " +
                    (vector.z)+
                    " " +
                    (vector.y)+
                    "\n";
            }
            output += "\t\tendloop\n";
            output += "\tendfacet\n";
            }
        }
        }
    });

    output += "endsolid exported\n";

    return output;
    };
