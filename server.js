import { serve } from 'bun';
import { file } from 'bun';
import { dir } from 'bun';
import { join } from 'path';

// Import routes
import routes from './routes';

// Get port from command line argument or environment variable, default to 3000
const PORT = process.argv[2] || process.env.PORT || 3000;

// Create the server
const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    // Handle API routes
    if (url.pathname.startsWith('/api')) {
      return handleApiRequest(req, url);
    }
    
    // Serve static files
    return handleStaticRequest(req, url);
  },
});

// API request handler
async function handleApiRequest(req, url) {
  const path = url.pathname.replace('/api', '');
  const method = req.method;
  
  // Get the route handler from routes
  const routeHandler = routes[method]?.[path];
  
  if (routeHandler) {
    try {
      const body = req.method === 'POST' ? await req.json() : undefined;
      return new Response(JSON.stringify(await routeHandler(body)), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Static file handler
async function handleStaticRequest(req, url) {
  const path = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = join(process.cwd(), path.slice(1));
  
  try {
    const file = Bun.file(filePath);
    if (await file.exists()) {
      const contentType = getContentType(path);
      return new Response(file, {
        headers: { 'Content-Type': contentType }
      });
    }
  } catch (error) {
    console.error('Error serving static file:', error);
  }
  
  return new Response('Not found', { status: 404 });
}

// Helper function to determine content type
function getContentType(path) {
  const ext = path.split('.').pop()?.toLowerCase();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif'
  };
  return types[ext] || 'text/plain';
}

console.log(`Server running on port ${PORT}`); 