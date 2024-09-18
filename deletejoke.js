async function deleteJoke(id) {
    try {
      const response = await fetch(`http://localhost:3000/deljokes/${id}`, {
        method: 'DELETE', // HTTP method for deleting
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      });
  
      if (!response.ok) {
        // Check if the response status is not OK (status code 200-299)
        const errorData = await response.json();
        throw new Error(`Server error: ${errorData}`);
      }
  
      // Parse the JSON response from the server
      const data = await response.json();
      console.log('Joke successfully deleted:', data);
    } catch (error) {
      console.error('Error deleting joke:', error);
    }
  }
  
  // Example usage
  deleteJoke(102); 
  