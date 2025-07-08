# Three JS Projects

## How to Execute

### Build Docker Image

The image is really simple, uses predefined Node image and download dependencies using the project's `package.json`.

```bash
docker build -t my-threejs-server .
```

After the image is built and stored it is not necessary to run this command again, we can simply manage the lifecycle of containers that use this image.

### Run Container

On runtime the container has to bind mount to the `public` folder, so changes in the local codebase are reflected in the container's filesystem, which in turn affects the page served `localhost:8080` (thanks to the port mapping from the container to the host, also declared in the runtime command).

```bash
docker run -p 8080:8080 -v $(pwd)/public:/app/public my-threejs-server
```

> The command is using `pwd` so it has to be run from the project's root to work correctly.

### Quick Commands

For building and running (should only be used once unless the image is changed):

```bash
sh ./build_and_run.sh
```

After execution you will have a container running which you can manage directly.
If you remove the container but still have the image you can use the following command to run a new one with the runtime flags specified before:

```bash
sh ./run.sh
```

## Project Intended Structure

```bash
my-threejs-server/
│── public/
│   ├── project1/
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── assets/
│   │   │   ├── texture.jpg
│   ├── project2/
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── assets/
│   │   │   ├── model.glb
│   ├── shared-assets/  (optional: shared textures, models, etc.)
│   │   ├── texture.jpg
│── server.js
│── package.json
│── node_modules/
│── Dockerfile
│── generate.py
│── run.sh
```
