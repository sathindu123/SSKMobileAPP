import { API_BASE_URL } from "../config/apiConfig";

export const saveCustomer = async (params: any) => {
  try {
    const response = await fetch(API_BASE_URL,{
      method: "POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        action:"saveCustomer",
        ...params
      })
    });

    console.log(response.text);
    return await response.text();


  } catch (error) {
    console.error("Error connecting to GS:", error);
  }
};