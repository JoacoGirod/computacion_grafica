# To Do
- Script for generating a new project
- Hot Reload
- Add rotation in x axis to the camera

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
```
# New Projects
A folder has to be created within public with the desired name and optionally a link can be added in the `server.js` that points to that project

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