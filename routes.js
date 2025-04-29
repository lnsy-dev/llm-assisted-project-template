// Import component server files
import componentTemplateRoutes from './components/component-template/component-template.server.js';

// Define routes object
const routes = {
  GET: {
    '/component-template': componentTemplateRoutes.get,
  },
  POST: {
    '/component-template/data': componentTemplateRoutes.post,
  },
};

export default routes; 