const fetch = require('node-fetch');

module.exports = async function() {
  // Check if the API key is available in the environment
  if (process.env.SUPER_USEFUL_API) {
    // Determine the base URL based on the environment
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://api.suf.io' : 'http://localhost:3000';

    try {
      // Fetch blog posts from the API
      const response = await fetch(`${baseUrl}/blog/get?key=${process.env.SUPER_USEFUL_API}`);
      const data = await response.json();

      // Return the fetched posts
      return data.posts;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  } else {
    // Return an empty array if the API key is not available
    console.warn('SUPER_USEFUL_API key not found in environment variables');
    return [];
  }
};