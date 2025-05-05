import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { updateCamera, keys } from '../utils.js';

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

const clock_group = new THREE.Group();

// Clock face
const circle_geometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
const circle_material = new THREE.MeshNormalMaterial();
const circle = new THREE.Mesh(circle_geometry, circle_material);
circle.rotation.x = Math.PI / 2;
clock_group.add(circle)

// Hours hand
const hour_hand_geometry = new THREE.BoxGeometry(0.25, 1, 0.125);
const hour_hand_material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const hour_hand = new THREE.Mesh(hour_hand_geometry, hour_hand_material);
hour_hand.position.z = 0.5625;
hour_hand.position.y = 0.5;
clock_group.add(hour_hand);

const hour_group = new THREE.Group();
hour_group.add(hour_hand)
clock_group.add(hour_group)

// Minute Hand
const minute_hand_geometry = new THREE.BoxGeometry(0.25, 1.5, 0.125);
const minute_hand_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const minute_hand = new THREE.Mesh(minute_hand_geometry, minute_hand_material);
minute_hand.position.z = 0.4375;
minute_hand.position.y = 0.75;
clock_group.add(minute_hand);

const minute_group = new THREE.Group();
minute_group.add(minute_hand)
clock_group.add(minute_group)

// Second Hand
const second_hand_geometry = new THREE.BoxGeometry(0.25, 2, 0.125);
const second_hand_material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const second_hand = new THREE.Mesh(second_hand_geometry, second_hand_material);
second_hand.position.z = 0.3125;
second_hand.position.y = 1;
clock_group.add(second_hand);

const second_group = new THREE.Group();
second_group.add(second_hand)
clock_group.add(second_group)

// Clock Group
clock_group.position.z = 0.75;
clock_group.position.y = -10;

// General Group
const general_group = new THREE.Group();

const circle_2 = new THREE.Mesh(circle_geometry, circle_material);
circle_2.rotation.x = Math.PI / 2;
general_group.add(circle_2);

const arm_geometry = new THREE.BoxGeometry(2, 10, 1);
const arm_material = new THREE.MeshNormalMaterial();
const arm = new THREE.Mesh(arm_geometry, arm_material);
arm.position.y = -5;
general_group.add(arm);

general_group.add(clock_group);

scene.add(general_group);



// Camera position
camera.position.z = 5;

// Camera
window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

// Set initial camera position
camera.position.set(0, 0, 10);

var cumulative = 0;

function animate() {
    requestAnimationFrame(animate);

    // Camera
    updateCamera(camera);

    // Clock arms
    const now = new Date();
    const hours = now.getHours();      // 0 - 23
    const minutes = now.getMinutes();  // 0 - 59
    const seconds = now.getSeconds();  // 0 - 59

    // Rotation angles in radians
    const hour_angle = -((hours % 12) + minutes / 60) * (Math.PI * 2 / 12);  // 360° / 12 hours
    const minute_angle = -(minutes + seconds / 60) * (Math.PI * 2 / 60);     // 360° / 60 minutes
    const second_angle = -seconds * (Math.PI * 2 / 60);                      // 360° / 60 seconds

    hour_group.rotation.z = hour_angle
    minute_group.rotation.z = minute_angle
    second_group.rotation.z = second_angle;

    cumulative += 0.01;
    var swing = (Math.PI / 4) * Math.cos(cumulative);

    clock_group.rotation.z = -swing;
    general_group.rotation.z = swing;
    renderer.render(scene, camera);
}

animate();