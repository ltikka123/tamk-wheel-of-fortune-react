import { API_URL, COOKIE_TOKEN } from "../Definitions";

// Helper function to get the authorization headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  authorization: `Bearer ${localStorage.getItem(COOKIE_TOKEN)}`,
});

export const fetchList = async (list: string) => {
  try {
    const response = await fetch(`${API_URL}/api/lists/${list}`, {
      headers: getAuthHeaders(),
    });

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${list}:`, error);
    throw error;
  }
};

export const addToList = async (list: string, name: string) => {
  try {
    const response = await fetch(
      `${API_URL}/api/lists/${list}/${encodeURIComponent(name)}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
      }
    );

    return await response.json();
  } catch (error) {
    console.error(`Failed to add ${list}:`, error);
    throw error;
  }
};

export const removeFromList = async (list: string, id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/lists/${list}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return await response.json();
  } catch (error) {
    console.error(`Failed to remove ${list}:`, error);
    throw error;
  }
};
