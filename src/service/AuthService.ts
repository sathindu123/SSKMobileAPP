

const handleSaveData = async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbw-gAa8zKPI9MUR6J8qwn1AG1bl03ZsLYy0u0eqAY38fVcyjZpGj9LKnbud7clF3YAP/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Mahesh',
        email: 'mahesh@example.com'
      }),
    });
    
    const result = await response.text();
    console.log(result); 
  } catch (error) {
    console.error("Error connecting to GS:", error);
  }
};

export const registerUser = async (params: any) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbw-gAa8zKPI9MUR6J8qwn1AG1bl03ZsLYy0u0eqAY38fVcyjZpGj9LKnbud7clF3YAP/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error("Error connecting to GS:", error);
  }
};

