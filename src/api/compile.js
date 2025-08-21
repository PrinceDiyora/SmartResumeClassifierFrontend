import axios from 'axios';

// export async function compileLatex(latex) {
//   const response = await axios.post(
//     'http://localhost:3000/api/compile',
//     { code: latex },
//     { responseType: 'blob' }
//   );
//   return response.data;
// } 

export async function compileAndSave({ id, title, code, token }) {
  const response = await axios.post(
    'http://localhost:3000/api/compile/save',
    { id, title, code },
    {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}