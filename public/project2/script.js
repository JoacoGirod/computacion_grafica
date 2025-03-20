import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// The Scene contains all the elements
const scene = new THREE.Scene();
// The camera determines the viewpoint, in this case, 75 degrees of field of view, establishes the screen dimensions using the window, define near and far ranges for Frustum
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// The renderer converts the 3D Scene into a 2D image
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });

// Specify the sizes to the rendered
renderer.setSize(window.innerWidth, window.innerHeight);
// Add the canvas to the webpage
document.body.appendChild(renderer.domElement);

// A mesh is created defining a Geometry and a Material
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Camera position
camera.position.z = 5;

// Object animation
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
