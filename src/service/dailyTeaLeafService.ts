import { API_BASE_URL } from "../config/apiConfig"

export const saveTeaLeaf = async (parms: any) => {
    try{
        const response = await fetch(API_BASE_URL,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                action:"saveDailyCount",
                ...parms
            })
        });

        return await response.text();

    }catch(error){
        console.error("Error connecting to GS:", error);
    }
}


export const getTeaLeaves = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=loadTeaLeafDaily`, {
      method: "GET",
      headers: {
        "Accept": "application/json", 
      }
    });

    const responseText = await response.text();
    

    try {
      const data = JSON.parse(responseText); // මෙතනදී JSON බවට හරවන්න
      return data;
    } catch (parseError) {
      console.error("JSON Parsing failed. Response was not JSON:", responseText);
      throw new Error("Server returned HTML instead of JSON");
    }

  } catch (err) {
    console.error("Get Tea Leaves Error:", err);
    throw err;
  }
};

export const getNameDailyLeaf = async (farmerId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=GetNameforID&farmerId=${farmerId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    return data;

  } catch (err) {
    console.log("API Error:", err);
  }
};