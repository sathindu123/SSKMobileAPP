import { API_BASE_URL } from "../config/apiConfig"

export const saveStock = async (params: any) => {
    console.log(params);
    console.log("sa")
  try {
    const response = await fetch(API_BASE_URL,{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        action:"saveStock",
        ...params
      })
    });

    console.log(response.text);
    return await response.text();


  } catch (error) {
    console.error("Error connecting to GS:", error);
  }
};



export const getStock = async (page = 1, limit = 3) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=loadStock&page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

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