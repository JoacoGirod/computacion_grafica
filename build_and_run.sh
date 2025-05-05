docker build -t threejs-server .
docker run -p 8080:8080 -v $(pwd)/public:/app/public threejs-server