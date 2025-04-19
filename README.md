# Intended Structure
```
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
# New Projects
The `generate.py` file can be used to quickly create the starting point for a project, it includes a static cube and a moving camara for easier debugging.
```bash
python3 generate.py new_project
```
Where new_project is the project_name, the index of the server will get dynamically updated.

# Build & Run
The container has a bind mount to the `public` folder, so changes in the local codebase are reflected in the container's filesystem, which in turn affects the page served `localhost:8080` due to the port mapping.

## Build Docker Image
```bash
docker build -t my-threejs-server .
```
## Run Container
(Run while located in the root of the project)
```bash
docker run -p 8080:8080 -v $(pwd)/public:/app/public my-threejs-server
```

For easier use `run.sh` contains these two commands.