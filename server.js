import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve each project dynamically
app.use(express.static(path.join(__dirname, 'public')));

// Dynamically generate project list
app.get('/', (req, res) => {
    const publicDir = path.join(__dirname, 'public');
    const projects = fs.readdirSync(publicDir).filter(file =>
        fs.statSync(path.join(publicDir, file)).isDirectory()
    );

    const projectLinks = projects.map(project =>
        `<li><a href="/${project}">${project.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</a></li>`
    ).join('\n');

    res.send(`
        <h1>Three.js Projects</h1>
        <ul>
            ${projectLinks}
        </ul>
    `);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
