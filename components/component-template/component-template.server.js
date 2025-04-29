// Component template API handlers
export default {
  get: async () => {
    return { message: 'Component template API endpoint' };
  },
  
  post: async (data) => {
    return { received: data };
  }
}; 