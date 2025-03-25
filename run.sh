docker build -t my-threejs-server .
docker run -p 8080:8080 -v $(pwd)/public:/app/public my-threejs-server