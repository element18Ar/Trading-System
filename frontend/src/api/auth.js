// This function handles sending user data to your backend API server
export const registerUser = async (userData) => {
  // IMPORTANT: Replace 'http://localhost:5000' with the actual URL 
  // where your backend is running.
  const BACKEND_URL = 'http://localhost:5000/api'; // Example base URL

  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Check if the response status is 2xx (Success)
    if (!response.ok) {
      // Throw an error with the message from the backend, if available
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed due to server error.');
    }

    // Return the successful response data
    return response.json();

  } catch (error) {
    // Log the error and re-throw it to be handled by the component
    console.error("Registration API Error:", error.message);
    throw error;
  }
};