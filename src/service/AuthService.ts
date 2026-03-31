import { API_BASE_URL } from "../config/apiConfig"

export const registerUser = async (params: any) => {
  try {
    const response = await fetch(API_BASE_URL,{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        action:"register",
        ...params
      })
    });

    const result = await response.text();
    return result;

  } catch (error) {
    console.error("Error connecting to GS:", error);
  }
};


export const loginUser = async (params: any) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "login",
        ...params 
      })
    });

    const result = await response.json();
    return result; 

  } catch (error) {
    console.error("Login Error:", error);
    return { status: "error", message: "සම්බන්ධතාවය බිඳ වැටී ඇත." };
  }
};