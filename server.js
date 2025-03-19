import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve each project dynamically
app.use(express.static(path.join(__dirname, 'public')));

// Redirect `/` to a home page listing the projects (optional)
app.get('/', (req, res) => {
    res.send(`
        <h1>Three.js Projects</h1>
        <ul>
            <li><a href="/project1">Project 1</a></li>
            <li><a href="/project2">Project 2</a></li>
        </ul>
    `);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
