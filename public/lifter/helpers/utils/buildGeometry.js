
import * as THREE from 'three';

export function buildGeometry(vertices, faces, uvs = null) {
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    for (const [x, y, z] of vertices) {
        positions.push(x, y, z);
    }

    const indices = [];
    for (const face of faces) {
        if (face.length === 3) {
            indices.push(...face);
        } else if (face.length === 4) {
            indices.push(face[0], face[1], face[2]);
            indices.push(face[2], face[3], face[0]);
        }
    }

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    if (uvs) {
        const uvArray = [];
        for (const [u, v] of uvs) {
            uvArray.push(u, v);
        }
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
    }

    geometry.computeVertexNormals();
    return geometry;
}
