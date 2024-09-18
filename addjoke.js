async function postJoke(jokeText, jokeType) {
    const url = 'http://localhost:3000/jokes'; 
  
    const data = {
      text: jokeText,
      type: jokeType
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      // Check if the response status is not OK
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Server error: ${errorText}`);
      }
  
      // Parse and log the response
      const result = await response.json();
      console.log('Joke successfully added:', result);
    } catch (error) {
      console.error('Error posting joke:', error);
    }
  }
  
  // Example usage:
  const jokeText = "Why did the chicken cross the road? To get to the other side!";
  const jokeType = "classic";
  
  postJoke(jokeText, jokeType);
  