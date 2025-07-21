import axios from 'axios';

export async function compileLatex(latex) {
  const response = await axios.post(
    'http://localhost:3000/api/compile',
    { code: latex },
    { responseType: 'blob' }
  );
  return response.data;
} 