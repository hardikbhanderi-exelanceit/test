import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchPageBySlug = async (slug) => {
  try {
    const response = await api.get(`/pages`, {
      params: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: {
          sections: {
            populate: '*',
          },
        },
      },
    });
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
};

export const fetchProducts = async (ids = null) => {
  try {
    const params = {
      populate: '*',
      filters: {
        isShow: {
          $eq: true,
        },
      },
    };

    if (ids && ids.length > 0) {
      const isDocumentId = typeof ids[0] === 'string' && ids[0].length > 10;
      if (isDocumentId) {
        params.filters.documentId = {
          $in: ids,
        };
      } else {
        params.filters.id = {
          $in: ids,
        };
      }
    }

    const response = await api.get('/products', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getImageUrl = (imageData) => {
  if (!imageData) return null;

  // Handle both single image and image array
  const image = Array.isArray(imageData) ? imageData[0] : imageData;

  if (!image?.url) return null;

  // If URL is absolute, return as is
  if (image.url.startsWith('http')) {
    return image.url;
  }

  // Otherwise, prepend base URL
  // We need to use the origin (e.g., http://localhost:1337) rather than the API URL
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}${image.url}`;
};

export default api;
