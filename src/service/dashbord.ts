import { API_BASE_URL } from "../config/apiConfig";

export const loadDashbordData = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=loaduserDashbordAdmin`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await response.json();

    return data;

    

  } catch (err) {
    console.error("Get Customers Error:", err);
    throw err;
  }
};