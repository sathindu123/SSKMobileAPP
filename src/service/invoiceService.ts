import { API_BASE_URL } from "../config/apiConfig";

export const loadInvoiceData = async (billID: string, month: string, year: string) => {
    console.log(billID);
  try {

    if (!billID) throw new Error("Bill ID missing");

    const response = await fetch(
      `${API_BASE_URL}?action=loadInvoiceDataUser&billID=${billID}&month=${month}&year=${year}`
    );

    const data = await response.json();


    return data;

  } catch (err) {
    console.error("Get Invoice Error:", err);
    return null;
  }
};


export const saveAdvace = async (parms: any) => {
    try{
        const response = await fetch(API_BASE_URL,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                action:"saveAdvance",
                ...parms
            })
        });

        return await response.text();

    }catch(error){
        console.error("Error connecting to GS:", error);
    }
}

export const savePohora = async (parms: any) => {
    try{
        const response = await fetch(API_BASE_URL,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                action:"savePohora",
                ...parms
            })
        });

        return await response.text();

    }catch(error){
        console.error("Error connecting to GS:", error);
    }
}

export const saveTeaPacket = async (parms: any) => {
    try{
        const response = await fetch(API_BASE_URL,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                action:"saveTeapacket",
                ...parms
            })
        });

        return await response.text();

    }catch(error){
        console.error("Error connecting to GS:", error);
    }
}



export const getAdvanceData = async (
  page: number = 1,
  limit: number = 5
) => {

  try {

    const response = await fetch(
      `${API_BASE_URL}?action=getAdvanceData&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load advance data");
    }

    const data = await response.json();
    return data;

  } catch (err) {

    console.log("Get Advance Error:", err);
    throw err;
  }
};


export const getTeapacketData = async (
  page: number = 1,
  limit: number = 5
) => {

  try {

    const response = await fetch(
      `${API_BASE_URL}?action=getTeapacketData&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load Teapacket data");
    }

    const data = await response.json();
    return data;

  } catch (err) {

    throw err;
  }
};


export const getPohoraData = async (
  page: number = 1,
  limit: number = 5
) => {

  try {

    const response = await fetch(
      `${API_BASE_URL}?action=getPohoraData&page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to load Teapacket data");
    }

    const data = await response.json();

    return data;

  } catch (err) {

    throw err;
  }
};

