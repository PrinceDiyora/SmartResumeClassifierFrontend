import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

// export async function compileLatex(latex) {
//   const response = await axios.post(
//     'http://localhost:3000/api/compile',
//     { code: latex },
//     { responseType: 'blob' }
//   );
//   return response.data;
// } 

export async function compileAndSave({ id, title, code, token }) {
  try {
    const response = await axios.post(
      `${API}/api/compile/save`,
      { id, title, code },
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Compile API Error:', error);
    console.error('Error response:', error.response);
    
    // Handle compilation errors
    if (error.response && error.response.status === 500) {
      // Try to extract error details from the response
      if (error.response.data instanceof Blob) {
        try {
          console.log('Parsing blob error response...');
          const errorText = await error.response.data.text();
          console.log('Blob text content:', errorText);
          
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (jsonError) {
            console.error('Failed to parse JSON from blob:', jsonError);
            // If it's not JSON, treat it as plain text error
            const compilationError = new Error('LaTeX compilation failed');
            compilationError.details = {
              stderr: errorText,
              stdout: '',
              type: 'compilation'
            };
            throw compilationError;
          }
          
          console.log('Parsed error data from blob:', errorData);
          
          if (errorData.error === "LaTeX compilation failed") {
            const compilationError = new Error('LaTeX compilation failed');
            compilationError.details = {
              stderr: errorData.stderr || 'No detailed error information available',
              stdout: errorData.stdout || '',
              type: 'compilation'
            };
            console.log('Created compilation error with details:', compilationError.details);
            throw compilationError;
          }
        } catch (blobError) {
          console.error('Error processing blob response:', blobError);
        }
      } else if (error.response.data) {
        // Response is already parsed JSON
        console.log('Error response data is JSON:', error.response.data);
        
        if (error.response.data.error === "LaTeX compilation failed") {
          const compilationError = new Error('LaTeX compilation failed');
          compilationError.details = {
            stderr: error.response.data.stderr || 'No detailed error information available',
            stdout: error.response.data.stdout || '',
            type: 'compilation'
          };
          console.log('Created compilation error with details:', compilationError.details);
          throw compilationError;
        }
      }
    }
    
    // Re-throw the original error if we couldn't parse it
    throw error;
  }
}