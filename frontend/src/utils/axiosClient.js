import axios from "axios"

const axiosClient =  axios.create({
   // baseURL: 'http://localhost:3000',
   baseURL: 'https://code-shastra-awq7.vercel.app',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;





