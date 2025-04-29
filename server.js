import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import routes from './routes.js';

// Get port from command line argument or environment variable, default to 5454
const PORT = process.argv[2] || process.env.PORT || 5454;

// Create Express app
const app = express();

// Set up livereload
const liveReloadServer = livereload.createServer({
  exts: ['html', 'css', 'js'],
  delay: 1000
});

// Watch the entire project directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
liveReloadServer.watch(__dirname);

// Add livereload middleware
app.use(connectLivereload());

// Serve static files from the root directory
app.use(express.static(__dirname));

// API routes
app.use('/api', (req, res, next) => {
  const path = req.path;
  const method = req.method;
  
  // Get the route handler from routes
  const routeHandler = routes[method]?.[path];
  
  if (routeHandler) {
    try {
      const body = req.method === 'POST' ? req.body : undefined;
      routeHandler(body)
        .then(result => res.json(result))
        .catch(error => res.status(400).json({ error: 'Invalid request' }));
    } catch (error) {
      res.status(400).json({ error: 'Invalid request' });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Create HTTP server
const server = createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Auto-reload enabled - changes will be automatically detected');
}); 