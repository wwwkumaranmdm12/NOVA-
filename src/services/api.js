import axios from "axios";

const API_URL = "https://nova-ai-1-4nt2.onrender.com";

export const sendMessage = async (message) => {
  try {
    const response = await axios.post(
      API_URL,
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