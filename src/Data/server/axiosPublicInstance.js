import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL


const axiosPublicInstance = axios.create({
    baseURL: baseUrl, // ✅ Correct key
});


export default axiosPublicInstance

//login api do not need token -- 