
const API_BASE_URL = 'http://localhost:8000/api';

const createHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  return headers;
};

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {};
    }

    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {};
    }

    return response.json();
  },
};
