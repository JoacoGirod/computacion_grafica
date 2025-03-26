import os
import sys

def create_project(project_name):
    project_path = os.path.join(os.getcwd(), "public", project_name)
    assets_path = os.path.join(project_path, "assets")
    index_file = os.path.join(project_path, "index.html")
    script_file = os.path.join(project_path, "script.js")

    # Create directories
    os.makedirs(assets_path, exist_ok=True)

    # Create index.html
    index_content = f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{project_name.replace('_', ' ').title()}</title>
</head>
<body>
    <canvas id=\"canvas\"></canvas>
    <script type=\"module\" src=\"script.js\"></script>
</body>
</html>"""
    with open(index_file, "w") as f:
        f.write(index_content)

    # Create script.js
    script_content = """import { updateCamera, keys } from '../utils.js';
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas') });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

window.addEventListener('keydown', (event) => keys[event.code] = true);
window.addEventListener('keyup', (event) => keys[event.code] = false);

camera.position.z = 5;
camera.position.set(0, 3, 8);

function animate() {
    requestAnimationFrame(animate);
    updateCamera(camera);
    renderer.render(scene, camera);
}

animate();"""
    with open(script_file, "w") as f:
        f.write(script_content)

    print(f"Project '{project_name}' created successfully in 'public/{project_name}'")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate.py <project_name>")
        sys.exit(1)

    project_name = sys.argv[1]
    create_project(project_name)
