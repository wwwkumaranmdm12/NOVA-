import axios from "axios";

// Render Backend URL (Trailing slash-oda check pannikonga)
const API_BASE_URL = "https://nova-ai-4-lz1f.onrender.com";

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat`, // Neenga backend-la use panra exact endpoint path-ah inga podunga (e.g., /chat or /api/chat)
      {
        message: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      }
    );

    console.log("Backend response:", response.data);

    return response.data.reply;
  } catch (error) {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("No response from backend.");
    } else {
      console.error("Request error:", error.message);
    }

    throw error;
  }
};