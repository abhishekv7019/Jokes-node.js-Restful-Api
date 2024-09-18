async function updateJoke(id, jokeType, jokeText) {
    try {
      const response = await fetch(`http://localhost:3000/jokes/${id}`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({
          jokeType: jokeType,
          jokeText: jokeText,
        }), 
      });
  
      if (!response.ok) {
        // Check if the response status is not OK (status code 200-299)
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData}`);
      }
  
      // Parse the JSON response from the server
      const data = await response.json();
      console.log('Joke successfully updated:', data);
    } catch (error) {
      console.error('Error updating joke:', error);
    }
  }
  
  // Example usage
  updateJoke(1, 'new type', 'New joke text');
  